
export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as SupabaseError).message === 'string' &&
    !(error instanceof Error) // aby se to nespletlo s normalnim Error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isSupabaseError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'NeznĂˇmĂˇ chyba';
}
