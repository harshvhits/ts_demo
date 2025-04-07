import sgMail from "@sendgrid/mail";
import { config } from "../config/config";

sgMail.setApiKey(config.sendGridAPIKey);

class EmailService {
  public async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${config.frontendURL}/reset_password/${token}`;
    const msg = {
      to: email,
      from: config.fromEmail,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await sgMail.send(msg);
  }
}

export default EmailService;
