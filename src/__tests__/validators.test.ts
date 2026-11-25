import { registerSchema, checkoutSchema, productSchema } from "@/lib/validators";

describe("registerSchema", () => {
  it("accepts valid data", () => {
    expect(registerSchema.safeParse({ name: "Sakshi", email: "a@b.com", password: "12345678" }).success).toBe(true);
  });
  it("rejects short password", () => {
    expect(registerSchema.safeParse({ name: "Sakshi", email: "a@b.com", password: "123" }).success).toBe(false);
  });
  it("rejects invalid email", () => {
    expect(registerSchema.safeParse({ name: "Sakshi", email: "nope", password: "12345678" }).success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  const valid = { fullName: "Sakshi R", phone: "9876543210", address: "12 MG Road", city: "Delhi", pincode: "110001" };

  it("accepts valid shipping details", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects bad phone number", () => {
    expect(checkoutSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
  });
  it("rejects bad pincode", () => {
    expect(checkoutSchema.safeParse({ ...valid, pincode: "11" }).success).toBe(false);
  });
});

describe("productSchema", () => {
  it("rejects negative stock", () => {
    const res = productSchema.safeParse({
      title: "Lamp", description: "A nice desk lamp", price: 10,
      image: "https://example.com/a.jpg", category: "Home", stock: -1,
    });
    expect(res.success).toBe(false);
  });
});