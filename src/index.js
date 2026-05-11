#!/usr/bin/env node

const fs = require('fs');
const { tokenize }  = require('./lexer');
const { interpret } = require('./interpreter');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node src/index.js <file.bangla>');
  console.error('Example: node src/index.js examples/hello.bangla');
  process.exit(1);
}

if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const code = fs.readFileSync(file, 'utf-8');
const tokens = tokenize(code);
interpret(tokens);