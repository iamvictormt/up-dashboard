export interface ForgotPassword {
  email: string;
}

export interface VerifyResetCode {
  email: string;
  code: string;
}

export interface ResetPassword {
  email: string;
  code: string;
  newPassword: string;
}
