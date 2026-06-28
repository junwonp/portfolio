interface AdminSessionPayload {
  email: string;
  exp: number;
  iat: number;
}

interface CreateAdminSessionCookieInput {
  email: string;
  maxAgeSeconds?: number;
  now?: Date;
  secret: string;
}

interface VerifyAdminSessionCookieInput {
  cookie: string | null | undefined;
  now?: Date;
  secret: string | null | undefined;
}

interface RuntimeEnv {
  ADMIN_SESSION_SECRET?: unknown;
}

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_COOKIE_VERSION = 'v1';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const base64UrlToBytes = (value: string): Uint8Array => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const bytesToArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

const encodeJson = (value: AdminSessionPayload): string =>
  bytesToBase64Url(textEncoder.encode(JSON.stringify(value)));

const decodeJson = (value: string): AdminSessionPayload | null => {
  try {
    const parsed = JSON.parse(textDecoder.decode(base64UrlToBytes(value))) as Partial<AdminSessionPayload>;

    if (
      typeof parsed.email !== 'string' ||
      !parsed.email.trim() ||
      typeof parsed.exp !== 'number' ||
      typeof parsed.iat !== 'number'
    ) {
      return null;
    }

    return {
      email: parsed.email,
      exp: parsed.exp,
      iat: parsed.iat,
    };
  } catch {
    return null;
  }
};

const importHmacKey = (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    {
      hash: 'SHA-256',
      name: 'HMAC',
    },
    false,
    ['sign', 'verify'],
  );

const signValue = async (value: string, secret: string): Promise<string> => {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
};

const verifySignature = async (
  value: string,
  signature: string,
  secret: string,
): Promise<boolean> => {
  const key = await importHmacKey(secret);

  try {
    return crypto.subtle.verify(
      'HMAC',
      key,
      bytesToArrayBuffer(base64UrlToBytes(signature)),
      textEncoder.encode(value),
    );
  } catch {
    return false;
  }
};

export const getAdminSessionSecret = (env: object | undefined): string | null => {
  const runtimeEnv = {
    ...process.env,
    ...(env ?? {}),
  } as RuntimeEnv;
  const secret = runtimeEnv.ADMIN_SESSION_SECRET;

  return typeof secret === 'string' && secret.trim() ? secret.trim() : null;
};

export const createAdminSessionCookie = async ({
  email,
  maxAgeSeconds = ADMIN_SESSION_MAX_AGE,
  now = new Date(),
  secret,
}: CreateAdminSessionCookieInput): Promise<string> => {
  const nowSeconds = Math.floor(now.getTime() / 1000);
  const payload = encodeJson({
    email,
    exp: nowSeconds + maxAgeSeconds,
    iat: nowSeconds,
  });
  const signedValue = `${ADMIN_SESSION_COOKIE_VERSION}.${payload}`;
  const signature = await signValue(signedValue, secret);

  return `${signedValue}.${signature}`;
};

export const verifyAdminSessionCookie = async ({
  cookie,
  now = new Date(),
  secret,
}: VerifyAdminSessionCookieInput): Promise<{ email: string } | null> => {
  if (!cookie || !secret) {
    return null;
  }

  const [version, payloadValue, signature] = cookie.split('.');
  if (version !== ADMIN_SESSION_COOKIE_VERSION || !payloadValue || !signature) {
    return null;
  }

  const signedValue = `${version}.${payloadValue}`;
  const isValidSignature = await verifySignature(signedValue, signature, secret);
  if (!isValidSignature) {
    return null;
  }

  const payload = decodeJson(payloadValue);
  if (!payload) {
    return null;
  }

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (payload.exp <= nowSeconds || payload.iat > nowSeconds + 60) {
    return null;
  }

  return {
    email: payload.email,
  };
};

export const getAdminSessionCookieOptions = (isSecure: boolean) => ({
  httpOnly: true,
  maxAge: ADMIN_SESSION_MAX_AGE,
  path: '/',
  sameSite: 'lax' as const,
  secure: isSecure,
});

export const getSafeAdminSessionReturnTo = (value: string | null): string => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/a';
  }

  try {
    const url = new URL(value, 'https://portfolio.local');
    if (url.pathname === '/' || url.pathname === '/a' || url.pathname.startsWith('/a/')) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return '/a';
  }

  return '/a';
};
