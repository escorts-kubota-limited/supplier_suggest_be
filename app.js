import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoute.js";
import suggestionRoute from "./routes/suggestionRoute.js";
import fileRoute from "./routes/fileRoute.js";
import deviceRoute from "./routes/deviceRoute.js";
import notificationRoute from "./routes/notiifcationRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:30002", // Local dev
  "http://localhost:30002",
  "http://localhost:53516",
  "http://10.0.2.2:30002",
  "http://localhost:62598",
  "https://apiesuggest.escortskubota.com:30002",
  "http://192.168.1.10:30002",
  "http://3.110.7.17:30002",
  "http://3.110.7.17",
  "http://3.110.7.17/",
  "http://3.110.7.17:80",
  "http://192.168.20.160:80",
  "https://suppliersuggest.escortskubota.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"], // ✅ Only allow GET and POST
  credentials: true,
};

// Remove unwanted headers
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader;
  res.setHeader = function (name, value) {
    if (["location", "host", "x-powered-by"].includes(name.toLowerCase())) {
      return;
    }
    originalSetHeader.call(this, name, value);
  };
  next();
});

// Security headers using helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        frameAncestors: ["'none'"], // Equivalent to X-Frame-Options: DENY
      },
    },
    frameguard: { action: "deny" }, // X-Frame-Options: DENY
    hidePoweredBy: true, // Remove X-Powered-By
    xssFilter: true, // X-XSS-Protection (deprecated but okay to include)
    noSniff: true, // X-Content-Type-Options: nosniff
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/suggestion", suggestionRoute);
app.use("/file", fileRoute);
app.use("/device", deviceRoute);
app.use("/notification", notificationRoute);

// Server
const PORT = process.env.PORT || 30002;
app.listen(PORT, () => {
  import("./escalationCron.js");
  console.log(`Server is running on port ${PORT}`);
});
