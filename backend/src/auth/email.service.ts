import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Resend} from 'resend';

@Injectable()
export class EmailService {
    private readonly resend: Resend;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    }

    async sendVerificationEmail(name:string, email: string, verificationLink: string): Promise<void> {
        const appUrl = this.configService.get('APP_URL');
        const verificationUrl = `${appUrl}/api/auth/verify-email?token={token}`;

        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to:email,
            subject: "Verify your email",
            html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome to Meridian</h2>

    <p>Hello ${name},</p>

    <p>
      Welcome to Meridian. Your account has been successfully created.
    </p>

    <p>
      <a href="${verificationLink}">Verify your email</a>      
      You can now access your dashboard and manage your import and export
      shipments with us.
    </p>
    </div>
`,
        })

}

async sendPasswordResetEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const resetUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

    await this.resend.emails.send({
        from: 'onboarding@resend.dev',
         to:email,
         subject: "reset your email",
         html:`
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Reset Your Meridian Password</h2>

    <p>Hello,</p>

    <p>
      We received a request to reset your Meridian account password.
    </p>

    <p>
      Click the button below to create a new password:
    </p>

    <a
      href="${resetUrl}"
      style="
        display: inline-block;
        padding: 12px 20px;
        background-color: #111827;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      "
    >
      Reset Password
    </a>

    <p>
      If you did not request a password reset, you can safely ignore this email.
    </p>

    <p>
      Regards,<br>
      <strong>Meridian Team</strong>
    </p>
  </div>
`,

    })
}}