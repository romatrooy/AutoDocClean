'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        console.error('No code in URL');
        router.push('/?error=no_code');
        return;
      }

      try {
        console.log('Sending code to backend:', code);
        
        const response = await fetch('http://localhost:8000/api/v1/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: 'http://localhost:3000/auth/callback'
          })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Backend error:', errorText);
          throw new Error(errorText);
        }

        const data = await response.json();
        console.log('Got token response');
        
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          router.push('/templates');
        } else {
          throw new Error('No token in response');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/?error=callback_failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Processing Google authentication...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}