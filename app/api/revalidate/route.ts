import { revalidatePath } from 'next/cache'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  // Check for secret to confirm this is a valid request
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    // Revalidate the homepage and archive pages
    revalidatePath('/')
    revalidatePath('/archive')
    
    return Response.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return Response.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
