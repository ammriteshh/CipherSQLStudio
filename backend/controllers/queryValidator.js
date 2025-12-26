/**
 * Query validation and sanitization to prevent malicious SQL
 */

// Forbidden keywords that should not appear in user queries
const FORBIDDEN_KEYWORDS = [
  'DROP',
  'ALTER',
  'CREATE',
  'TRUNCATE',
  'DELETE',
  'INSERT',
  'UPDATE',
  'GRANT',
  'REVOKE',
  'COMMENT',
  'VACUUM',
  'COPY',
  'EXECUTE',
];

// System schemas that should not be accessed
const SYSTEM_SCHEMAS = [
  'pg_catalog',
  'information_schema',
  'pg_toast',
  'pg_temp',
];

/**
 * Check if query contains forbidden keywords
 * @param {string} query - SQL query to validate
 * @returns {Object} Validation result with isValid and error message
 */
const validateQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'Query must be a non-empty string',
    };
  }

  const upperQuery = query.toUpperCase().trim();

  // Check for empty query
  if (upperQuery.length === 0) {
    return {
      isValid: false,
      error: 'Query cannot be empty',
    };
  }

  // Check for forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    // Use word boundary regex to avoid false positives
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(query)) {
      return {
        isValid: false,
        error: `Query contains forbidden keyword: ${keyword}. Only SELECT queries are allowed.`,
      };
    }
  }

  // Check for system schema references
  for (const schema of SYSTEM_SCHEMAS) {
    const regex = new RegExp(`\\b${schema}\\b`, 'i');
    if (regex.test(query)) {
      return {
        isValid: false,
        error: `Access to system schema '${schema}' is not allowed.`,
      };
    }
  }

  // Basic check to ensure it's primarily a SELECT query
  if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('WITH')) {
    return {
      isValid: false,
      error: 'Only SELECT and WITH queries are allowed.',
    };
  }

  // Check for multiple statements (prevent SQL injection via semicolons)
  const statements = query.split(';').filter(s => s.trim().length > 0);
  if (statements.length > 1) {
    return {
      isValid: false,
      error: 'Multiple statements are not allowed. Please execute one query at a time.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Sanitize query by removing comments and extra whitespace
 * @param {string} query - SQL query to sanitize
 * @returns {string} Sanitized query
 */
const sanitizeQuery = (query) => {
  if (!query) return '';

  // Remove SQL comments (-- and /* */)
  let sanitized = query
    .replace(/--.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
};

module.exports = {
  validateQuery,
  sanitizeQuery,
};

