import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ExecutionItem, ExecutionResult } from '@/types/fileSystem';

export async function POST(req: NextRequest) {
  try {
    const { targetPath, items } = await req.json() as {
      targetPath: string;
      items: ExecutionItem[];
    };

    if (!targetPath) {
      return NextResponse.json(
        { message: 'Target path is required' },
        { status: 400 }
      );
    }

    // Check if target directory exists
    try {
      await fs.access(targetPath);
    } catch (error) {
      return NextResponse.json(
        {
          results: [
            {
              success: false,
              path: targetPath,
              type: 'directory',
              message: 'Target directory does not exist or is not accessible',
            },
          ],
        },
        { status: 400 }
      );
    }

    // Sort items to create directories before files
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return 0;
    });

    const results: ExecutionResult[] = [];

    for (const item of sortedItems) {
      const itemFullPath = path.join(targetPath, item.path);
      
      try {
        if (item.type === 'directory') {
          // Create directory
          await fs.mkdir(itemFullPath, { recursive: true });
          results.push({
            success: true,
            path: itemFullPath,
            type: 'directory',
          });
        } else {
          // For files, ensure parent directory exists
          const parentDir = path.dirname(itemFullPath);
          await fs.mkdir(parentDir, { recursive: true });
          
          // Create empty file
          await fs.writeFile(itemFullPath, '');
          results.push({
            success: true,
            path: itemFullPath,
            type: 'file',
          });
        }
      } catch (error) {
        results.push({
          success: false,
          path: itemFullPath,
          type: item.type,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({ results });
    
  } catch (error) {
    console.error('Error in execute API:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}