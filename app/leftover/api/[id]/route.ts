import { NextResponse } from "next/server"
import { deleteLeftover, updateLeftoverStatus } from "@/app/leftover/db"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(deleteLeftover(Number(params.id)))
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  return NextResponse.json(updateLeftoverStatus(Number(params.id), status))
}
