import { signIn } from '~/modules/auth.client';
import googleIcon from '~/components/icons/google_icon.svg';

type GoogleLoginButtonProps = {
  isDemoMode?: boolean;
}

export default function GoogleLoginButton({
  isDemoMode = false,
}: GoogleLoginButtonProps) {
  const handleGoogleSignIn = async () => {
    if (isDemoMode) {
      // デモモードの場合は専用のエンドポイントを使用
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/demo-login';
      document.body.appendChild(form);
      form.submit();
    } else {
      await signIn.social({
        provider: 'google',
        callbackURL: window.location.pathname,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="flex items-center justify-start bg-base-200 rounded-md p-2 border border-gray-300 gap-x-10 hover:bg-base-300 w-full"
    >
      <img src={googleIcon} alt="GoogleIcon" className="w-10 h-10 mx-4" />
      <span className="md:mx-6">
        {isDemoMode ? 'デモユーザーでログイン' : 'Googleで認証する'}
      </span>
    </button>
  );
}
