export const FREE_SHIPPING_ABOVE = 99900; // ₹999 in paise
export const SHIPPING_FEE = 4900; // ₹49 in paise

export const calcShipping = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;