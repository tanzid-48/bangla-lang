# বাংলা-ল্যাং 🇧🇩

বাংলা ভাষায় লেখা একটি toy programming language।
Inspired by [Bhailang](https://github.com/DulLabs/bhai-lang)

## কিভাবে run করবেন

**Step 1 — Clone করুন:**
```bash
git clone https://github.com/tanzid-48/bangla-lang.git
cd bangla-lang
```

**Step 2 — Run করুন:**
```bash
node src/index.js examples/hello.bangla
```

## Keywords

| keyword | মানে |
|---|---|
| `শুরু` | প্রোগ্রাম শুরু |
| `শেষ` | প্রোগ্রাম শেষ |
| `ধরো` | variable declare |
| `দেখাও` | print / output |
| `যদি` | if condition |
| `নাহলে` | else |
| `যতক্ষণ` | while loop |
| `থামো` | break |
| `এগিয়ে যাও` | continue |
| `সত্য` | true |
| `মিথ্যা` | false |
| `শূন্য` | null |

## উদাহরণ
শুরু
দেখাও "হ্যালো বাংলাদেশ!";
ধরো ক = 1;
যতক্ষণ (ক < 6) {
দেখাও ক;
ধরো ক = ক + 1;
}
যদি (ক == 6) {
দেখাও "লুপ শেষ!";
} নাহলে {
দেখাও "কিছু ভুল হয়েছে";
}
শেষ

## Project Structure
bangla-lang/
├── src/
│   ├── lexer.js        # বাংলা keywords → tokens
│   ├── interpreter.js  # tokens → execute
│   └── index.js        # main entry point
├── examples/
│   └── hello.bangla    # example program
└── README.md

## তৈরি করেছেন

[tanzid-48](https://github.com/tanzid-48)