import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const excludeDirs = ['node_modules', '.git', 'dist', 'out', 'src/generated']; // src/generated is handled by npm run protos

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (excludeDirs.includes(f)) return;
            walk(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const replacements = [
    [/docs\.cline\.bot/gi, 'docs.getblu.in'],
    [/cline\.bot/gi, 'getblu.in'],
    [/Cline/g, 'Blu'],
    [/cline/g, 'blu']
];

walk(rootDir, (filePath) => {
    // Skip binary files
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.ico') || filePath.endsWith('.pb')) return;
    
    // Skip the script itself
    if (filePath === path.join(rootDir, 'rebrand.mjs')) return;

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        for (let [regex, replacement] of replacements) {
            newContent = newContent.replace(regex, replacement);
        }
        if (newContent !== content) {
            console.log(`Updating ${filePath}`);
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    } catch (e) {
        // console.error(`Failed to process ${filePath}: ${e.message}`);
    }
});
