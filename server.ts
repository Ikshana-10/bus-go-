import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BusGo Backend API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Gemini-powered BusGo Travel Assistant
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { prompt, contextData } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt parameter." });
    }

    const ai = getGenAI();

    // If Gemini API Key is configured, use Gemini 3.8 Flash
    if (ai) {
      const systemInstruction = `You are 'BusGo Assistant', an intelligent, polite, and helpful travel advisor for BusGo, India's premier bus booking platform.
You assist travelers with bus search, price comparisons, boarding/dropping point tips, journey duration advice, and route options across cities like Chennai, Coimbatore, Bengaluru, Salem, Madurai, Trichy, and Hyderabad.

CRITICAL RULES:
1. Rely strictly on the fleet data provided below for bus operators, numbers, timings, boarding points, and fares.
2. DO NOT invent nonexistent buses, fares, or schedules.
3. Keep answers concise, clear, formatting with bullet points where helpful.
4. If a user asks for the cheapest bus, highlight the lowest fare bus from the fleet data.
5. If a user asks for departure recommendations or night sleepers, recommend the best AC Sleeper timings.

AVAILABLE FLEET DATA:
${contextData || "Standard routes: Chennai ↔ Coimbatore (ABC Travels ₹750, SRM Transports ₹920, Greenline Express ₹550), Bengaluru ↔ Chennai (IntrCity SmartBus ₹680), Hyderabad ↔ Bengaluru (Zingbus ₹899), Chennai ↔ Madurai (KPN ₹720), Coimbatore ↔ Bengaluru (Royal Travels ₹840)."}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I found suitable buses for your travel on BusGo! Please check the search results above.";
      return res.json({ reply: replyText });
    }

    // Fallback smart rule-based assistant if GEMINI_API_KEY is not yet supplied
    const query = prompt.toLowerCase();
    let reply = "";

    if (query.includes("cheapest") || query.includes("low price") || query.includes("budget")) {
      reply = `🚌 **Most Budget-Friendly Options on BusGo:**\n- **Chennai → Coimbatore:** Greenline Express (AC Seater) at just **₹550**.\n- **Chennai → Trichy:** City Express (Non-AC Sleeper) at **₹480**.\n- **Bengaluru → Salem:** SRS Travels (AC Semi-Sleeper) at **₹490**.\n\nUse promo code **BUSGOFIRST** to get an extra ₹150 OFF on your first booking!`;
    } else if (query.includes("coimbatore") && (query.includes("best") || query.includes("chennai"))) {
      reply = `✨ **Best Buses between Chennai & Coimbatore:**\n1. **SRM Transports (Volvo Multi-Axle AC Sleeper)** - Departs 21:15, Arrives 04:45 (Rating 4.9 ★). Includes individual entertainment screens, air suspension & snacks.\n2. **ABC Travels (AC Sleeper)** - Departs 22:00, Arrives 05:30 (Rating 4.8 ★) at ₹750. Very clean and punctual.\n3. **Greenline Express (Day AC Seater)** - Departs 06:00 AM, Arrives 14:00 at ₹550.`;
    } else if (query.includes("boarding") || query.includes("pickup")) {
      reply = `📍 **Major Boarding Points Available:**\n- **Chennai:** CMBT Koyambedu, Kilambakkam KCBT, Guindy Kathipara, Tambaram MEPZ, Ashok Pillar.\n- **Coimbatore:** Gandhipuram Omni Bus Stand, KMCH Avinashi Road, Lakshmi Mills, Hopes College.\n- **Bengaluru:** Majestic Bus Station, Madiwala St. Johns, Silk Board Junction, Electronic City Toll.`;
    } else if (query.includes("night") || query.includes("sleeper") || query.includes("when should i leave")) {
      reply = `🌙 **Recommended Departure Times:**\n- For overnight comfort between Chennai & Coimbatore/Madurai/Bengaluru, we recommend catching buses departing between **21:00 and 22:30 PM**.\n- This allows you to sleep peacefully through the 7-8 hour journey and arrive refreshed by 05:00 - 06:00 AM right as the city opens!`;
    } else if (query.includes("bengaluru") || query.includes("bangalore")) {
      reply = `🚍 **Top Bengaluru Routes on BusGo:**\n- **Bengaluru ↔ Chennai:** IntrCity SmartBus (Bharat Benz AC) at **₹680** (23:00 to 05:15).\n- **Hyderabad ↔ Bengaluru:** Zingbus Plus (Volvo Multi-Axle AC Sleeper) at **₹899** (22:30 to 06:15).\n- **Coimbatore ↔ Bengaluru:** Royal Travels Luxury at **₹840** (22:45 to 05:30).`;
    } else {
      reply = `👋 Hello! I am your **BusGo Assistant**. I can help you find the fastest buses, compare lowest fares, check major boarding locations, and find top-rated operators like SRM, ABC Travels, and IntrCity. How can I help with your journey today?`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.status(500).json({
      error: "Unable to process assistant request.",
      details: error?.message || "Internal server error"
    });
  }
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BusGo Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
