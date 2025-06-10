import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    status: false,
    message: "Too many login attempts, try again later.",
  },
});

export const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    status: false,
    message: "Too many OTP verification attempts, try again later.",
  },
});