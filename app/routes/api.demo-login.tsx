import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { isDemoMode, getDemoUser } from '~/modules/auth.server';
import { getVisitorCookieURL } from '~/modules/visitor.server';
import { sessionStorage } from '~/modules/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!isDemoMode()) {
    throw new Error('Demo login is only available in demo mode');
  }

  const demoUser = getDemoUser();
  
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );
  
  session.set('user', demoUser);
  
  const visitorRedirectUrl = await getVisitorCookieURL(request);
  const redirectUrl = `${visitorRedirectUrl ?? '/'}?loginSuccess=true`;
  
  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return new Response('Method not allowed', { status: 405 });
}
