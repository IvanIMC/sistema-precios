function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('sidebar').classList.remove('active');
}

function updateFileName() {
    const fileInput = document.getElementById('fileInput');
    document.getElementById('fileName').textContent = fileInput.files[0]?.name || "Sin archivo seleccionado";
}

function filtrar() {
    let input = document.getElementById("search").value.toUpperCase();
    let table = document.getElementById("dataTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().includes(input) ? "" : "none";
        }
    }
}

function clearSearch() {
    document.getElementById("search").value = "";
    filtrar();
}
