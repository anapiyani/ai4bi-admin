import { NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { chat_api } from "@/shared/lib/request";

export async function POST(): Promise<NextResponse> {
  try {
    const response = await chat_api.post('/user/logout');
    const res = NextResponse.json(response.data, { status: response.status });
    
    res.cookies.set('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    
    return res;
  } catch (error: unknown) {
    const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
    
    res.cookies.set('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      if (status >= 500) {
        return res;
      }
      return res;
    }
    return res;
  }
}

