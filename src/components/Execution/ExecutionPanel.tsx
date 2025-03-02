import React, { useState } from 'react';
import { PlayCircle, Check, AlertTriangle, Loader, FileIcon, FolderIcon } from 'lucide-react';
import { ExecutionResult } from '@/types/fileSystem';

interface ExecutionPanelProps {
  targetPath: string;
  onExecute: () => Promise<ExecutionResult[]>;
  disabled: boolean;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  targetPath,
  onExecute,
  disabled,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (disabled || isExecuting) return;
    
    setIsExecuting(true);
    setError(null);
    setResults([]);
    
    try {
      const executionResults = await onExecute();
      setResults(executionResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <div className="execution-panel border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Execute Creation</h2>
      
      <div className="target-path mb-4 p-2 bg-gray-100 rounded">
        <div className="text-sm font-medium">Target directory:</div>
        <div className="text-base truncate">
          {targetPath || "No directory selected"}
        </div>
      </div>
      
      <button
        onClick={handleExecute}
        disabled={disabled || isExecuting}
        className={`w-full mb-4 p-3 rounded flex items-center justify-center ${
          disabled || isExecuting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isExecuting ? (
          <>
            <Loader size={18} className="mr-2 animate-spin" /> Creating...
          </>
        ) : (
          <>
            <PlayCircle size={18} className="mr-2" /> Create Files & Directories
          </>
        )}
      </button>
      
      {error && (
        <div className="error-message mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          <div className="flex items-start">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-1" />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="results">
          <div className="summary mb-3 flex gap-4">
            <div className="success-count p-2 bg-green-100 rounded flex items-center">
              <Check size={16} className="mr-1 text-green-600" />
              <span className="text-sm">
                Success: <strong>{successCount}</strong>
              </span>
            </div>
            <div className="failure-count p-2 bg-red-100 rounded flex items-center">
              <AlertTriangle size={16} className="mr-1 text-red-600" />
              <span className="text-sm">
                Failed: <strong>{failureCount}</strong>
              </span>
            </div>
          </div>
          
          <div className="results-list border rounded overflow-y-auto max-h-64">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-2 border-b flex items-start ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.type === 'file' ? (
                  <FileIcon size={16} className="mr-2 mt-1 flex-shrink-0" />
                ) : (
                  <FolderIcon size={16} className="mr-2 mt-1 flex-shrink-0" />
                )}
                <div className="flex-grow">
                  <div className="text-sm font-medium truncate">{result.path}</div>
                  {!result.success && result.message && (
                    <div className="text-xs text-red-600">{result.message}</div>
                  )}
                </div>
                {result.success ? (
                  <Check size={16} className="text-green-600 flex-shrink-0 ml-2" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};