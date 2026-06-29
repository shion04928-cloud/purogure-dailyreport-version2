import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.GAS_URL;

  if (!url) {
    return NextResponse.json(
      { error: 'GAS URLが設定されていません' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'スプレッドシートからのデータ取得に失敗しました' },
      { status: 500 }
    );
  }
}
