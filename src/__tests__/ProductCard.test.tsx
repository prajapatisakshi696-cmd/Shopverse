import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice";
import ProductCard from "@/components/ProductCard";

const product = {
  id: "1", title: "Smart Watch", slug: "smart-watch", description: "Tracks fitness",
  price: 499900, image: "https://example.com/w.jpg", category: "Electronics", stock: 5,
};

const renderCard = (p = product) => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  render(<Provider store={store}><ProductCard product={p} /></Provider>);
  return store;
};

describe("ProductCard", () => {
  it("shows title and formatted price", () => {
    renderCard();
    expect(screen.getByText("Smart Watch")).toBeInTheDocument();
    expect(screen.getByText(/4,999/)).toBeInTheDocument();
  });

  it("adds the product to the cart on click", () => {
    const store = renderCard();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(store.getState().cart.items[0].id).toBe("1");
  });

  it("disables the button when out of stock", () => {
    renderCard({ ...product, stock: 0 });
    expect(screen.getByRole("button")).toBeDisabled();
  });
});