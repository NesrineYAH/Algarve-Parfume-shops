import axios from "axios";
import { useEffect, useState } from "react";
import "./Notifications.scss";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5001/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      <h3>Notifications</h3>

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notification ${n.isRead ? "read" : "unread"}`}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
