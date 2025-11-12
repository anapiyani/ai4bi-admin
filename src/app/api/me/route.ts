// src/app/api/me/route.ts
import axios from 'axios'
import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET() {
  try {
    const { data } = await axios.get(`${API_URL}/user/login`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
