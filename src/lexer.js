const KEYWORDS = {
  // মূল structure
  'শুরু':          'TOKEN_START',
  'শেষ':           'TOKEN_END',

  // variable
  'ধরো':           'TOKEN_VAR',

  // output / input
  'দেখাও':         'TOKEN_PRINT',
  'নাও':           'TOKEN_INPUT',

  // condition
  'যদি':           'TOKEN_IF',
  'নাহলে':         'TOKEN_ELSE',

  // loop
  'যতক্ষণ':        'TOKEN_WHILE',
  'থামো':          'TOKEN_BREAK',
  'এগিয়ে যাও':    'TOKEN_CONTINUE',

  // function
  'কাজ':           'TOKEN_FUNCTION',
  'করো':           'TOKEN_CALL',
  'ফেরত দাও':      'TOKEN_RETURN',

  // array
  'তালিকা':        'TOKEN_ARRAY',

  // error
  'সমস্যা':        'TOKEN_ERROR',

  // values
  'সত্য':          'TOKEN_TRUE',
  'মিথ্যা':        'TOKEN_FALSE',
  'শূন্য':         'TOKEN_NULL',
};

function tokenize(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    if (/\s/.test(code[i])) { i++; continue; }

    if (code[i] === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }

    if (code[i] === '"') {
      let str = '';
      i++;
      while (i < code.length && code[i] !== '"') str += code[i++];
      i++;
      tokens.push({ type: 'TOKEN_STRING', value: str });
      continue;
    }

    if (/[0-9]/.test(code[i])) {
      let num = '';
      while (i < code.length && /[0-9.]/.test(code[i])) num += code[i++];
      tokens.push({ type: 'TOKEN_NUMBER', value: num });
      continue;
    }

    if (code[i] === '=' && code[i + 1] === '=') {
      tokens.push({ type: 'TOKEN_EQ', value: '==' });
      i += 2;
      continue;
    }

    if (code[i] === '!' && code[i + 1] === '=') {
      tokens.push({ type: 'TOKEN_NEQ', value: '!=' });
      i += 2;
      continue;
    }

    if (code[i] === '<' && code[i + 1] === '=') {
      tokens.push({ type: 'TOKEN_LTE', value: '<=' });
      i += 2;
      continue;
    }

    if (code[i] === '>' && code[i + 1] === '=') {
      tokens.push({ type: 'TOKEN_GTE', value: '>=' });
      i += 2;
      continue;
    }

    const symMap = {
      '=': 'TOKEN_ASSIGN',    '+': 'TOKEN_PLUS',
      '-': 'TOKEN_MINUS',     '*': 'TOKEN_MULTIPLY',
      '/': 'TOKEN_DIVIDE',    '(': 'TOKEN_LPAREN',
      ')': 'TOKEN_RPAREN',    '{': 'TOKEN_LBRACE',
      '}': 'TOKEN_RBRACE',    ';': 'TOKEN_SEMICOLON',
      '<': 'TOKEN_LT',        '>': 'TOKEN_GT',
      ',': 'TOKEN_COMMA',     '[': 'TOKEN_LBRACKET',
      ']': 'TOKEN_RBRACKET',
    };
    if (symMap[code[i]]) {
      tokens.push({ type: symMap[code[i]], value: code[i] });
      i++;
      continue;
    }

    let word = '';
    while (i < code.length && !/[\s=+\-*\/(){};><"0-9,\[\]]/.test(code[i])) {
      word += code[i++];
    }

    if (!word) { i++; continue; }

    // দুই শব্দের keyword যেমন "এগিয়ে যাও", "ফেরত দাও"
    const peek = code.slice(i).match(/^\s+(\S+)/);
    if (peek) {
      const twoWord = word + ' ' + peek[1];
      if (KEYWORDS[twoWord]) {
        tokens.push({ type: KEYWORDS[twoWord], value: twoWord });
        i += peek[0].length;
        continue;
      }
    }

    if (KEYWORDS[word]) {
      tokens.push({ type: KEYWORDS[word], value: word });
    } else {
      tokens.push({ type: 'TOKEN_IDENTIFIER', value: word });
    }
  }

  tokens.push({ type: 'TOKEN_EOF', value: '' });
  return tokens;
}

module.exports = { tokenize };