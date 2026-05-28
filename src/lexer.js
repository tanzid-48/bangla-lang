const KEYWORDS = {
  শুরু: "TOKEN_START",
  শেষ: "TOKEN_END",
  ধরো: "TOKEN_VAR",
  দেখাও: "TOKEN_PRINT",
  "জিজ্ঞেস করো": "TOKEN_INPUT",
  যদি: "TOKEN_IF",
  "নাহলে যদি": "TOKEN_ELIF",
  নাহলে: "TOKEN_ELSE",
  যতক্ষণ: "TOKEN_WHILE",
  "গণনা করো": "TOKEN_FOR",
  থামো: "TOKEN_BREAK",
  "এগিয়ে যাও": "TOKEN_CONTINUE",
  কাজ: "TOKEN_FUNCTION",
  করো: "TOKEN_CALL",
  "ফেরত দাও": "TOKEN_RETURN",
  সমস্যা: "TOKEN_ERROR",
  সত্য: "TOKEN_TRUE",
  মিথ্যা: "TOKEN_FALSE",
  শূন্য: "TOKEN_NULL",
};

function tokenize(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    if (/\s/.test(code[i])) {
      i++;
      continue;
    }

    if (code[i] === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }

    if (code[i] === '"') {
      let str = "";
      i++;
      while (i < code.length && code[i] !== '"') str += code[i++];
      i++;
      tokens.push({ type: "TOKEN_STRING", value: str });
      continue;
    }

    if (/[0-9]/.test(code[i])) {
      let num = "";
      while (i < code.length && /[0-9.]/.test(code[i])) num += code[i++];
      tokens.push({ type: "TOKEN_NUMBER", value: num });
      continue;
    }

    if (code[i] === "=" && code[i + 1] === "=") {
      tokens.push({ type: "TOKEN_EQ", value: "==" });
      i += 2;
      continue;
    }
    if (code[i] === "!" && code[i + 1] === "=") {
      tokens.push({ type: "TOKEN_NEQ", value: "!=" });
      i += 2;
      continue;
    }
    if (code[i] === "<" && code[i + 1] === "=") {
      tokens.push({ type: "TOKEN_LTE", value: "<=" });
      i += 2;
      continue;
    }
    if (code[i] === ">" && code[i + 1] === "=") {
      tokens.push({ type: "TOKEN_GTE", value: ">=" });
      i += 2;
      continue;
    }

    const symMap = {
      "=": "TOKEN_ASSIGN",
      "+": "TOKEN_PLUS",
      "-": "TOKEN_MINUS",
      "*": "TOKEN_MULTIPLY",
      "/": "TOKEN_DIVIDE",
      "%": "TOKEN_MOD",
      "(": "TOKEN_LPAREN",
      ")": "TOKEN_RPAREN",
      "{": "TOKEN_LBRACE",
      "}": "TOKEN_RBRACE",
      ";": "TOKEN_SEMICOLON",
      "<": "TOKEN_LT",
      ">": "TOKEN_GT",
      ",": "TOKEN_COMMA",
      "[": "TOKEN_LBRACKET",
      "]": "TOKEN_RBRACKET",
    };
    if (symMap[code[i]]) {
      tokens.push({ type: symMap[code[i]], value: code[i] });
      i++;
      continue;
    }

    let word = "";
    while (i < code.length && !/[\s=+\-*\/%(){};><"0-9,\[\]]/.test(code[i]))
      word += code[i++];
    if (!word) {
      i++;
      continue;
    }

    

    const rest = code.slice(i);

  
    const threeMatch = rest.match(/^\s+(\S+)\s+(\S+)/);
    if (threeMatch) {
      const threeWord = word + " " + threeMatch[1] + " " + threeMatch[2];
      if (KEYWORDS[threeWord]) {
        tokens.push({ type: KEYWORDS[threeWord], value: threeWord });
        i += threeMatch[0].length;
        continue;
      }
    }

    const twoMatch = rest.match(/^\s+(\S+)/);
    if (twoMatch) {
      const twoWord = word + " " + twoMatch[1];
      if (KEYWORDS[twoWord]) {
        tokens.push({ type: KEYWORDS[twoWord], value: twoWord });
        i += twoMatch[0].length;
        continue;
      }
    }

    if (KEYWORDS[word]) tokens.push({ type: KEYWORDS[word], value: word });
    else tokens.push({ type: "TOKEN_IDENTIFIER", value: word });
  }

  tokens.push({ type: "TOKEN_EOF", value: "" });
  return tokens;
}

module.exports = { tokenize };
