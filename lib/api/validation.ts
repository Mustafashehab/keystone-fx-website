import { NextResponse } from 'next/server'
import type { ZodType } from 'zod'

type ParsedBody<T> = { data: T; response?: never } | { data?: never; response: NextResponse }

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<ParsedBody<T>> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return {
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    }
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      response: NextResponse.json(
        {
          error: 'Invalid request',
          fields: result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      ),
    }
  }

  return { data: result.data }
}
