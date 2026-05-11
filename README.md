# বাংলা-ল্যাং 🇧🇩

> বাংলা ভাষায় লেখা একটি toy programming language।
> Inspired by [Bhailang](https://github.com/DulLabs/bhai-lang)

---

## 🚀 কিভাবে run করবেন

```bash
git clone https://github.com/tanzid-48/bangla-lang.git
cd bangla-lang
node src/index.js examples/hello.bangla
```

---

## 📖 Keywords

| keyword | মানে |
|---|---|
| `শুরু` | প্রোগ্রাম শুরু |
| `শেষ` | প্রোগ্রাম শেষ |
| `ধরো` | variable declare / reassign |
| `দেখাও` | print / output |
| `জিজ্ঞেস করো` | user থেকে input নেওয়া |
| `যদি` | if condition |
| `নাহলে` | else |
| `যতক্ষণ` | while loop |
| `গণনা করো` | for loop |
| `থামো` | break |
| `এগিয়ে যাও` | continue |
| `কাজ` | function declare |
| `করো` | function call |
| `ফেরত দাও` | return |
| `সমস্যা` | error throw |
| `সত্য` | true |
| `মিথ্যা` | false |
| `শূন্য` | null |

---

## ➕ Operators

| operator | মানে |
|---|---|
| `+` `-` `*` `/` | যোগ, বিয়োগ, গুণ, ভাগ |
| `%` | ভাগশেষ (modulus) |
| `==` `!=` | সমান, অসমান |
| `<` `>` `<=` `>=` | তুলনা |

---

## 💡 উদাহরণ

### Hello World
```
শুরু
দেখাও "হ্যালো বাংলাদেশ!";
শেষ
```

### Variable ও Condition
```
শুরু
ধরো বয়স = 18;
যদি (বয়স >= 18) {
  দেখাও "প্রাপ্তবয়স্ক";
} নাহলে {
  দেখাও "অপ্রাপ্তবয়স্ক";
}
শেষ
```

### For Loop
```
শুরু
গণনা করো (ধরো ক = 1; ক <= 5; ক = ক + 1) {
  দেখাও ক;
}
শেষ
```

### While Loop
```
শুরু
ধরো ক = 1;
যতক্ষণ (ক <= 5) {
  দেখাও ক;
  ধরো ক = ক + 1;
}
শেষ
```

### Function
```
শুরু
কাজ যোগ(ক, খ) {
  ফেরত দাও ক + খ;
}
ধরো ফলাফল = যোগ(10, 20);
দেখাও ফলাফল;
শেষ
```

### Array
```
শুরু
ধরো তালিকা = [10, 20, 30, 40, 50];
দেখাও তালিকা;
দেখাও তালিকা[0];
শেষ
```

### Input
```
শুরু
জিজ্ঞেস করো নাম "আপনার নাম কী?";
দেখাও "হ্যালো " + নাম;
শেষ
```

### Error Handling
```
শুরু
ধরো খ = 0;
যদি (খ == 0) {
  সমস্যা "শূন্য দিয়ে ভাগ করা যাবে না!";
}
শেষ
```

### Modulus
```
শুরু
গণনা করো (ধরো ক = 1; ক <= 10; ক = ক + 1) {
  যদি (ক % 2 == 0) {
    দেখাও ক;
  }
}
শেষ
```

---

## 📁 Project Structure

```
bangla-lang/
├── src/
│   ├── lexer.js          # বাংলা keywords → tokens
│   ├── interpreter.js    # tokens → execute
│   └── index.js          # main entry point
├── examples/
│   ├── hello.bangla      # hello world
│   ├── function.bangla   # function example
│   ├── array.bangla      # array example
│   ├── error.bangla      # error handling
│   └── forloop.bangla    # for loop example
└── README.md
```

---

## 👨‍💻 তৈরি করেছেন

**[tanzid-48](https://github.com/tanzid-48)**