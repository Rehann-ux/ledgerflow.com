// ===============================
// NAVBAR MOBILE
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("show");
});

document.querySelectorAll("#navMenu a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("show");
    });
});


// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


// ===============================
// DEMO TRANSAKSI
// ===============================

const defaultTransactions = [
    {
        id: 1,
        name: "Penjualan produk",
        type: "income",
        amount: 3000000
    },
    {
        id: 2,
        name: "Pembayaran jasa",
        type: "income",
        amount: 2000000
    },
    {
        id: 3,
        name: "Pembelian perlengkapan",
        type: "expense",
        amount: 1250000
    },
    {
        id: 4,
        name: "Biaya internet",
        type: "expense",
        amount: 800000
    }
];

let transactions = defaultTransactions.map(function (item) {
    return { ...item };
});

const transactionForm = document.getElementById("transactionForm");
const transactionName = document.getElementById("transactionName");
const transactionType = document.getElementById("transactionType");
const transactionAmount = document.getElementById("transactionAmount");
const transactionList = document.getElementById("transactionList");
const searchTransaction = document.getElementById("searchTransaction");
const emptyMessage = document.getElementById("emptyMessage");

function updateDashboard() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    document.getElementById("balance").textContent =
        formatRupiah(balance);

    document.getElementById("income").textContent =
        formatRupiah(totalIncome);

    document.getElementById("expense").textContent =
        formatRupiah(totalExpense);

    document.getElementById("heroBalance").textContent =
        formatRupiah(balance);

    renderTransactions();
}

function renderTransactions() {
    const keyword = searchTransaction.value.toLowerCase();

    const filteredTransactions = transactions.filter(function (item) {
        return item.name.toLowerCase().includes(keyword);
    });

    transactionList.innerHTML = "";

    emptyMessage.hidden = filteredTransactions.length > 0;

    filteredTransactions.forEach(function (item) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const typeCell = document.createElement("td");
        typeCell.textContent =
            item.type === "income" ? "Pemasukan" : "Pengeluaran";

        const amountCell = document.createElement("td");
        amountCell.textContent = formatRupiah(item.amount);
        amountCell.className =
            item.type === "income" ? "green" : "red";

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            transactions = transactions.filter(function (transaction) {
                return transaction.id !== item.id;
            });

            updateDashboard();
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        transactionList.appendChild(row);
    });
}

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = transactionName.value.trim();
    const type = transactionType.value;
    const amount = Number(transactionAmount.value);

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Masukkan nama dan jumlah transaksi yang valid.");
        return;
    }

    transactions.unshift({
        id: Date.now(),
        name: name,
        type: type,
        amount: amount
    });

    transactionForm.reset();

    updateDashboard();
});

searchTransaction.addEventListener("input", renderTransactions);

document.getElementById("resetBtn").addEventListener("click", function () {
    const confirmed = confirm("Yakin ingin mereset data demo?");

    if (!confirmed) return;

    transactions = defaultTransactions.map(function (item) {
        return { ...item };
    });

    searchTransaction.value = "";

    updateDashboard();
});


// ===============================
// PEMBUAT INVOICE
// ===============================

const invoiceForm = document.getElementById("invoiceForm");
const invoiceResult = document.getElementById("invoiceResult");

invoiceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const business = document.getElementById("businessName").value.trim();
    const customer = document.getElementById("customerName").value.trim();
    const product = document.getElementById("productName").value.trim();
    const quantity = Number(document.getElementById("productQty").value);
    const price = Number(document.getElementById("productPrice").value);

    if (
        !business ||
        !customer ||
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        alert("Periksa kembali data invoice.");
        return;
    }

    const total = quantity * price;
    const invoiceNumber = "INV-" + Date.now().toString().slice(-8);
    const invoiceDate = new Date().toLocaleDateString("id-ID");

    invoiceResult.innerHTML = `
        <h3>${escapeHTML(business)}</h3>
        <p><strong>INVOICE</strong></p>
        <p>Nomor: ${invoiceNumber}</p>
        <p>Tanggal: ${invoiceDate}</p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e8eaf2;">
        <p><strong>Kepada:</strong> ${escapeHTML(customer)}</p>
        <p><strong>Produk/Jasa:</strong> ${escapeHTML(product)}</p>
        <p><strong>Jumlah:</strong> ${quantity}</p>
        <p><strong>Harga satuan:</strong> ${formatRupiah(price)}</p>
        <p class="invoice-total">Total: ${formatRupiah(total)}</p>
        <button type="button" class="btn primary" id="printInvoice">
            Cetak / Simpan PDF
        </button>
    `;

    invoiceResult.hidden = false;

    document.getElementById("printInvoice").addEventListener("click", function () {
        window.print();
    });
});


// ===============================
// AMANKAN TEKS INVOICE
// ===============================

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// ===============================
// FORM KONTAK
// ===============================

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    contactMessage.textContent = "Mengirim pesan...";
    contactMessage.className = "";

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            contactMessage.textContent = "Pesan berhasil dikirim!";
            contactMessage.style.color = "#119b70";
            contactForm.reset();
        } else {
            contactMessage.textContent =
                "Pesan gagal dikirim. Periksa pengaturan Formspree.";
            contactMessage.style.color = "#e34d59";
        }
    } catch (error) {
        contactMessage.textContent =
            "Terjadi kesalahan koneksi. Coba lagi nanti.";
        contactMessage.style.color = "#e34d59";
    }
});


// ===============================
// TAHUN FOOTER
// ===============================

document.getElementById("year").textContent =
    new Date().getFullYear();


// Jalankan dashboard saat halaman dibuka
updateDashboard();