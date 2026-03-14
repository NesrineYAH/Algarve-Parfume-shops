import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5001/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Commande introuvable");
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  // 🔒 Redirection si déjà payée
  useEffect(() => {
    if (order?.paymentStatus === "paid") {
      navigate("/orders");
    }
  }, [order, navigate]);

  const handlePay = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5001/api/stripe/checkout-order/${orderId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Paiement commande</h1>
      <p>Commande n° {order._id}</p>
      <p>Total : {order.totalPrice} €</p>
      <p>Statut : {order.paymentStatus}</p>

      <button onClick={handlePay}>
        Payer maintenant
      </button>
    </div>
  );
}
