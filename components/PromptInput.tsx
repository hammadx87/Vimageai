
import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
        Editing Prompt
      </label>
      <textarea
        id="prompt"
        rows={4}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g., Make this a futuristic cyberpunk scene"
      />
    </div>
  );
};
