// Fungsi untuk membuka tab
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("form-wrap");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("nav-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

// Fungsi Default Tab
function openDefaultTab() {
    openTab(event, "FormTab");
}

// Fungsi untuk memvalidasi data ketika submit
function validasiData(nama, umur, saku) {
    if (!nama || !umur || !saku) {
        return "Data gagal disimpan \nPeriksa Kembali data";
    }

    if (nama.length < 10) {
        return "Nama harus memiliki minimal 10 karakter.";
    }

    if (umur < 25) {
        return "Umur harus minimal 25 tahun.";
    }

    // Memeriksa uang saku
    if (saku < 100000 || saku > 1000000) {
        return "Uang Saku harus minimal 100.000 dan maksimal 1.000.000.";
    }

    return null;
}

// Fungsi untuk menambahkan data ke tabel dan menyimpan ke localStorage
function tambahData() {
    const InpNama = document.getElementById("InputNama").value;
    const nama = InpNama.trim();
    const umur = parseInt(document.getElementById("InputUmur").value);
    const saku = parseInt(document.getElementById("InputSaku").value);

    // Memeriksa validitas data menggunakan fungsi validasi
    const error = validasiData(nama, umur, saku);

    if (error) {
        alert(error);
        return;
    }else{
        alert("Data Berhasil Disimpan")
    }

    const data = {
        nama: nama,
        umur: umur,
        saku: saku,
    };

    // Mendapatkan data dari localStorage atau inisialisasi jika belum ada
    const existingData = JSON.parse(localStorage.getItem("data")) || [];

    // Menambahkan data baru ke array
    existingData.push(data);

    // Menyimpan array data ke localStorage
    localStorage.setItem("data", JSON.stringify(existingData));

    // Mengganti tampilan tabel dengan data dari localStorage
    tampilkanData();

    // Mengosongkan input fields
    document.getElementById("InputNama").value = "";
    document.getElementById("InputUmur").value = "";
    document.getElementById("InputSaku").value = "";
}

// Fungsi untuk menampilkan data dari localStorage ke tabel
function tampilkanData() {
    const dataTabel = document.getElementById("dataTabel");
    const dataResume = document.getElementById("dataResume");
    dataTabel.innerHTML = "";
    dataResume.innerHTML = "";

    // Mendapatkan data dari localStorage
    const existingData = JSON.parse(localStorage.getItem("data")) || [];

    // Menambahkan data ke tabel
    for (let i = 0; i < existingData.length; i++) {
        const newRow = dataTabel.insertRow(dataTabel.rows.length);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = existingData[i].nama;
        cell2.innerHTML = existingData[i].umur;

        existingData[i].saku = existingData[i].saku.toString();
        split = existingData[i].saku.split(','),
            sisa = split[0].length % 3,
            sakuRupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // tambahkan titik jika yang di input sudah menjadi angka ribuan
        if (ribuan) {
            separator = sisa ? '.' : '';
            sakuRupiah += separator + ribuan.join('.');
        }

        sakuRupiah = split[1] != undefined ? sakuRupiah + ',' + split[1] : sakuRupiah;
        cell3.innerHTML = `Rp. ${sakuRupiah}`;

        // Menambahkan tombol "Remove" dengan atribut data-index
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "&#215;";
        removeButton.classList.add("btn-remove");
        removeButton.setAttribute("data-index", i);
        removeButton.addEventListener("click", function (event) {
            const dataIndex = event.target.getAttribute("data-index");
            hapusData(dataIndex);
        });

        cell4.appendChild(removeButton);
    }

    //Menambahkan resume
    dataResume.innerHTML = avgResult();

}

// Fungsi untuk menghapus data dari localStorage
function hapusData(index) {
    const existingData = JSON.parse(localStorage.getItem("data")) || [];
    existingData.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(existingData));
    tampilkanData();
}

function avgResult() {
    const existingData = JSON.parse(localStorage.getItem("data")) || [];

    // Memeriksa apakah ada data yang tersimpan
    if (existingData.length === 0) {
        return "Belum ada data yang diinputkan.";
    }

    // Menghitung total
    let totalSaku = 0;
    let totalUmur = 0;
    for (let i = 0; i < existingData.length; i++) {
        totalSaku += existingData[i].saku;
        totalUmur += existingData[i].umur;
    }

    // Menghitung rata-rata
    let avgSaku = totalSaku / existingData.length;
    let avgUmur = totalUmur / existingData.length;
    avgSaku = Math.round(avgSaku);
    avgUmur = Math.round(avgUmur);

    avgSaku = avgSaku.toString();
    split = avgSaku.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;

    return `Rata rata pendaftar memiliki uang saku sebesar<br><span>Rp. ${rupiah} </span>dengan rata rata umur <span>${avgUmur} Tahun.</span>`;
}

// Memanggil tampilkanData dan Default Tab saat halaman dimuat
document.addEventListener("DOMContentLoaded", tampilkanData);
document.addEventListener("DOMContentLoaded", openDefaultTab);