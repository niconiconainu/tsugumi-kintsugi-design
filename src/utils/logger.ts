type Level = "INFO" | "WARN" | "ERROR" | "DEBUG";

const stringifyArgs = (args: unknown[]): string =>
  args
    .map((arg) => {
      if (typeof arg === "string") return arg;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");

const format = (level: Level, args: unknown[]): string =>
  JSON.stringify({ level, message: stringifyArgs(args) });

const formatError = (args: unknown[]): string => {
  let error: Error | null = null;
  const rest: unknown[] = [];
  for (const arg of args) {
    if (arg instanceof Error && !error) {
      error = arg;
    } else {
      rest.push(arg);
    }
  }
  return JSON.stringify({
    level: "ERROR",
    message:
      [
        ...(rest.length > 0 ? [stringifyArgs(rest)] : []),
        ...(error ? [`(${error.message})`] : []),
      ].join(" ") || "Unknown error",
    error: error
      ? { name: error.name, message: error.message, stack: error.stack }
      : undefined,
  });
};

/** ログは必ずこれを使う（`console.log` 禁止）。メッセージ先頭に `[ClassName]` を付ける。 */
export const logger = {
  info: (...args: unknown[]) => console.log(format("INFO", args)),
  warn: (...args: unknown[]) => console.warn(format("WARN", args)),
  debug: (...args: unknown[]) => console.debug(format("DEBUG", args)),
  error: (...args: unknown[]) => console.error(formatError(args)),
};
