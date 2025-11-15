import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { record_api } from "@/shared/lib/request";

export async function GET(request: NextRequest, {params}: { params: Promise<{ slug: string }> }) {
  try {
    const {slug} = await params;
    const response = await record_api.get(`/recordings/chat/${slug}`);
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