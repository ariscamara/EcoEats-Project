import { NextResponse } from "next/server"
import { getAllLeftovers, addLeftover } from "@/app/leftover/db"

export async function GET() {
  const data = getAllLeftovers()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const item = addLeftover(body)
  return NextResponse.json(item)
}
