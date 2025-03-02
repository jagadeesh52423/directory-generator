# Directory Structure Generator

A Next.js application to visualize, modify, and generate directory structures.

## Features

- **Visualize Directory Structures**: Parse and display directory structures in an expandable/collapsible tree view
- **Modify Structures**: Add, edit, delete, and toggle between file and directory types
- **Selection Control**: Select which items to include in the final creation
- **File Type Detection**: Auto-detect file types based on extensions and special markers
- **Target Location Selection**: Choose where to create the directory structure
- **Execution**: Generate the actual directories and files on your system

## Usage

1. **Input a Directory Structure**:
   - Paste a directory structure in the input area
   - Use the format shown in the example
   - Files can be marked with `**` suffix or by file extensions

2. **Visualize and Modify**:
   - View the parsed structure in the tree view
   - Use checkboxes to select/deselect items
   - Click on nodes to edit their properties
   - Use the tree controls to expand/collapse or select/deselect all

3. **Choose Target Location**:
   - Select a directory where you want to create the structure
   - Save frequently used locations for quick access

4. **Execute Creation**:
   - Click the "Create Files & Directories" button
   - View the progress and results of the operation

## File Markers

- Files can be marked in two ways:
  - Add `**` at the end of the name (e.g., `README.md**`)
  - Use file extensions (e.g., `.txt`, `.js`, `.md`)
- Directories can be marked with a trailing `/` (e.g., `src/`)
- Comments can be added with `#` (e.g., `src/ # Source code`)

## Example Input

```
mongodb-runner/
├── src/                      # Frontend Next.js code
│   ├── app/                  # Next.js app directory
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx**      # Root layout
│   │   └── page.tsx**        # Home page
│   ├── components/           # React components
│   │   ├── ConnectionManager.tsx**
│   │   └── ConnectionSelector.tsx**
├── backend/                  # Backend Express.js server
│   ├── src/
│   │   ├── app.ts**          # Express app setup
│   │   └── routes/           # API routes
└── README.md**
```

## Technical Details

This application is built with:
- Next.js 14
- React
- TypeScript
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## License

MIT