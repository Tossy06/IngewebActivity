import { DB } from "../services/db.js";

const INVENTARY_KEY = "inventaryData";

// Usuarios
document.getElementById("totalUsers").textContent = DB.users.length;

const getUsersByRole = (users, role) =>
  users.filter(user => user.role === role).length;

document.getElementById("totalAdmins").textContent =
  getUsersByRole(DB.users, "Administrador");

document.getElementById("totalEmployees").textContent =
  getUsersByRole(DB.users, "Empleado");

// Inventario (desde localStorage)
const inventary =
  JSON.parse(localStorage.getItem(INVENTARY_KEY)) || DB.inventary;

document.getElementById("totalProducts").textContent = inventary.length;

// Stock total
const totalStock = inventary.reduce(
  (acc, item) => acc + item.stock,
  0
);
document.getElementById("totalStock").textContent = totalStock;

// Entradas
const totalEntries = inventary.reduce(
  (acc, item) => acc + item.entradas,
  0
);
document.getElementById("totalEntries").textContent = totalEntries;

// Salidas
const totalOutputs = inventary.reduce(
  (acc, item) => acc + item.salidas,
  0
);
document.getElementById("totalOutputs").textContent = totalOutputs;

// Stock bajo
const LOW_STOCK_LIMIT = 5;

const lowStockProducts = inventary.filter(
  item => item.stock <= LOW_STOCK_LIMIT
).length;

document.getElementById("lowStockProducts").textContent = lowStockProducts;