import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { Adjustments } from './components/Adjustments';
import { editImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('A fluffy cat wearing sunglasses on a beach.');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);

  const handleImageChange = (file: File) => {
    setOriginalImageFile(file);
    setEditedImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please select an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setEditedImage(null);
    setError(null);

    try {
      const base64Image = await fileToBase64(originalImageFile);
      const mimeType = originalImageFile.type;
      
      let finalPrompt = prompt;
      const adjustments = [];
      if (brightness !== 0) {
          adjustments.push(`${brightness > 0 ? 'increase' : 'decrease'} brightness by ${Math.abs(brightness)}%`);
      }
      if (contrast !== 0) {
          adjustments.push(`${contrast > 0 ? 'increase' : 'decrease'} contrast by ${Math.abs(contrast)}%`);
      }
      if (saturation !== 0) {
          adjustments.push(`${saturation > 0 ? 'increase' : 'decrease'} saturation by ${Math.abs(saturation)}%`);
      }

      if (adjustments.length > 0) {
          const adjustmentsString = adjustments.join(', ');
          finalPrompt = `${prompt}. Additionally, please apply the following adjustments: ${adjustmentsString}.`;
      }

      const generatedImage = await editImageWithPrompt(base64Image, mimeType, finalPrompt);
      
      if (generatedImage) {
        setEditedImage(`data:${mimeType};base64,${generatedImage}`);
      } else {
         setError('The AI model did not return an image. Please try again.');
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt, brightness, contrast, saturation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-8">
          
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center"><span className="w-6 h-6 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center mr-3">1</span>Upload Image</h2>
            <ImageUploader onImageChange={handleImageChange} imagePreviewUrl={originalImagePreview} />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center"><span className="w-6 h-6 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center mr-3">2</span>Describe Edit</h2>
            <PromptInput prompt={prompt} onPromptChange={setPrompt} />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center"><span className="w-6 h-6 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center mr-3">3</span>Fine-Tune Adjustments</h2>
            <Adjustments 
              brightness={brightness} onBrightnessChange={setBrightness}
              contrast={contrast} onContrastChange={setContrast}
              saturation={saturation} onSaturationChange={setSaturation}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !originalImageFile || !prompt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center">
            <ResultDisplay 
                isLoading={isLoading} 
                editedImageUrl={editedImage} 
                error={error} 
            />
        </div>
      </main>
    </div>
  );
};

export default App;
