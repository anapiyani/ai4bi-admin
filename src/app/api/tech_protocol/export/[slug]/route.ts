import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { api } from "@/shared/lib/request";

export async function GET(request: NextRequest, {params}: { params: Promise<{ slug: string }> }) {
  try {
    const {slug} = await params;
    const response = await api.post(`/export/tech_protocol?chat_id=${slug}`, {}, {
      responseType: 'arraybuffer',
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const contentDisposition = response.headers['content-disposition'] || `attachment; filename="protocol_${slug}.pdf"`;

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', contentDisposition);

    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });

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