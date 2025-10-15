import { NextResponse } from 'next/server';
import { db, generateId } from '@/lib/storage';

export async function GET() {
  const emergencies = await db.readEmergencies();
  return NextResponse.json(emergencies);
}

export async function POST(req) {
  const contentType = req.headers.get('content-type') || '';
  let entry = { id: generateId('emg'), createdAt: Date.now(), fundedAmount: 0, funded: false };

  if (contentType.includes('application/json')) {
    const body = await req.json();
    entry = { ...entry, ...body };
  } else if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    entry.patientName = form.get('patientName') || '';
    entry.requestedAmount = Number(form.get('requestedAmount') || 0);
    const file = form.get('document');
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const savedPath = await db.saveUpload(file, `${entry.id}_${file.name}`);
      entry.documentPath = savedPath;
    }
  } else {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  }

  if (!entry.requestedAmount || entry.requestedAmount <= 0) {
    return NextResponse.json({ error: 'requestedAmount must be > 0' }, { status: 400 });
  }

  const emergencies = await db.readEmergencies();
  emergencies.unshift(entry);
  await db.writeEmergencies(emergencies);
  return NextResponse.json(entry, { status: 201 });
}
