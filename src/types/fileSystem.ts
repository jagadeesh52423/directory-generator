export interface DirectoryInfo {
    path: string;
    name: string;
    isDirectory: boolean;
  }
  
  export interface ExecutionItem {
    path: string;
    type: 'file' | 'directory';
  }
  
  export interface ExecutionResult {
    success: boolean;
    path: string;
    type: 'file' | 'directory';
    message?: string;
  }