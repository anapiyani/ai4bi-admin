import { NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { chat_api } from "@/shared/lib/request";

export async function GET(): Promise<NextResponse> {
  try {
    const response = await chat_api.get('/user/me');
    console.log(response);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      if (status >= 500) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
      }
      return NextResponse.json(error!.response!.data, { status: error!.response!.status });
    }
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

