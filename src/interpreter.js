function interpret(tokens) {
  let pos = 0;
  const vars = {};

  function peek()    { return tokens[pos]; }
  function consume() { return tokens[pos++]; }
  function expect(type) {
    const t = consume();
    if (t.type !== type) {
      throw new Error(`Syntax error! "${type}" expected but got "${t.type}"`);
    }
    return t;
  }

  function parseExpr() {
    let left = parsePrimary();
    const ops = [
      'TOKEN_PLUS', 'TOKEN_MINUS', 'TOKEN_MULTIPLY',
      'TOKEN_DIVIDE', 'TOKEN_EQ', 'TOKEN_LT', 'TOKEN_GT'
    ];
    while (ops.includes(peek().type)) {
      const op = consume().value;
      const right = parsePrimary();
      if (op === '+')       left = typeof left === 'string' ? left + String(right) : left + right;
      else if (op === '-')  left = left - right;
      else if (op === '*')  left = left * right;
      else if (op === '/')  left = left / right;
      else if (op === '==') left = left === right;
      else if (op === '<')  left = left < right;
      else if (op === '>')  left = left > right;
    }
    return left;
  }

  function parsePrimary() {
    const t = consume();
    if (t.type === 'TOKEN_NUMBER')     return parseFloat(t.value);
    if (t.type === 'TOKEN_STRING')     return t.value;
    if (t.type === 'TOKEN_TRUE')       return true;
    if (t.type === 'TOKEN_FALSE')      return false;
    if (t.type === 'TOKEN_NULL')       return null;
    if (t.type === 'TOKEN_IDENTIFIER') return vars[t.value] ?? 0;
    if (t.type === 'TOKEN_LPAREN') {
      const val = parseExpr();
      expect('TOKEN_RPAREN');
      return val;
    }
    throw new Error(`Unexpected token: "${t.value}"`);
  }

  function skipBlock() {
    let depth = 1;
    while (depth > 0) {
      const t = consume();
      if (t.type === 'TOKEN_LBRACE') depth++;
      if (t.type === 'TOKEN_RBRACE') depth--;
    }
  }

  function runBlock() {
    while (peek().type !== 'TOKEN_RBRACE' && peek().type !== 'TOKEN_EOF') {
      runStatement();
    }
  }

  function runStatement() {
    const t = peek();

    if (t.type === 'TOKEN_VAR') {
      consume();
      const name = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_ASSIGN');
      vars[name] = parseExpr();
      expect('TOKEN_SEMICOLON');
    }
    else if (t.type === 'TOKEN_PRINT') {
      consume();
      console.log(parseExpr());
      expect('TOKEN_SEMICOLON');
    }
    else if (t.type === 'TOKEN_IF') {
      consume();
      expect('TOKEN_LPAREN');
      const cond = parseExpr();
      expect('TOKEN_RPAREN');
      expect('TOKEN_LBRACE');
      if (cond) { runBlock(); expect('TOKEN_RBRACE'); }
      else skipBlock();

      if (peek().type === 'TOKEN_ELSE') {
        consume();
        expect('TOKEN_LBRACE');
        if (!cond) { runBlock(); expect('TOKEN_RBRACE'); }
        else skipBlock();
      }
    }
    else if (t.type === 'TOKEN_WHILE') {
      consume();
      const condPos = pos;
      expect('TOKEN_LPAREN');
      let cond = parseExpr();
      expect('TOKEN_RPAREN');
      expect('TOKEN_LBRACE');
      const bodyPos = pos;

      while (cond) {
        pos = bodyPos;
        runBlock();
        pos = condPos;
        expect('TOKEN_LPAREN');
        cond = parseExpr();
        expect('TOKEN_RPAREN');
        expect('TOKEN_LBRACE');
      }
      skipBlock();
    }
    else { consume(); }
  }

  expect('TOKEN_START');
  while (peek().type !== 'TOKEN_END' && peek().type !== 'TOKEN_EOF') {
    runStatement();
  }
}

module.exports = { interpret };