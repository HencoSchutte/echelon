import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find((item) => item._id === product._id); 

    if (existing) {
      return prev.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prev, { ...product, quantity: 1, _id: product._id }]; 
  });
};

  const incrementQuantity = (_id) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};

const decrementQuantity = (_id) => {
  setCartItems((prev) =>
    prev
      .map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0)
  );
};

const deleteFromCart = (_id) => {
  setCartItems((prev) => prev.filter((item) => item._id !== _id));
};

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}