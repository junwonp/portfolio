import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { isCurrentRequestAdmin } from '@/lib/server/adminRequest';
import { parseContentOverrideRequest } from '@/lib/server/contentOverrideRequest';
import { getDb } from '@/lib/server/db';
import { saveContentOverride } from '@/lib/server/editableContentStore';

export async function POST(request: Request) {
  if (!(await isCurrentRequestAdmin())) {
    return NextResponse.json({ error: 'Admin access is required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = parseContentOverrideRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database binding is missing' }, { status: 500 });
  }

  await saveContentOverride(db, parsed.value);
  revalidatePath('/');

  if (parsed.value.area === 'project-detail') {
    const [slug] = parsed.value.targetKey.split('::');
    if (slug) {
      revalidatePath(`/projects/${slug}`);
    }
  }

  return NextResponse.json({ success: true });
}
