import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

// e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`
export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('path');
  if (!tag) {
    return Response.json({ message: 'Missing tag param' }, { status: 400 });
  }

  revalidatePath(tag);
  return Response.json({ revalidated: true, now: Date.now() });
}
