import { NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function POST(_req, { params }) {
  const { id } = params;
  const { amount } = await _req.json();
  const emergencies = await db.readEmergencies();
  const target = emergencies.find(e => e.id === id);
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const donate = Number(amount || 0);
  if (donate <= 0) return NextResponse.json({ error: 'amount must be > 0' }, { status: 400 });
  target.fundedAmount = (target.fundedAmount || 0) + donate;
  target.funded = target.fundedAmount >= Number(target.requestedAmount || 0);
  await db.writeEmergencies(emergencies);
  return NextResponse.json(target);
}
