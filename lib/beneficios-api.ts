// API functions for Benefits module
import api from "@/services/api"
import type { BenefitData, BenefitRedemptionData } from "@/types"

export interface ApiBenefitResponse {
  status: number
  data: any
  message?: string
}

// User endpoints
export async function fetchAvailableBenefits(): Promise<BenefitData[]> {
  const response = await api.get("benefits/available")
  return response.data
}

export async function fetchMyRedemptions(): Promise<BenefitRedemptionData[]> {
  const response = await api.get("benefits/my-redemptions")
  return response.data
}

export async function redeemBenefit(benefitId: string): Promise<BenefitRedemptionData> {
  const response = await api.post("benefits/redeem", { benefitId })
  return response.data
}
