import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { DirectoryInfo } from '@/types/fileSystem';

export async function GET(req: NextRequest) {
  try {
    // Get path from query parameters
    const { searchParams } = new URL(req.url);
    const dirPath = searchParams.get('path');

    if (!dirPath) {
      return NextResponse.json(
        { message: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Check if directory exists
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return NextResponse.json(
          { message: 'Path is not a directory' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Directory does not exist or is not accessible' },
        { status: 400 }
      );
    }

    // Read directory contents
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const directories: DirectoryInfo[] = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        path: path.join(dirPath, dirent.name),
        name: dirent.name,
        isDirectory: true
      }));

    // Get some files too, but only at the top level
    const files: DirectoryInfo[] = entries
      .filter(dirent => dirent.isFile())
      .map(dirent => ({
        path: path.join(dirPath, dirent.name),
        name: dirent.name,
        isDirectory: false
      }));

    return NextResponse.json({ 
      path: dirPath,
      directories,
      files 
    });
    
  } catch (error) {
    console.error('Error in filesystem API:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}