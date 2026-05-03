const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();

// Config
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5000";

// Middleware
app.use(cors({ origin: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// Data files
const dataDir = path.join(__dirname, "..", "data");
const historyFile = path.join(dataDir, "history.json");
const signsFile = path.join(__dirname, "..", "..", "frontend", "src", "assets", "signs.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(historyFile)) {
  fs.writeFileSync(historyFile, JSON.stringify([]), "utf-8");
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/signs", (req, res) => {
  try {
    const signs = readJson(signsFile);
    res.json(signs);
  } catch (e) {
    res.status(500).json({ error: "Failed to load signs" });
  }
});

app.get("/api/history", (req, res) => {
  const history = readJson(historyFile);
  res.json(history);
});

app.post("/api/history", (req, res) => {
  const { label, confidence } = req.body || {};
  if (!label) {
    return res.status(400).json({ error: "label is required" });
  }
  const entry = {
    id: uuidv4(),
    label,
    confidence: typeof confidence === "number" ? confidence : null,
    createdAt: new Date().toISOString(),
  };
  const history = readJson(historyFile);
  history.unshift(entry);
  writeJson(historyFile, history);
  res.status(201).json(entry);
});

app.delete("/api/history/:id", (req, res) => {
  const { id } = req.params;
  const history = readJson(historyFile);
  const next = history.filter((h) => h.id !== id);
  writeJson(historyFile, next);
  res.json({ success: true });
});

// Detection: accepts base64 image, forwards to Python service for prediction
app.post("/api/detect", async (req, res) => {
  const { image, type = "words" } = req.body || {};
  if (!image) {
    return res.status(400).json({ error: "image is required (base64)" });
  }

  try {
    // Forward request to Python service
    const response = await axios.post(`${PYTHON_SERVICE_URL}/predict`, {
      image,
      type,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    res.json(response.data);
  } catch (error) {
    console.error("Detection error:", error.message);
    // Fallback to mock response if Python service is unavailable
    const signs = readJson(signsFile);
    const pool = Array.isArray(signs) && signs.length ? signs : [{ title: "Hello" }];
    const choice = pool[Math.floor(Math.random() * pool.length)];
    const confidence = Math.round((0.6 + Math.random() * 0.39) * 100) / 100;
    res.status(503).json({
      error: error.response?.data?.error || "Python service unavailable",
      label: choice.title,
      confidence,
      fallback: true,
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
});


