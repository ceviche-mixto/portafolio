/** Bounds optional work and aborts its network requests without delaying the page. */
export async function withDeadline<T>(
  work: (signal: AbortSignal) => Promise<T>,
  fallback: T,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      Promise.resolve().then(() => work(controller.signal)),
      new Promise<T>((resolve) => {
        timer = setTimeout(() => {
          controller.abort()
          resolve(fallback)
        }, timeoutMs)
      }),
    ])
  } catch {
    return fallback
  } finally {
    clearTimeout(timer)
  }
}
