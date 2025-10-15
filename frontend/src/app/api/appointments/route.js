import { NextResponse } from 'next/server';
import { db, generateId } from '@/lib/storage';

export async function GET() {
  const appointments = await db.readAppointments();
  return NextResponse.json(appointments);
}

export async function POST(req) {
  const body = await req.json();
  const { userId, date, reason } = body;
  if (!userId || !date || !reason) {
    return NextResponse.json({ error: 'userId, date, reason required' }, { status: 400 });
  }
  const appt = { id: generateId('appt'), userId, date, reason, createdAt: Date.now() };
  const appointments = await db.readAppointments();
  appointments.unshift(appt);
  await db.writeAppointments(appointments);
  return NextResponse.json(appt, { status: 201 });
}
