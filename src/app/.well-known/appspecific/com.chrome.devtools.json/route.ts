// app/.well-known/appspecific/com.chrome.devtools.json/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const payload = { workspace: { root: process.cwd() } };
  return NextResponse.json(payload);
}
