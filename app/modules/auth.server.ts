import { betterAuth } from 'better-auth';
import { redirect } from '@remix-run/node';

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.CLIENT_URL
) {
  throw new Error('Missing environment variables');
}

const SESSION_SECRET = process.env.HPE_SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET environment variable');
}

// デモモードの判定
const IS_DEMO_MODE = process.env.GOOGLE_CLIENT_ID === 'google-client-demo-id';
const DEMO_USER = {
  id: 'demo-user-uuid',
  email: 'demo@example.com',
  name: 'Demo User',
  image: undefined,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const auth = betterAuth({
  secret: SESSION_SECRET,
  baseURL: process.env.CLIENT_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieName: '__healthy_person_emulator',
    expiresIn: 60 * 60 * 24 * 30, // 30日
    updateAge: 60 * 60 * 24, // 1日
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7日
      strategy: 'jwe',
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: 'cookie',
    storeAccountCookie: true,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

/**
 * デモ用のモック認証処理
 * デモモードの場合に使用され、実際のGoogle認証をスキップする
 */
export async function handleDemoAuth(request: Request) {
  if (!IS_DEMO_MODE) {
    throw new Error('Demo auth is only available in demo mode');
  }

  // デモユーザーのセッションを作成
  const session = await auth.api.signInSocial({
    body: {
      provider: 'google',
      callbackURL: '/',
    },
    headers: request.headers,
  });

  return redirect('/?loginSuccess=true');
}

/**
 * デモモードかどうかを返す
 */
export function isDemoMode(): boolean {
  return IS_DEMO_MODE;
}

/**
 * デモユーザー情報を返す
 */
export function getDemoUser() {
  return DEMO_USER;
}
