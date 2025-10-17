import React from 'react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  isLoading: boolean;
  editedImageUrl: string | null;
  error: string | null;
}

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, editedImageUrl, error }) => {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-900/50 rounded-lg p-4 relative overflow-hidden">
      {isLoading && (
        <div className="flex flex-col items-center text-gray-400">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center text-red-400">
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && editedImageUrl && (
         <>
            <img src={editedImageUrl} alt="Generated result" className="max-h-full max-w-full object-contain rounded-md shadow-lg" />
            <a
                href={editedImageUrl}
                download="vimageai-edited.png"
                title="Download high-resolution image"
                aria-label="Download Image"
                className="absolute top-4 right-4 bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
                <DownloadIcon />
            </a>
         </>
      )}
      {!isLoading && !error && !editedImageUrl && (
        <div className="text-center text-gray-500 flex flex-col items-center">
            <svg xmlns="http://www.w.org/2000/svg" className="h-20 w-20 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-5l-1.5-1.5a2.25 2.25 0 00-3.182 0L12 8.5M12 15l-3-3m0 0l-1.5 1.5a2.25 2.25 0 000 3.182L12 21M12 3v3.375c0 .621.504 1.125 1.125 1.125h3.375" />
            </svg>
            <p className="text-xl font-medium">Your Edited Image Appears Here</p>
            <p>Upload an image and describe your vision.</p>
        </div>
      )}
    </div>
  );
};