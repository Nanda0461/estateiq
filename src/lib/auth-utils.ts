import crypto from 'crypto';
import { sendEmail } from './mail';

export function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

export async function sendVerificationEmail(email: string, otp: string) {
    await sendEmail({
        to: email,
        subject: "Verify your email - EstateIQ",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; background-color: #f9fafb; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2563eb; font-size: 24px; margin-bottom: 8px;">Welcome to EstateIQ</h2>
          <p style="color: #6b7280; font-size: 16px;">Please use the following code to verify your email address.</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;">
          <h1 style="color: #1a1a1a; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 30px;">
          This code will expire in 10 minutes. If you did not request this email, please ignore it.
        </p>
      </div>
    `
    });
}
