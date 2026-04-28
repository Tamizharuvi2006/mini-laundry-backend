const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique order ID in format: ORD-YYYYMMDD-XXXX
 * Uses short hex from UUID to avoid race conditions
 * Example: ORD-20260427-A8F2
 */
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Take 4 hex chars from UUID for uniqueness
  const shortId = uuidv4().replace(/-/g, '').substring(0, 4).toUpperCase();

  return `ORD-${datePart}-${shortId}`;
}

module.exports = generateOrderId;
