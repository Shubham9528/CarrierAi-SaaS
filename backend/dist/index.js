import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";
import paymentRoutes from "./routes/payment.js";
import cors from "cors";
import Razorpay from "razorpay";
import axios from "axios";
dotenv.config();
const url = process.env.SERVER_URL;
const interval = 30000;
// Function to reload the website(for keeping the server alive on render.com)
function reloadWebsite() {
    axios
        .get(url)
        .then((response) => {
        console.log("website reloded");
    })
        .catch((error) => {
        console.error(`Error : ${error.message}`);
    });
}
setInterval(reloadWebsite, interval);
connectDB().then(() => console.log("DB connected"));
export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});
const app = express();
const allowedOrigins = [
    "https://carrier-ai-saas-frontend.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
    res.send(`
    <html>
    <head>
      <style>
        body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; font-family: sans-serif; color: #fff; text-align: center; }
        h1 { font-size: 2rem; } span { color: #6366f1; }
        p { color: #555; margin-top: 0.5rem; }
        .dot { display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 6px; animation: p 1.5s infinite; }
        @keyframes p { 0%,100%{opacity:1} 50%{opacity:0.2} }
      </style>
    </head>
    <body>
      <div>
        <p><span class="dot"></span>API ONLINE</p>
        <h1>AI <span>Carrier</span> SaaS</h1>
        <p>Backend is up and running.</p>
      </div>
    </body>
    </html>
  `);
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
