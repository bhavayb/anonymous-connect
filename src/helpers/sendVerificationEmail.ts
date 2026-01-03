import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const result = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'true feedback verification code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log('Resend send result:', result);

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailerror) {
    console.log('Resend send error:', emailerror);
    return { success: false, message: 'Failed to send verification email.' };
  }
}