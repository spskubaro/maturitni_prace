
export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as SupabaseError).message === "string" &&
    !(error instanceof Error) // Aby se to nespletlo s normalnim Error.
  );
}

export function getErrorMessage(error: unknown): string {
  if (isSupabaseError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Neznámá chyba";
}

export function getFriendlyErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  const normalizedMessage = message.toLowerCase();
  const code = isSupabaseError(error) ? error.code : undefined;

  if (
    normalizedMessage.includes("jwt") ||
    normalizedMessage.includes("session not found") ||
    normalizedMessage.includes("invalid refresh token")
  ) {
    return "Přihlášení vypršelo. Přihlas se znovu.";
  }

  if (
    normalizedMessage.includes("column") &&
    (normalizedMessage.includes("current_mountain_points") ||
      normalizedMessage.includes("mountain_progress"))
  ) {
    return "V databázi chybí migrace pro pokrok hor. Spusť SQL migrace v Supabase.";
  }

  if (code === "42501" || normalizedMessage.includes("permission denied")) {
    return "Nemáš oprávnění na tuto operaci.";
  }

  if (code === "23505" || normalizedMessage.includes("duplicate key")) {
    return "Tento záznam už existuje.";
  }

  return message;
}
