const readline = require('readline');

function interpret(tokens) {
  let pos = 0;
  const vars = {};
  const functions = {};

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
      'TOKEN_PLUS', 'TOKEN_MINUS', 'TOKEN_MULTIPLY', 'TOKEN_DIVIDE',
      'TOKEN_MOD', 'TOKEN_EQ', 'TOKEN_NEQ', 'TOKEN_LT', 'TOKEN_GT',
      'TOKEN_LTE', 'TOKEN_GTE'
    ];
    while (ops.includes(peek().type)) {
      const op = consume().value;
      const right = parsePrimary();
      if (op === '+')        left = typeof left === 'string' ? left + String(right) : left + right;
      else if (op === '-')   left = left - right;
      else if (op === '*')   left = left * right;
      else if (op === '/')   left = left / right;
      else if (op === '%')   left = left % right;
      else if (op === '==')  left = left === right;
      else if (op === '!=')  left = left !== right;
      else if (op === '<')   left = left < right;
      else if (op === '>')   left = left > right;
      else if (op === '<=')  left = left <= right;
      else if (op === '>=')  left = left >= right;
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

    if (t.type === 'TOKEN_LBRACKET') {
      const arr = [];
      while (peek().type !== 'TOKEN_RBRACKET' && peek().type !== 'TOKEN_EOF') {
        arr.push(parseExpr());
        if (peek().type === 'TOKEN_COMMA') consume();
      }
      expect('TOKEN_RBRACKET');
      return arr;
    }

    if (t.type === 'TOKEN_IDENTIFIER') {
      if (peek().type === 'TOKEN_LPAREN') {
        consume();
        const args = [];
        while (peek().type !== 'TOKEN_RPAREN' && peek().type !== 'TOKEN_EOF') {
          args.push(parseExpr());
          if (peek().type === 'TOKEN_COMMA') consume();
        }
        expect('TOKEN_RPAREN');
        return callFunction(t.value, args);
      }

      if (peek().type === 'TOKEN_LBRACKET') {
        consume();
        const index = parseExpr();
        expect('TOKEN_RBRACKET');
        const arr = vars[t.value];
        if (!Array.isArray(arr)) throw new Error(`"${t.value}" একটি তালিকা নয়`);
        return arr[index];
      }

      return vars[t.value] ?? 0;
    }

    if (t.type === 'TOKEN_LPAREN') {
      const val = parseExpr();
      expect('TOKEN_RPAREN');
      return val;
    }

    throw new Error(`Unexpected token: "${t.value}"`);
  }

  function callFunction(name, args) {
    const fn = functions[name];
    if (!fn) throw new Error(`"${name}" নামে কোনো কাজ নেই`);

    const savedVars = { ...vars };
    fn.params.forEach((p, i) => { vars[p] = args[i] ?? null; });

    let result = null;
    try {
      const savedPos = pos;
      pos = fn.bodyPos;
      runBlock();
      pos = savedPos;
    } catch (e) {
      if (e.type === 'RETURN') {
        result = e.value;
      } else {
        throw e;
      }
    }

    Object.keys(vars).forEach(k => delete vars[k]);
    Object.assign(vars, savedVars);
    return result;
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

  async function runStatement() {
    const t = peek();

    // ধরো ক = ৫;  (declare + reassign দুটোই)
    if (t.type === 'TOKEN_VAR') {
      consume();
      const name = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_ASSIGN');
      vars[name] = parseExpr();
      expect('TOKEN_SEMICOLON');
    }

    // দেখাও "কিছু";
    else if (t.type === 'TOKEN_PRINT') {
      consume();
      const val = parseExpr();
      console.log(Array.isArray(val) ? JSON.stringify(val) : val);
      expect('TOKEN_SEMICOLON');
    }

    // জিজ্ঞেস করো ক "আপনার নাম?";
    else if (t.type === 'TOKEN_INPUT') {
      consume();
      const name = expect('TOKEN_IDENTIFIER').value;
      const question = parseExpr();
      expect('TOKEN_SEMICOLON');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      vars[name] = await new Promise(resolve => {
        rl.question(question + ' ', answer => {
          rl.close();
          const num = parseFloat(answer);
          resolve(isNaN(num) ? answer : num);
        });
      });
    }

    // সমস্যা "error message";
    else if (t.type === 'TOKEN_ERROR') {
      consume();
      const msg = parseExpr();
      throw new Error(`সমস্যা: ${msg}`);
    }

    // ফেরত দাও মান;
    else if (t.type === 'TOKEN_RETURN') {
      consume();
      const value = parseExpr();
      expect('TOKEN_SEMICOLON');
      throw { type: 'RETURN', value };
    }

    // যদি (...) { } নাহলে { }
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

    // যতক্ষণ (...) { }
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

    // গণনা করো (ধরো ক = 0; ক < 5; ক = ক + 1) { }
    else if (t.type === 'TOKEN_FOR') {
      consume();
      expect('TOKEN_LPAREN');

      // init: ধরো ক = 0
      if (peek().type === 'TOKEN_VAR') consume();
      const initName = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_ASSIGN');
      vars[initName] = parseExpr();
      expect('TOKEN_SEMICOLON');

      // condition
      const condPos = pos;
      let cond = parseExpr();
      expect('TOKEN_SEMICOLON');

      // update: ক = ক + 1
      const updatePos = pos;
      const updateName = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_ASSIGN');
      const updateExprPos = pos;
      // skip update expression for now
      let depth = 0;
      while (!(peek().type === 'TOKEN_RPAREN' && depth === 0)) {
        if (peek().type === 'TOKEN_LPAREN') depth++;
        if (peek().type === 'TOKEN_RPAREN') depth--;
        if (depth < 0) break;
        consume();
      }
      const updateEndPos = pos;
      expect('TOKEN_RPAREN');
      expect('TOKEN_LBRACE');
      const bodyPos = pos;

      while (cond) {
        pos = bodyPos;
        runBlock();

        // run update
        pos = updateExprPos;
        vars[updateName] = parseExpr();

        // check condition again
        pos = condPos;
        cond = parseExpr();
        expect('TOKEN_SEMICOLON');

        // skip update again
        pos = updateExprPos;
        depth = 0;
        while (!(peek().type === 'TOKEN_RPAREN' && depth === 0)) {
          if (peek().type === 'TOKEN_LPAREN') depth++;
          if (peek().type === 'TOKEN_RPAREN') depth--;
          if (depth < 0) break;
          consume();
        }
        expect('TOKEN_RPAREN');
        expect('TOKEN_LBRACE');
      }

      pos = updateEndPos;
      expect('TOKEN_RPAREN');
      skipBlock();
    }

    // কাজ নাম(params) { }
    else if (t.type === 'TOKEN_FUNCTION') {
      consume();
      const name = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_LPAREN');
      const params = [];
      while (peek().type !== 'TOKEN_RPAREN' && peek().type !== 'TOKEN_EOF') {
        params.push(expect('TOKEN_IDENTIFIER').value);
        if (peek().type === 'TOKEN_COMMA') consume();
      }
      expect('TOKEN_RPAREN');
      expect('TOKEN_LBRACE');
      const bodyPos = pos;
      functions[name] = { params, bodyPos };
      skipBlock();
    }

    // করো নাম(args);
    else if (t.type === 'TOKEN_CALL') {
      consume();
      const name = expect('TOKEN_IDENTIFIER').value;
      expect('TOKEN_LPAREN');
      const args = [];
      while (peek().type !== 'TOKEN_RPAREN' && peek().type !== 'TOKEN_EOF') {
        args.push(parseExpr());
        if (peek().type === 'TOKEN_COMMA') consume();
      }
      expect('TOKEN_RPAREN');
      expect('TOKEN_SEMICOLON');
      callFunction(name, args);
    }

    else { consume(); }
  }

  async function run() {
    expect('TOKEN_START');
    while (peek().type !== 'TOKEN_END' && peek().type !== 'TOKEN_EOF') {
      await runStatement();
    }
  }

  return run();
}

module.exports = { interpret };