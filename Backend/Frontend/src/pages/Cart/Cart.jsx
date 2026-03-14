import React, { useContext } from "react";
import "./Cart.scss";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";


export default function Cart() {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleNextStep = () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide !!");
      return;
    }

    if (!user) {
      navigate("/Authentification", {
        state: { redirectTo: "/checkout" },
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <CheckoutSteps step={1} />
      <h2> {t("cart.title")}</h2>

      {cartItems.length === 0 ? (
        <p className="empty-message">{t("cart.empty")}</p>
      ) : (
        <div className="cart-items">
        {cartItems.map((item) => (
  <div className="cart-item" key={item.variantId}>
    <img
      src={`http://localhost:5001${item.imageUrl}`}
      alt={item.nom}
      className="cart-item__img"
      onClick={() => navigate(`/produit/${item.productId}`)}
    />

    <div className="item-details">
      <h4>{item.nom}</h4>
      <p>{Number(item.options?.prix || 0).toFixed(2)} €</p>
      <p>
        {t("cart.option")}: {item.options?.size} {item.options?.unit}
      </p>

      <div className="quantity-control">
     <button onClick={() => updateQuantity(item.variantId, -1)}>-</button>

        <span>{item.quantite}</span>
        <button onClick={() => updateQuantity(item.variantId, 1)}>+</button>
      </div>
    </div>
    <Trash2       className="delete-icon"
    onClick={() => removeFromCart(item.variantId)} />
  </div>
))}
          <div className="cart-summary">
            {/* <h2>Total : {totalPrice.toFixed(2)} €</h2> */}
            <h3>{t("cart.total")}  : {Number(totalPrice || 0).toFixed(2)} €</h3>

            <button className="checkout-btn" onClick={handleNextStep}>
 {t("cart.nextStep")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}





