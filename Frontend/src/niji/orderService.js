// src/services/orderService.js
export async function getOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
