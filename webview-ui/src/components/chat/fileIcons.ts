// fileIcons.ts

export function getFileIcon(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  
  // Map extensions to VS Code codicon names
  const iconMap: Record<string, string> = {
    // TypeScript/JavaScript
    'ts': 'file-code',
    'tsx': 'file-code',
    'js': 'file-code',
    'jsx': 'file-code',
    'mjs': 'file-code',
    'cjs': 'file-code',
    
    // Markup/Data
    'json': 'json',
    'html': 'html',
    'xml': 'file-code',
    'md': 'markdown',
    'mdx': 'markdown',
    'yaml': 'file-code',
    'yml': 'file-code',
    
    // Styles
    'css': 'file-code',
    'scss': 'file-code',
    'sass': 'file-code',
    'less': 'file-code',
    
    // Other languages
    'py': 'file-code',
    'java': 'file-code',
    'cpp': 'file-code',
    'c': 'file-code',
    'go': 'file-code',
    'rs': 'file-code',
    'php': 'file-code',
    'rb': 'file-code',
    
    // Config files
    'gitignore': 'gear',
    'env': 'gear',
    'config': 'gear',
  };
  
  return iconMap[ext] || 'file';
}