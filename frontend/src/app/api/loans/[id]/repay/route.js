import { NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function POST(req, { params }) {
  const { id } = params;
  const { amount } = await req.json();
  const increment = Number(amount || 0);
  if (increment <= 0) return NextResponse.json({ error: 'amount must be > 0' }, { status: 400 });
  const loans = await db.readLoans();
  const loan = loans.find(l => l.id === id);
  if (!loan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  loan.repaid = (loan.repaid || 0) + increment;
  loan.creditScore = Math.floor((loan.repaid * 5) / loan.amount);
  await db.writeLoans(loans);
  return NextResponse.json(loan);
}
