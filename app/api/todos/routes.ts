import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const { rows } = await pool.query('SELECT * FROM "Todo" ORDER BY "createdAt" DESC')
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { title } = await req.json()
  await pool.query('INSERT INTO "Todo" ("id","title","done","createdAt") VALUES (gen_random_uuid(), $1, false, NOW())', [title])
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, done } = await req.json()
  await pool.query('UPDATE "Todo" SET "done"=$1 WHERE "id"=$2', [done, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM "Todo" WHERE "id"=$1', [id])
  return NextResponse.json({ ok: true })
}
