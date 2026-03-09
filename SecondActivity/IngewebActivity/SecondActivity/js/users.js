import { DB } from "../services/db.js"; 

const STORAGE_KEY = "usersData";

const form = document.getElementById("userForm");
const tableBody = document.getElementById("usersTable");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");

let users = [];
let editingUserId = null;

// ===== Inicialización =====
const storedUsers = localStorage.getItem(STORAGE_KEY);

if (storedUsers) {
  users = JSON.parse(storedUsers);
} else {
  users = DB.users;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const saveUsers = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// ===== Render =====
const renderTable = () => {
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const roleBadge =
      user.role === "Administrador"
        ? `<span class="badge bg-danger">Administrador</span>`
        : `<span class="badge bg-secondary">Empleado</span>`;

    tableBody.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${roleBadge}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `;
  });
};

renderTable();

// ===== Crear / Editar =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleInput.value;

  if (!name || !email || !role) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Validar correo duplicado
  const emailExists = users.some(
    u => u.email.toLowerCase() === email.toLowerCase() && u.id !== editingUserId
  );

  if (emailExists) {
    alert("Este correo ya está registrado.");
    return;
  }

  if (editingUserId) {
    // ✏️ Editar
    const user = users.find(u => u.id === editingUserId);
    user.name = name;
    user.email = email;
    user.role = role;
    editingUserId = null;
  } else {
    // ➕ Crear
    users.push({
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      role
    });
  }

  saveUsers();
  renderTable();
  form.reset();
});

// ===== Editar =====
window.editUser = (id) => {
  const user = users.find(u => u.id === id);

  nameInput.value = user.name;
  emailInput.value = user.email;
  roleInput.value = user.role;

  editingUserId = id;
};

// ===== Eliminar =====
window.deleteUser = (id) => {
  if (!confirm("¿Desea eliminar este usuario?")) return;

  users = users.filter(u => u.id !== id);
  saveUsers();
  renderTable();
};