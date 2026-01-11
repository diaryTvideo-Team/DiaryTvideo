import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("email.smtp.host"),
      port: this.configService.get<number>("email.smtp.port"),
      secure: this.configService.get<boolean>("email.smtp.secure"),
      auth: {
        user: this.configService.get<string>("email.smtp.auth.user"),
        pass: this.configService.get<string>("email.smtp.auth.pass"),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    code: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .code-box {
              background-color: #f3f4f6;
              border: 2px solid #4F46E5;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #4F46E5;
              font-family: 'Courier New', monospace;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to DiaryTVideo, ${name}!</h1>
            <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
            <p>Enter the verification code below in the app:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>("email.from"),
        to: email,
        subject: "Verify Your Email - DiaryTVideo",
        html,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }
}
