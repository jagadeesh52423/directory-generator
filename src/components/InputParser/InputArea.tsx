// src/components/InputParser/InputArea.tsx
import React, { useState } from 'react';
import { Upload, HelpCircle } from 'lucide-react';

interface InputAreaProps {
  onParse: (input: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onParse }) => {
  const [input, setInput] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleParse = () => {
    if (input.trim()) {
      onParse(input);
    }
  };

  const handleExampleLoad = () => {
    const exampleStructure = `mongodb-runner/
├── src/                      # Frontend Next.js code
│   ├── app/                  # Next.js app directory
│   │   ├── api/              # API routes
│   │   │   ├── connection/   # Connection management endpoints
│   │   │   ├── execute/      # Query execution endpoint
│   │   │   └── stored-connections/ # Connection storage endpoints
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ConnectionManager.tsx
│   │   ├── ConnectionSelector.tsx
│   │   ├── JsonDetailView.tsx**
│   │   └── QueryEditor.tsx**
├── backend/                  # Backend Express.js server
│   ├── src/
│   │   ├── app.ts            # Express app setup
│   │   ├── routes/           # API routes
│   │   │   ├── connections.ts**
│   │   │   └── index.ts**
└── README.md**`;
    
    setInput(exampleStructure);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="input-area border rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Input Directory Structure</h2>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-gray-500 hover:text-blue-500"
          title="Format Help"
        >
          <HelpCircle size={18} />
        </button>
      </div>
      
      {showHelp && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <p className="font-medium mb-1">Supported Formats:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tree format with <code>├──</code>, <code>│</code>, <code>└──</code> characters</li>
            <li>Standard directory listings</li>
            <li>Mark files with <code>**</code> suffix or file extensions</li>
            <li>Add comments with <code>#</code></li>
            <li>Mark directories with a trailing <code>/</code></li>
          </ul>
        </div>
      )}
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExampleLoad}
          className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
        >
          Load Example
        </button>

        <label className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 cursor-pointer inline-flex items-center">
          <Upload size={16} className="mr-1" /> Upload File
          <input 
            type="file" 
            accept=".txt,.md" 
            className="hidden" 
            onChange={handleUpload} 
          />
        </label>
      </div>
      
      <textarea
        className="textarea flex-grow border rounded p-2 font-mono text-sm resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your directory structure here...
You can use formats like:

mongodb-runner/
├── src/                      # Frontend Next.js code
│   ├── app/                  # Next.js app directory
│   │   └── page.tsx**        # Files end with **
└── README.md

OR simpler formats like:

project/
  src/
    components/
      Button.tsx
      Card.tsx
  README.md"
        rows={10}
      />
      
      <div className="input-actions mt-3">
        <button
          onClick={handleParse}
          disabled={!input.trim()}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${!input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          Parse Structure
        </button>
      </div>
    </div>
  );
};