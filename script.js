let currentPage = 1;
const itemsPerPage = 20;
let fullRows = [];

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("mainContent").classList.toggle("shift");
}

function closeMenu(event) {
    if (!document.getElementById("sidebar").contains(event.target) && !document.querySelector(".menu-btn").contains(event.target)) {
        document.getElementById("sidebar").classList.remove("active");
        document.getElementById("mainContent").classList.remove("shift");
    }
}

function updateFileName() {
    const file = document.getElementById('fileInput').files[0];
    document.getElementById('fileName').textContent = file ? file.name : 'Sin archivo seleccionado';
}

function processExcel() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) { alert('Selecciona un archivo primero.'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1);

        const nombreArchivo = file.name;
        let storedData = JSON.parse(localStorage.getItem('dataList') || '[]');
        const timestamp = new Date().toLocaleString();
        const existingIndex = storedData.findIndex(data => data.nombreArchivo === nombreArchivo);

        if (existingIndex !== -1) {
            storedData[existingIndex] = { nombreArchivo, timestamp, rows };
        } else {
            storedData.push({ nombreArchivo, timestamp, rows });
        }

        localStorage.setItem('dataList', JSON.stringify(storedData));
        fullRows = storedData.flatMap(data => data.rows);
        displayTable();
        cargarHistorial();
    };
    reader.readAsArrayBuffer(file);
}

function displayTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedRows = fullRows.slice(start, end);
    const maxCols = 8;

    document.getElementById('tableBody').innerHTML = paginatedRows.map(row => {
        let celdas = row.map(cell => `<td>${cell || "..."}</td>`);
        while (celdas.length < maxCols) celdas.push('<td>...</td>');
        return `<tr>${celdas.join('')}</tr>`;
    }).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(fullRows.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const createPageItem = (text, page, active = false, disabled = false) => {
        return `<li class="page-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}">
                    <button class="page-link" onclick="goToPage(${page})">${text}</button>
                </li>`;
    };

    if (currentPage > 1) {
        pagination.innerHTML += createPageItem("Anterior", currentPage - 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + 4, totalPages);

    if (start > 1) pagination.innerHTML += createPageItem("1", 1);
    if (start > 2) pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;

    for (let i = start; i <= end; i++) {
        pagination.innerHTML += createPageItem(i, i, currentPage === i);
    }

    if (end < totalPages - 1) pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    if (end < totalPages) pagination.innerHTML += createPageItem(totalPages, totalPages);

    if (currentPage < totalPages) {
        pagination.innerHTML += createPageItem("Siguiente", currentPage + 1);
    }
}

function goToPage(page) {
    currentPage = page;
    displayTable();
}

function searchTable() {
    const input = document.getElementById("search").value.toLowerCase();
    const filtered = fullRows.filter(row => row.join(" ").toLowerCase().includes(input));
    fullRows = filtered;
    currentPage = 1;
    displayTable();
}

function clearSearch() {
    document.getElementById("search").value = "";
    const storedData = JSON.parse(localStorage.getItem('dataList') || '[]');
    fullRows = storedData.flatMap(data => data.rows);
    currentPage = 1;
    displayTable();
}

function cargarHistorial() {
    const storedData = JSON.parse(localStorage.getItem('dataList') || '[]');
    document.getElementById('historialLista').innerHTML = storedData.map(data =>
        `<li class="list-group-item list-group-item-dark">${data.nombreArchivo} - ${data.timestamp}</li>`
    ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const storedData = JSON.parse(localStorage.getItem('dataList') || '[]');
    fullRows = storedData.flatMap(data => data.rows);
    displayTable();
    cargarHistorial();
});
