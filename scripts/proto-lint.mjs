#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROTO_DIR = './proto';

try {
  // Lint only proto directory
  console.log('Linting proto files...');
  execSync(`buf lint "${PROTO_DIR}"`, { stdio: 'inherit' });

  // Format only proto directory
  console.log('Formatting proto files...');
  try {
    execSync(`buf format "${PROTO_DIR}" -w --exit-code`, { stdio: 'inherit' });
  } catch (e) {
    if (e.status !== 0) {
      console.log('Proto files were formatted');
    }
  }

  // Enforce RPC naming rule only in proto files
  console.log('Checking RPC naming conventions...');
  const files = fs.readdirSync(PROTO_DIR).filter(f => f.endsWith('.proto'));
  
  let hasError = false;
  for (const file of files) {
    const content = fs.readFileSync(path.join(PROTO_DIR, file), 'utf-8');
    const matches = content.match(/rpc\s+\w*[A-Z][A-Z]\w*\s*\(/g);
    
    if (matches) {
      console.log(`${file}: ${matches.join(', ')}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('Error: Proto RPC names cannot contain repeated capital letters');
    process.exit(1);
  }

  console.log('Proto lint checks passed!');
} catch (error) {
  console.error('Proto lint failed:', error.message);
  process.exit(1);
}