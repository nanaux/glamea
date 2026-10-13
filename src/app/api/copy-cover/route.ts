import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const src = 'C:\\Users\\hanna\\.gemini\\antigravity\\brain\\796c8f8d-915d-41d5-8e3f-be4c134c8939\\studio_cover_atelier_1791793992535.png';
    const dest = path.join(process.cwd(), 'public', 'images', 'studio-cover.png');
    fs.copyFileSync(src, dest);
    return NextResponse.json({ success: true, dest });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
