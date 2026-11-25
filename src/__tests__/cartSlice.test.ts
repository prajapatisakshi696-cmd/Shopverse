import reducer, { addToCart, removeFromCart, updateQuantity, clearCart } from "@/features/cart/cartSlice";

const item = { id: "1", title: "Watch", price: 1000, image: "x.jpg" };

describe("cartSlice", () => {
  it("adds a new item with quantity 1", () => {
    const state = reducer({ items: [] }, addToCart(item));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it("increments quantity when the same item is added again", () => {
    let state = reducer({ items: [] }, addToCart(item));
    state = reducer(state, addToCart(item));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("never lets quantity go below 1", () => {
    let state = reducer({ items: [] }, addToCart(item));
    state = reducer(state, updateQuantity({ id: "1", quantity: -5 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it("removes an item", () => {
    let state = reducer({ items: [] }, addToCart(item));
    state = reducer(state, removeFromCart("1"));
    expect(state.items).toHaveLength(0);
  });

  it("clears the cart", () => {
    let state = reducer({ items: [] }, addToCart(item));
    state = reducer(state, clearCart());
    expect(state.items).toEqual([]);
  });
});