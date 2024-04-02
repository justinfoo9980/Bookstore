import React, { useState } from "react";
import axios from "axios";

const Top = () => {
  const [cartData, setCartData] = useState(null);

  const fetchCartData = async () => {
    try {
      const response = await axios.get("/api/cart"); // Replace "/api/cart" with your actual API endpoint
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  return (
    <div className="top">
      <h1>MeeBook MeeKia</h1>
      <div className="cart-container">
        <button className="cart-button" onClick={fetchCartData}>
          CART
        </button>
      </div>
      {cartData && (
        <div className="cart-info">
          {/* Display cart information here */}
          {/* Example: <p>Total items in cart: {cartData.totalItems}</p> */}
        </div>
      )}
    </div>
  );
};

export default Top;
