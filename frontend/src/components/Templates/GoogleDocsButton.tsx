'use client';
import { useState } from 'react';

interface GoogleDocsButtonProps {
  templateId: number;
  variables?: Record<string, string> | string[];
}

export default function GoogleDocsButton({ templateId, variables }: GoogleDocsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGoogleDoc = async () => {
    try {
      setLoading(true);
      setError(null);

      let variablesObj: Record<string, string> = {};
      
      if (variables) {
        if (Array.isArray(variables)) {
          variables.forEach(key => {
            variablesObj[key] = '';
          });
        } else {
          variablesObj = variables;
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/templates/${templateId}/google-docs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variablesObj)
      });

      if (!response.ok) {
        throw new Error('Failed to create Google Doc');
      }

      const data = await response.json();
      
      window.open(data.url, '_blank');
    } catch (err) {
      console.error('Error creating Google Doc:', err);
      setError('Failed to create Google Doc. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCreateGoogleDoc}
        disabled={loading}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <svg className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.6 13.5H10.5V15.6H9.3V13.5H7.2V12.3H9.3V10.2H10.5V12.3H12.6M14.4 19.5H5.1C3.945 19.5 3 18.555 3 17.4V6.6C3 5.445 3.945 4.5 5.1 4.5H14.4C15.555 4.5 16.5 5.445 16.5 6.6V17.4C16.5 18.555 15.555 19.5 14.4 19.5M14.4 6.6H5.1V17.4H14.4M21.3 8.1H18V6.3H21.3V8.1M21.3 19.5H18V15.9H21.3M21.3 14.1H18V9.9H21.3V14.1Z" />
            </svg>
            Create Google Doc
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </>
  );
}
