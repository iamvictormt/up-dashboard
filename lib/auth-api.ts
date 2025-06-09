import api from '@/services/api';
import { ForgotPassword, ResetPassword, VerifyResetCode } from '@/types';
import { AxiosResponse } from 'axios';

export async function forgotPassword(data: ForgotPassword): Promise<AxiosResponse> {
  return await api.post('auth/forgot-password', data);
}

export async function verifyResetCode(data: VerifyResetCode): Promise<AxiosResponse> {
  return await api.post('auth/verify-reset-code', data);
}

export async function resetPassword(data: ResetPassword): Promise<AxiosResponse> {
  return await api.post('auth/reset-password', data);
}
