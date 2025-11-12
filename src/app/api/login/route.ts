import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { login_api } from "@/shared/lib/request";


export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await login_api.post('/user/login', body, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      signal: controller.signal,
    });
    const res = NextResponse.json({message: 'Успешная аутентификация'}, {status: response.status})
    res.cookies.set('token', response.data.access_token, {
      httpOnly: true,         // не доступен через JS на клиенте
      secure: false,
      sameSite: 'strict',        // или 'strict' в зависимости от контекста
      path: '/',              // доступен во всём приложении
      maxAge: 60 * 30,
    });
    return res
  } catch (error: unknown) {
    const aborted = error instanceof DOMException && error.name === 'AbortError';
    if (aborted) {
      return NextResponse.json({message: 'Auth service timeout'},
        {status: 504})
    }
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      if (status >= 500) {
        return NextResponse.json({message: "Server Error"}, {status: 500})
      }
      return NextResponse.json(error!.response!.data, {status: error!.response!.status})
    }
    return NextResponse.json({message: "Server Error"}, {status: 500})
  } finally {
    clearTimeout(timeout)
  }
}