/**
 * Centralized error handling utilities for the PRACTICE app
 * 
 * Provides custom error classes, retry logic, and user-friendly
 * error messaging for network requests, authentication, and
 * general application errors.
 * 
 * @module errorHandling
 */

/**
 * Base application error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public retryable: boolean = false,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Converts the error to a JSON-serializable object
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      userMessage: this.userMessage,
      retryable: this.retryable,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Network-related errors (API calls, RPC requests)
 */
export class NetworkError extends AppError {
  constructor(message: string, userMessage: string = 'Network error. Please check your connection.', statusCode?: number) {
    super(message, 'NETWORK_ERROR', userMessage, true, statusCode);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication/authorization errors
 */
export class AuthError extends AppError {
  constructor(message: string, userMessage: string = 'Authentication failed. Please reconnect your wallet.') {
    super(message, 'AUTH_ERROR', userMessage, false);
    this.name = 'AuthError';
  }
}

/**
 * Blockchain/Web3 specific errors
 */
export class Web3Error extends AppError {
  constructor(message: string, userMessage: string = 'Blockchain error. Please try again.', retryable: boolean = true) {
    super(message, 'WEB3_ERROR', userMessage, retryable);
    this.name = 'Web3Error';
  }
}

/**
 * Validation errors (user input, data validation)
 */
export class ValidationError extends AppError {
  constructor(message: string, userMessage: string) {
    super(message, 'VALIDATION_ERROR', userMessage, false);
    this.name = 'ValidationError';
  }
}

/**
 * Database specific errors
 */
export class DatabaseError extends AppError {
  constructor(message: string, userMessage: string = 'Database error. Please try again.', retryable: boolean = true) {
    super(message, 'DATABASE_ERROR', userMessage, retryable);
    this.name = 'DatabaseError';
  }
}

/**
 * Retry an async operation with exponential backoff
 * 
 * @template T - The return type of the async function
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @param backoffMultiplier - Multiplier for exponential backoff (default: 2)
 * @returns Promise resolving to the function result
 * @throws The last error if all retries fail
 * 
 * @example
 * ```typescript
 * const balance = await withRetry(
 *   () => checkVibeTokenBalance(address),
 *   3,
 *   1000
 * );
 * ```
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if error is not retryable
      if (error instanceof AppError && !error.retryable) {
        throw error;
      }
      
      // Don't wait after the last attempt
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

/**
 * Wraps an async function with timeout and retry logic
 * 
 * @template T - The return type of the async function
 * @param fn - The async function to execute
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @returns Promise resolving to the function result
 * 
 * @example
 * ```typescript
 * const data = await withTimeoutAndRetry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   5000, // 5 second timeout
 *   2     // 2 retries
 * );
 * ```
 */
export const withTimeoutAndRetry = async <T>(
  fn: () => Promise<T>,
  timeoutMs: number = 30000,
  maxRetries: number = 3
): Promise<T> => {
  const fnWithTimeout = async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new NetworkError('Request timeout', 'Request timed out. Please try again.')), timeoutMs)
    );
    
    return Promise.race([fn(), timeoutPromise]);
  };
  
  return withRetry(fnWithTimeout, maxRetries);
};

/**
 * Handles errors and converts them to user-friendly messages
 * 
 * @param error - The error to handle
 * @param context - Additional context for logging
 * @returns User-friendly error message
 * 
 * @example
 * ```typescript
 * try {
 *   await pullCard();
 * } catch (error) {
 *   const message = handleError(error, 'Card Pull');
 *   toast.error(message);
 * }
 * ```
 */
export const handleError = (error: unknown, context?: string): string => {
  const prefix = context ? `[${context}] ` : '';
  
  // Handle AppError instances
  if (error instanceof AppError) {
    console.error(`${prefix}${error.code}:`, error.message, error.toJSON());
    return error.userMessage;
  }
  
  // Handle standard Error instances
  if (error instanceof Error) {
    console.error(`${prefix}Error:`, error.message, error.stack);
    
    // Check for specific error patterns
    if (error.message.includes('user rejected')) {
      return 'Transaction cancelled by user.';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for this transaction.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    
    return 'Something went wrong. Please try again.';
  }
  
  // Handle unknown error types
  console.error(`${prefix}Unknown error:`, error);
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Logs errors to an external service (e.g., Sentry, LogRocket)
 * 
 * @param error - The error to log
 * @param context - Additional context information
 * @param severity - Error severity level
 * 
 * @example
 * ```typescript
 * try {
 *   await criticalOperation();
 * } catch (error) {
 *   logErrorToService(error, { userId, operation: 'pull' }, 'high');
 *   throw error;
 * }
 * ```
 */
export const logErrorToService = (
  error: unknown,
  context?: Record<string, unknown>,
  severity: 'low' | 'medium' | 'high' = 'medium'
): void => {
  // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
  const errorData = {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
    severity,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
  
  console.error('[Error Service]', errorData);
  
  // In production, send to error tracking service:
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context, level: severity });
  // }
};

/**
 * Creates a safe async function wrapper with error handling
 * 
 * @template T - The return type of the async function
 * @param fn - The async function to wrap
 * @param fallbackValue - Fallback value if function fails
 * @param context - Context for error logging
 * @returns Wrapped function that never throws
 * 
 * @example
 * ```typescript
 * const safeCheckBalance = createSafeAsyncFunction(
 *   checkVibeTokenBalance,
 *   null,
 *   'Balance Check'
 * );
 * 
 * const balance = await safeCheckBalance(address); // Returns null on error
 * ```
 */
export const createSafeAsyncFunction = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  fallbackValue: T,
  context?: string
) => {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return fallbackValue;
    }
  };
};
