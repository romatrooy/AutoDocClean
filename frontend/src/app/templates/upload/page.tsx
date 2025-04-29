'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navigation/Navbar';
import TemplateUploadForm from '@/components/Templates/TemplateUploadForm';

export default function UploadTemplatePage() {
  const router = useRouter();
  
  const handleUploadSuccess = () => {
    router.push('/templates');
  };
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/templates"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Template</h1>
            <TemplateUploadForm onSuccess={handleUploadSuccess} />
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About Templates</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Templates allow you to create reusable documents with variable placeholders.
                </p>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Supported file types:</h3>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Text files (.txt)</li>
                    <li>Microsoft Word (.docx)</li>
                    <li>HTML files (.html)</li>
                    <li>Markdown files (.md)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Using variables:</h3>
                  <p>
                    Use double curly braces to define variables in your templates.
                    For example: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{client_name}}'}</code>
                  </p>
                </div>
                <Link
                  href="/templates/instructions"
                  className="block mt-4 text-blue-600 hover:text-blue-800"
                >
                  View full instructions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
