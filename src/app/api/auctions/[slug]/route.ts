import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { api } from "@/shared/lib/request";

export async function GET(request: NextRequest, {params}: { params: Promise<{ slug: string }> }) {
  try {
    const {slug} = await params;
    const query_params = request.nextUrl.searchParams;
    
    const response = await api.get(`/admin/auction-chats/${slug}?${query_params.toString()}`);
    return NextResponse.json(response.data, {status: response.status})
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      if (status >= 500) {
        return NextResponse.json({message: "Server Error"}, {status: 500})
      }
      return NextResponse.json(error!.response!.data, {status: error!.response!.status})
    }
    return NextResponse.json({message: "Server Error"}, {status: 500})
  }
}