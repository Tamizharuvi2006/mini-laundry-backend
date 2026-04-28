const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
const STATUS_RANK = {
  RECEIVED: 0,
  PROCESSING: 1,
  READY: 2,
  DELIVERED: 3,
};

/**
 * Validate order creation data
 * @param {Object} data - Request body
 * @returns {{ valid: boolean, message: string }}
 */
function validateOrderData(data) {
  const { customerName, phone, garments } = data;

  if (!customerName || customerName.trim() === '') {
    return { valid: false, message: 'Customer name is required' };
  }

  if (!phone || phone.trim() === '') {
    return { valid: false, message: 'Phone number is required' };
  }

  // Validate phone is 10 digits (India)
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length !== 10) {
    return { valid: false, message: 'Phone number must be 10 digits' };
  }

  if (!garments || !Array.isArray(garments) || garments.length === 0) {
    return { valid: false, message: 'At least one garment is required' };
  }

  for (let i = 0; i < garments.length; i++) {
    const g = garments[i];

    if (!g.type || g.type.trim() === '') {
      return { valid: false, message: `Garment type is required for item ${i + 1}` };
    }

    if (!g.quantity || g.quantity <= 0) {
      return { valid: false, message: `Quantity must be greater than 0 for ${g.type}` };
    }

    if (g.price !== undefined && g.price < 0) {
      return { valid: false, message: `Price must be >= 0 for ${g.type}` };
    }
  }

  return { valid: true, message: '' };
}

/**
 * Validate status update
 * @param {string} status
 * @returns {{ valid: boolean, message: string }}
 */
function validateStatus(status) {
  if (!status || !VALID_STATUSES.includes(status)) {
    return {
      valid: false,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    };
  }
  return { valid: true, message: '' };
}

function validateStatusTransition(currentStatus, nextStatus) {
  if (!VALID_STATUSES.includes(currentStatus) || !VALID_STATUSES.includes(nextStatus)) {
    return { valid: false, message: 'Invalid status transition' };
  }

  if (STATUS_RANK[nextStatus] < STATUS_RANK[currentStatus]) {
    return { valid: false, message: `Cannot move status backward from ${currentStatus} to ${nextStatus}` };
  }

  return { valid: true, message: '' };
}

module.exports = { validateOrderData, validateStatus, validateStatusTransition, VALID_STATUSES };
