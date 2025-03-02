import React, { useState, useEffect } from 'react';
import { Folder, HardDrive, BookmarkPlus, X } from 'lucide-react';

interface DirectoryBrowserProps {
  onSelect: (path: string) => void;
}

export const DirectoryBrowser: React.FC<DirectoryBrowserProps> = ({ onSelect }) => {
  const [path, setPath] = useState<string>('');
  const [savedPaths, setSavedPaths] = useState<string[]>([]);
  
  // In a real implementation, we would use the File System Access API
  // or make server-side API calls to get actual directories
  const mockDirectories = [
    '/home/user/projects',
    '/home/user/documents',
    '/var/www/html',
    'C:\\Users\\user\\Projects',
    'C:\\Program Files',
  ];

  useEffect(() => {
    // Load saved paths from localStorage in a real app
    const saved = localStorage.getItem('savedDirectoryPaths');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedPaths(parsed);
        }
      } catch (e) {
        console.error('Error loading saved paths:', e);
      }
    }
  }, []);

  const handleSelectPath = (selectedPath: string) => {
    setPath(selectedPath);
    onSelect(selectedPath);
  };

  const handleSavePath = () => {
    if (path && !savedPaths.includes(path)) {
      const newSavedPaths = [...savedPaths, path];
      setSavedPaths(newSavedPaths);
      localStorage.setItem('savedDirectoryPaths', JSON.stringify(newSavedPaths));
    }
  };

  const handleRemoveSavedPath = (pathToRemove: string) => {
    const newSavedPaths = savedPaths.filter(p => p !== pathToRemove);
    setSavedPaths(newSavedPaths);
    localStorage.setItem('savedDirectoryPaths', JSON.stringify(newSavedPaths));
  };

  return (
    <div className="directory-browser border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Select Target Directory</h2>
      
      <div className="input-group mb-4 flex">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-grow border rounded p-2"
          placeholder="Enter directory path"
        />
        <button
          onClick={handleSavePath}
          disabled={!path || savedPaths.includes(path)}
          className={`ml-2 bg-gray-200 p-2 rounded ${!path || savedPaths.includes(path) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
          title="Save path"
        >
          <BookmarkPlus size={18} />
        </button>
      </div>
      
      {/* Mock directories */}
      <div className="directory-list mb-4">
        <h3 className="text-sm font-medium mb-2">Available Directories:</h3>
        <div className="border rounded overflow-y-auto max-h-32">
          {mockDirectories.map((dir) => (
            <div
              key={dir}
              className={`p-2 cursor-pointer flex items-center hover:bg-gray-100 ${
                path === dir ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelectPath(dir)}
            >
              <HardDrive size={16} className="mr-2 text-gray-500" />
              <span className="text-sm truncate">{dir}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Saved paths */}
      {savedPaths.length > 0 && (
        <div className="saved-paths">
          <h3 className="text-sm font-medium mb-2">Saved Locations:</h3>
          <div className="border rounded overflow-y-auto max-h-32">
            {savedPaths.map((savedPath) => (
              <div
                key={savedPath}
                className={`p-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                  path === savedPath ? 'bg-blue-100' : ''
                }`}
              >
                <div 
                  className="flex items-center flex-grow" 
                  onClick={() => handleSelectPath(savedPath)}
                >
                  <Folder size={16} className="mr-2 text-blue-500" />
                  <span className="text-sm truncate">{savedPath}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSavedPath(savedPath);
                  }}
                  className="text-gray-500 hover:text-red-500 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};