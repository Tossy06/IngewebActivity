import { DB } from "../services/db.js";

document.getElementById("totalUsers").textContent = DB.users.length;
document.getElementById("totalProducts").textContent = DB.inventary.length;

// Tipos de usuarios
const getUsersByRole = (users, role) => {
  return users.filter(user => user.role === role).length;
};

document.getElementById("totalAdmins").textContent = getUsersByRole(DB.users, "Administrador")
document.getElementById("totalEmployees").textContent = getUsersByRole(DB.users, "Empleado")


const totalStock = DB.inventary.reduce(
  (acc, item) => acc + item.stock,
  0
);

document.getElementById("totalStock").textContent = totalStock;