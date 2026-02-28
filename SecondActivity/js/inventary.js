import { DB } from "../services/db.js";

const STORAGE_KEY = "inventaryData";
const LOW_STOCK_LIMIT = 5;

const form = document.getElementById("inventaryForm");
const tableBody = document.getElementById("inventaryTable");

let inventary = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DB.inventary;

const saveInventary = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventary));
};

const renderTable = () => {
  tableBody.innerHTML = "";

  inventary.forEach((item) => {
    const isLowStock = item.stock <= LOW_STOCK_LIMIT;

    tableBody.innerHTML += `
      <tr class="${isLowStock ? "table-danger" : ""}">
        <td>${item.product}</td>
        <td>
          ${item.stock}
          ${
            isLowStock
              ? `<span class="badge bg-danger ms-2">
                   <i class="bi bi-exclamation-triangle-fill"></i> Bajo
                 </span>`
              : ""
          }
        </td>
        <td>${item.entradas}</td>
        <td>${item.salidas}</td>
      </tr>
    `;
  });
};

renderTable();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const product = document.getElementById("product").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const type = document.getElementById("type").value;

  if (!product || quantity <= 0 || !type) return;

  let item = inventary.find(
    (p) => p.product.toLowerCase() === product.toLowerCase()
  );

  if (!item) {
    item = {
      id: inventary.length ? Math.max(...inventary.map((p) => p.id)) + 1 : 1,
      product,
      stock: 0,
      entradas: 0,
      salidas: 0
    };
    inventary.push(item);
  }

  if (type === "entrada") {
    item.stock += quantity;
    item.entradas += quantity;
  } else {
    if (item.stock < quantity) {
      alert("No hay stock suficiente para registrar la salida.");
      return;
    }
    item.stock -= quantity;
    item.salidas += quantity;
  }

  saveInventary();
  renderTable();
  form.reset();
});