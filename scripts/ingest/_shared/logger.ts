// Tiny console logger shared by ingestion scripts. Structured-ish output so
// GHA log scraping stays easy. No external dep (Pino lives behind server-only).

type Level = 'info' | 'warn' | 'error' | 'debug';

function emit(level: Level, source: string, msg: string, meta?: Record<string, unknown>) {
  const line = {
    t: new Date().toISOString(),
    level,
    source,
    msg,
    ...(meta ?? {}),
  };
  const stream = level === 'error' ? console.error : console.log;
  stream(JSON.stringify(line));
}

export function createLogger(source: string) {
  return {
    info: (msg: string, meta?: Record<string, unknown>) => emit('info', source, msg, meta),
    warn: (msg: string, meta?: Record<string, unknown>) => emit('warn', source, msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => emit('error', source, msg, meta),
    debug: (msg: string, meta?: Record<string, unknown>) => emit('debug', source, msg, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;
