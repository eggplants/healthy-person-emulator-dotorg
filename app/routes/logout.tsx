import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { auth } from '~/modules/auth.server';
import { destroyVisitorCookie } from '~/modules/visitor.server';
import { sessionStorage } from '~/modules/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // better-authセッションをクリア
  await auth.api.signOut({ headers: request.headers });
  
  // Remixセッション（デモユーザー用）もクリア
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );
  
  // visitorクッキーを破棄
  const visitorHeaders = await destroyVisitorCookie(request);
  
  // 両方のセッションをクリアするヘッダーを設定
  const headers = new Headers(visitorHeaders);
  headers.append('Set-Cookie', await sessionStorage.destroySession(session));
  
  return redirect('/', { headers });
}
