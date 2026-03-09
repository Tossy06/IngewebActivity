import { DB } from "../services/db.js";

const USERS_KEY = "usersData";
const INVENTARY_KEY = "inventaryData";
const LOW_STOCK_LIMIT = 5;

// ================= USUARIOS =================
const users =
  JSON.parse(localStorage.getItem(USERS_KEY)) || DB.users;

document.getElementById("totalUsers").textContent = users.length;

const getUsersByRole = (users, role) =>
  users.filter(user => user.role === role).length;

document.getElementById("totalAdmins").textContent =
  getUsersByRole(users, "Administrador");

document.getElementById("totalEmployees").textContent =
  getUsersByRole(users, "Empleado");

// ================= INVENTARIO =================
const inventary =
  JSON.parse(localStorage.getItem(INVENTARY_KEY)) || DB.inventary;

document.getElementById("totalProducts").textContent = inventary.length;

// Stock total
document.getElementById("totalStock").textContent =
  inventary.reduce((acc, item) => acc + item.stock, 0);

// Entradas totales
document.getElementById("totalEntries").textContent =
  inventary.reduce((acc, item) => acc + item.entradas, 0);

// Salidas totales
document.getElementById("totalOutputs").textContent =
  inventary.reduce((acc, item) => acc + item.salidas, 0);

// Productos con stock bajo
document.getElementById("lowStockProducts").textContent =
  inventary.filter(item => item.stock <= LOW_STOCK_LIMIT).length;