/**
 * Default garment price map
 * Backend is the source of truth for billing
 */
const GARMENT_PRICES = {
  'Shirt': 50,
  'Pants': 80,
  'Saree': 150,
  'Coat': 200,
  'Kurta': 100,
  'T-Shirt': 40,
  'Jeans': 90,
  'Jacket': 180,
  'Blanket': 250,
  'Bedsheet': 120,
  'Towel': 30,
  'Dress': 150,
  'Suit': 300,
  'Sweater': 100,
  'Shorts': 50,
};

/**
 * Get the price for a garment type
 * Prioritizes dynamic price sent from frontend.
 * Falls back to hardcoded GARMENT_PRICES if not provided.
 */
function getGarmentPrice(type, frontendPrice) {
  if (frontendPrice !== undefined && frontendPrice !== null && !isNaN(frontendPrice)) {
    return Number(frontendPrice);
  }
  const normalizedType = Object.keys(GARMENT_PRICES).find(
    (key) => key.toLowerCase() === type.toLowerCase()
  );
  return normalizedType ? GARMENT_PRICES[normalizedType] : 0;
}

/**
 * Calculate bill for an order
 * @param {Array} garments - Array of { type, quantity, price? }
 * @returns {{ garments: Array, totalAmount: number }}
 */
function calculateBill(garments) {
  let totalAmount = 0;

  const processedGarments = garments.map((item) => {
    const price = getGarmentPrice(item.type, item.price);
    const subtotal = item.quantity * price;
    totalAmount += subtotal;

    return {
      type: item.type,
      quantity: item.quantity,
      price: price,
      subtotal: subtotal,
    };
  });

  return {
    garments: processedGarments,
    totalAmount,
  };
}

module.exports = { calculateBill, GARMENT_PRICES, getGarmentPrice };
