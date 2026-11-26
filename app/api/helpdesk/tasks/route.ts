import { NextResponse } from 'next/server';
import { helpdeskTasks } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const fail = new URL(request.url).searchParams.get('fail');
  if (fail === '1') {
    return NextResponse.json(
      { error: 'Helpdesk service is unavailable. Try again shortly.' },
      { status: 503 },
    );
  }
  return NextResponse.json({ source: 'helpdesk', tasks: helpdeskTasks() });
}
