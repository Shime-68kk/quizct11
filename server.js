require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; 

const genAI = new GoogleGenerativeAI(API_KEY);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    hasKey: !!API_KEY,
    model: MODEL,
    time: new Date().toISOString(),
  });
});

app.post("/api/explain", async (req, res) => {
  try {
    const { question, choices, userAnswerIndex, correctAnswerIndex, teacherExplanation } = req.body || {};

    if (!API_KEY) {
      return res.status(500).json({ explanation: "❌ Thiếu GEMINI_API_KEY trong .env" });
    }

    const prompt = `
Bạn là gia sư. Giải thích ngắn gọn nhưng sâu.
Câu hỏi: ${question || ""}
A/B/C/D:
${(choices || []).map((c, i) => `${String.fromCharCode(65+i)}. ${c}`).join("\n")}

Bạn chọn: ${userAnswerIndex != null ? String.fromCharCode(65 + userAnswerIndex) : "(chưa chọn)"}
Đáp án đúng: ${correctAnswerIndex != null ? String.fromCharCode(65 + correctAnswerIndex) : "(không rõ)"}
Giải thích sẵn có (nếu có): ${teacherExplanation || "(không có)"}

Yêu cầu:
- Nêu vì sao đáp án đúng.
- Nếu người học chọn sai thì chỉ ra sai ở đâu.
- Có ví dụ/ghi nhớ nhanh (1-2 dòng).
Trả lời tiếng Việt.
`.trim();

    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || "Không có phản hồi.";

    res.json({ explanation: text.replace(/\n/g, "<br>") });
  } catch (e) {
    console.error("❌ /api/explain error:", e);
    res.status(500).json({ explanation: "❌ Lỗi Gemini: " + (e?.message || e) });
  }
});

app.listen(5500, () => {
  console.log("✅ http://localhost:5500");
  console.log("ℹ️ health:", "http://localhost:5500/api/health");
  console.log("ℹ️ model:", MODEL);
});

