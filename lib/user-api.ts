import api from "@/services/api";
import { AxiosResponse } from "axios";

export async function updateLoveDecoration(data: any): Promise<AxiosResponse> {
  return await api.patch(`love-decorations`, data);
}
