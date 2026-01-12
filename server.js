require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const ALLOWED_ORIGINS = [
  "https://shime-68kk.github.io", // GitHub Pages origin
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400,
  })
);
app.options(/.*/, cors());
app.use(express.json({ limit: "200kb" }));
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    hasKey: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    allowedOrigins: ALLOWED_ORIGINS,
  });
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
app.post("/api/explain", async (req, res) => {
  try {
    const {
      question,
      choices,
      userAnswerIndex,
      correctAnswerIndex,
      teacherExplanation,
    } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ explanation: "❌ Thiếu GEMINI_API_KEY trong biến môi trường" });
    }
    const toLetter = (i) => String.fromCharCode(65 + Number(i));
const toLetters = (v) => {
  if (Array.isArray(v)) return v.map(toLetter).join(", ");
  if (v == null) return null;
  return toLetter(v);
};

    const prompt = `
Bạn là gia sư. Giải thích ngắn gọn nhưng sâu.
Câu hỏi: ${question || ""}
A/B/C/D:
${(choices || [])
  .map((c, i) => `${String.fromCharCode(65 + i)}. ${c}`)
  .join("\n")}

Bạn chọn: ${toLetters(userAnswerIndex) ?? "(chưa chọn)"}
Đáp án đúng: ${toLetters(correctAnswerIndex) ?? "(không rõ)"}

Giải thích sẵn có (nếu có): ${teacherExplanation || "(không có)"}

Yêu cầu:
- Nêu vì sao đáp án đúng.
- Nếu người học chọn sai thì chỉ ra sai ở đâu.
- Có ví dụ/ghi nhớ nhanh (1-2 dòng).
Trả lời tiếng Việt.
`.trim();
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || "Không có phản hồi.";
    // TRẢ VỀ TEXT THUẦN (frontend muốn xuống dòng thì tự replace \n -> <br>)
    res.json({ explanation: text });
  } catch (e) {
  console.error("Gemini error:", e);
  return res.status(200).json({
    explanation: "❌ Lỗi Gemini: " + (e?.message || String(e)),
  });
}

});
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
