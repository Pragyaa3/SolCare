import { NextResponse } from 'next/server';
import { db, generateId } from '@/lib/storage';

export async function GET() {
  const loans = await db.readLoans();
  return NextResponse.json(loans);
}

export async function POST(req) {
  const body = await req.json();
  const amount = Number(body.amount || 0);
  if (amount <= 0) return NextResponse.json({ error: 'amount must be > 0' }, { status: 400 });
  const loan = {
    id: generateId('loan'),
    borrower: body.borrower || 'anonymous',
    amount,
    repaid: 0,
    creditScore: 0,
    createdAt: Date.now()
  };
  const loans = await db.readLoans();
  loans.unshift(loan);
  await db.writeLoans(loans);
  return NextResponse.json(loan, { status: 201 });
}
