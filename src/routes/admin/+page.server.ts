/* eslint-disable @typescript-eslint/only-throw-error */
import { fail, redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies, request }) => {
  const isAdmin = cookies.get('is_admin') === 'true';

  // 이미 관리자 세션이 있다면 대시보드로 즉시 이동
  if (isAdmin) {
    throw redirect(303, '/admin/dashboard');
  }

  // 실서버/미리보기 배포 환경인 경우
  if (!dev) {
    const userEmail = request.headers.get('Cf-Access-Authenticated-User-Email');

    // Cloudflare Access가 헤더로 보내준 이메일이 존재하면 자동 로그인 처리
    if (userEmail) {
      cookies.set('is_admin', 'true', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      throw redirect(303, '/admin/dashboard');
    }

    return {
      isLocal: false,
      error: 'Cloudflare Access 로그인 인증 정보가 없습니다. Zero Trust 설정을 확인해 주세요.',
    };
  }

  // 로컬 개발 환경인 경우
  return {
    isLocal: true,
    error: null,
  };
};

export const actions: Actions = {
  login: ({ cookies }) => {
    // 보안을 위해 실서버에서는 로컬 로그인 우회 작동 불가
    if (!dev) {
      return fail(403, { unauthorized: true });
    }

    // 로컬 개발 환경에서는 버튼을 누르는 즉시 관리자 쿠키 발급
    cookies.set('is_admin', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // 로컬 개발망은 HTTP이므로 false 허용
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(303, '/admin/dashboard');
  },
};
