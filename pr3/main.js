import { getUsers } from './api.js';
import { filterByCity, sortByName } from './utils.js';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('usersList');
const reloadButton = document.getElementById('reloadButton');
const cityFilter = document.getElementById('cityFilter');

let allUsers = [];

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

// Заповнює випадаючий список унікальними містами.
function fillCityOptions(users) {
  const current = cityFilter.value;
  const cities = [...new Set(users.map(u => u.address.city))].sort((a, b) => a.localeCompare(b));

  cityFilter.innerHTML = '<option value="all">Усі міста</option>';
  for (const city of cities) {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  }

  // Зберігаємо обране місто після перезавантаження, якщо воно ще існує.
  cityFilter.value = cities.includes(current) ? current : 'all';
}

// Виводить користувачів у <ul>.
function renderUsers(users) {
  listEl.innerHTML = '';

  if (users.length === 0) {
    setStatus('Користувачів не знайдено.');
    return;
  }

  for (const user of users) {
    const li = document.createElement('li');

    const name = document.createElement('strong');
    name.textContent = user.name;

    const info = document.createElement('div');
    info.className = 'muted';
    info.textContent = `${user.email} · ${user.address.city}`;

    li.append(name, info);
    listEl.appendChild(li);
  }

  setStatus(`Знайдено користувачів: ${users.length}`);
}

// Застосовує поточний фільтр і сортування.
function applyFilter() {
  const city = cityFilter.value;
  const filtered = city === 'all' ? allUsers : filterByCity(allUsers, city);
  renderUsers(sortByName(filtered));
}

async function loadUsers() {
  setStatus('Завантаження...');
  listEl.innerHTML = '';

  try {
    allUsers = await getUsers();
    fillCityOptions(allUsers);
    applyFilter();
  } catch (error) {
    if (error instanceof SyntaxError) {
      setStatus('Помилка: отримано невалідний JSON.', true);
    } else {
      setStatus(`Помилка завантаження: ${error.message}`, true);
    }
  }
}

cityFilter.addEventListener('change', applyFilter);
reloadButton.addEventListener('click', loadUsers);

loadUsers();
