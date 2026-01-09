
import { TOTP } from 'otpauth';

/**
 * Generates a Time-based One-Time Password (TOTP)
 * @param {string} secret - The base32 encoded secret key
 * @returns {string} The generated OTP code
 */
export function generateOTP(secret) {
  if (!secret) {
    throw new Error("UI_OTP_SECRET is missing or empty");
  }

  // Clean secret (remove spaces)
  const cleanSecret = secret.replace(/\s+/g, '');

  // Read config from env (defaults: 6 digits, SHA1, 30s)
  const digits = parseInt(process.env.UI_OTP_DIGITS || '6', 10);
  const algorithm = (process.env.UI_OTP_ALGORITHM || 'sha1').toLowerCase();
  const period = parseInt(process.env.UI_OTP_PERIOD || '30', 10);

  const totp = new TOTP({
    secret: cleanSecret,
    digits: digits,
    algorithm: algorithm,
    period: period,
  });

  return totp.generate();
}
