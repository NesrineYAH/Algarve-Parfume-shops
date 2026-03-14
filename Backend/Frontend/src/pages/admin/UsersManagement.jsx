//pages/admin/UsersManagement.jsx 
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

export default function UsersManagement() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);


useEffect(() => {
  axios.get("/api/users/role/vendeur").then((res) => setUsers(res.data));
}, []);



  return (
    <div className="admin-table">
      <h2>Gestion des utilisateurs</h2>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
  <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nom} {user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <button onClick={() => handleDelete(user._id)}>Supprimer</button>
                <button onClick={() => handleRoleChange(user._id)}>
                  Changer rôle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

