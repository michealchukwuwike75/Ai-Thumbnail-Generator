import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import { Spinner } from './components/Spinner';
import { DownloadIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = `Create a hyper-realistic, eye-catching, cinematic thumbnail with a 16:9 aspect ratio, suitable for a video essay. The image should feature a mysterious hero in a sleek, dark suit with glowing red accents, perched on a gargoyle overlooking a rain-slicked, neon-lit city at night. The mood is dramatic and contemplative. The composition must include the text "The Man behind the Mask" in a bold, cinematic font. Below this, in a secondary font, the text "THE AMAZING SPIDERMAN 2" should be visible. The text should be integrated naturally into the image's composition while being clearly legible.`;

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateImage(prompt);
      setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
            AI Thumbnail Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Create stunning, cinematic thumbnails with a single click.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-red-500/10 p-6 sm:p-8 border border-gray-700">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Prompt Details</h2>
              <p className="mt-2 text-sm text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                {prompt}
              </p>
            </div>
            
            <div className="aspect-video w-full bg-gray-900/70 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center text-gray-400">
                  <Spinner />
                  <p className="mt-4 text-lg">Generating your masterpiece...</p>
                  <p className="text-sm text-gray-500">This can take a moment.</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-400 p-4">
                  <h3 className="font-bold">Generation Failed</h3>
                  <p className="text-sm">{error}</p>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Generated thumbnail" className="object-contain w-full h-full" />
              ) : (
                 <div className="text-center text-gray-500">
                    <p className="text-xl font-medium">Your generated thumbnail will appear here.</p>
                    <p>Click "Generate Thumbnail" to begin.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 disabled:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Generating...' : 'Generate Thumbnail'}
              </button>
              
              {generatedImage && !isLoading && (
                 <a
                  href={generatedImage}
                  download="ai-thumbnail.jpg"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download Image
                </a>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
