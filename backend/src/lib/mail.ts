import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async (options: MailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP.FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`[Mail] Message sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('[Mail] Error sending email:', error);
    return false;
  }
};
