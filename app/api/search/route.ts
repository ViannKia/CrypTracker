import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    );
    const data = await res.json();
    
    // Ambil 5 hasil pertama
    const results = data.coins?.slice(0, 5).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.thumb,
    })) || [];
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([]);
  }
}