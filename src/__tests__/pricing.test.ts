import { calcShipping, FREE_SHIPPING_ABOVE, SHIPPING_FEE } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

describe("calcShipping", () => {
  it("is free for an empty cart", () => expect(calcShipping(0)).toBe(0));
  it("charges a fee below the threshold", () => expect(calcShipping(50000)).toBe(SHIPPING_FEE));
  it("is free at the threshold", () => expect(calcShipping(FREE_SHIPPING_ABOVE)).toBe(0));
});

describe("formatPrice", () => {
  it("converts paise to rupees", () => {
    expect(formatPrice(299900)).toContain("2,999");
  });
});