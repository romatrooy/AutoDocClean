'use client';
import { useEffect } from 'react';

export default function GoogleAuthPage() {
  useEffect(() => {
    const fetchGoogleAuthUrl = async () => {
      try {
        console.log('Starting Google auth process...');
        
        const response = await fetch('http://localhost:8000/api/v1/auth/google/login', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        
        if (data && data.url) {
          console.log('Got URL, redirecting to:', data.url);
          setTimeout(() => {
            window.location.href = data.url;
          }, 100);
        } else {
          throw new Error('No URL in response');
        }
        
      } catch (error) {
        console.error('Error:', error);
        window.location.href = '/?error=google_auth_failed';
      }
    };

    fetchGoogleAuthUrl();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Connecting to Google...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}