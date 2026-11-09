/* ===== Helper ===== */
const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const baca = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const page = document.body.dataset.page;
const user = JSON.parse(sessionStorage.getItem("user") || "null");
const emailValid = (e) => /^\S+@\S+\.\S+$/.test(e);
const semuaUser = () => [...dataUser, ...baca("users", [])];
const semuaTrx = () => [...dataTransaksi, ...baca("trx", [])];
const semuaTrack = () => [...dataTracking, ...baca("trk", [])];

function setError(id, pesan) { $("#err-" + id).textContent = pesan || ""; return !pesan; }
function buatSel(teks, tag = "td") { const c = document.createElement(tag); c.textContent = teks; return c; }
function bukaModal(id) { $("#" + id).classList.add("show"); }

if (page !== "login" && !user) location.href = "index.html"; // guard login

// Modal: buka/tutup lewat atribut data-*
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.open) bukaModal(t.dataset.open);
  if ((t.dataset && t.dataset.close) || t.classList.contains("modal")) t.closest(".modal").classList.remove("show");
  if (t.id === "btnLogout") { sessionStorage.clear(); location.href = "index.html"; }
});

/* ===== 1. LOGIN ===== */
if (page === "login") {
  $("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#email").value.trim(), pw = $("#password").value;
    if (!emailValid(em) || !pw) { alert("Isi email dengan format yang benar dan password tidak boleh kosong."); return; }
    const u = semuaUser().find((x) => x.email === em && x.password === pw);
    if (!u) { alert("Email/password yang anda masukkan salah"); return; }
    sessionStorage.setItem("user", JSON.stringify(u));
    location.href = "dashboard.html";
  });

  $("#formLupa").addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#lupaEmail").value.trim();
    if (!setError("lupa", !emailValid(em) ? "Format email tidak valid." : !semuaUser().some((x) => x.email === em) ? "Email belum terdaftar." : "")) return;
    alert("Tautan reset password telah dikirim ke " + em + " (simulasi).");
    e.target.reset(); e.target.closest(".modal").classList.remove("show");
  });

  $("#formDaftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#dfNama").value.trim(), em = $("#dfEmail").value.trim(), pw = $("#dfPass").value, pw2 = $("#dfPass2").value;
    let msg = "";
    if (nama.length < 3) msg = "Nama minimal 3 karakter.";
    else if (!emailValid(em)) msg = "Format email tidak valid.";
    else if (semuaUser().some((x) => x.email === em)) msg = "Email sudah terdaftar.";
    else if (pw.length < 6) msg = "Password minimal 6 karakter.";
    else if (pw !== pw2) msg = "Konfirmasi password tidak sama.";
    if (!setError("daftar", msg)) return;
    const baru = baca("users", []); baru.push({ nama, email: em, password: pw });
    localStorage.setItem("users", JSON.stringify(baru));
    alert("Pendaftaran berhasil! Silakan login.");
    e.target.reset(); e.target.closest(".modal").classList.remove("show");
  });
}

/* ===== 2. DASHBOARD ===== */
if (page === "dashboard") {
  const jam = new Date().getHours();
  const sapa = jam < 11 ? "Selamat pagi" : jam < 15 ? "Selamat siang" : jam < 18 ? "Selamat sore" : "Selamat malam";
  $("#greeting").textContent = sapa + ", " + user.nama;
  $("#tanggal").textContent = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });

  const trx = semuaTrx();
  const tbody = $("#bodyHistory");
  trx.forEach((t) => {
    const tr = document.createElement("tr");
    [t.no, t.tanggal, t.nama, rp(t.total), t.bayar].forEach((v) => tr.append(buatSel(v)));
    tbody.append(tr);
  });
  $("#lapJumlah").textContent = trx.length + " pesanan";
  $("#lapTotal").textContent = rp(trx.reduce((a, t) => a + t.total, 0));
  $("#lapRata").textContent = rp(trx.length ? trx.reduce((a, t) => a + t.total, 0) / trx.length : 0);
}

/* ===== 3. STOK ===== */
if (page === "stok") {
  const body = $("#bodyStok");
  function badge(s) {
    const b = document.createElement("span"); b.className = "badge " + (s === 0 ? "habis" : s < 10 ? "sedikit" : "ok");
    b.textContent = s === 0 ? "Habis" : s < 10 ? "Menipis" : "Tersedia"; return b;
  }
  function tambahBaris(b) { // manipulasi DOM: buat baris baru
    const tr = document.createElement("tr");
    const tdImg = document.createElement("td"), img = document.createElement("img");
    img.src = "img/" + b.gambar; img.alt = "Sampul " + b.judul; img.onerror = () => (img.style.visibility = "hidden");
    tdImg.append(img);
    const tdSt = document.createElement("td"); tdSt.append(badge(b.stok));
    const tdAksi = document.createElement("td"), hapus = document.createElement("button");
    hapus.className = "bahaya"; hapus.textContent = "Hapus";
    hapus.onclick = () => { if (confirm("Hapus \"" + b.judul + "\" dari stok?")) { tr.remove(); hitung(); } };
    tdAksi.append(hapus);
    tr.append(tdImg, buatSel(b.kode), buatSel(b.judul), buatSel(b.kategori), buatSel(rp(b.harga)), buatSel(b.stok), tdSt, tdAksi);
    body.append(tr); hitung();
  }
  function hitung() { $("#jumlahBuku").textContent = body.rows.length + " judul buku"; }
  dataKatalogBuku.forEach(tambahBaris);

  $("#formStok").addEventListener("submit", (e) => {
    e.preventDefault();
    const kode = $("#sKode").value.trim().toUpperCase(), judul = $("#sJudul").value.trim(), kat = $("#sKat").value.trim();
    const harga = Number($("#sHarga").value), stok = Number($("#sStok").value);
    const ada = [...body.rows].some((r) => r.cells[1].textContent === kode);
    let msg = "";
    if (!kode || !judul || !kat) msg = "Kode, judul, dan kategori wajib diisi.";
    else if (ada) msg = "Kode " + kode + " sudah ada.";
    else if (!(harga > 0)) msg = "Harga harus lebih dari 0.";
    else if (!Number.isInteger(stok) || stok < 0) msg = "Stok harus bilangan bulat 0 atau lebih.";
    if (!setError("stok", msg)) return;
    tambahBaris({ kode, judul, kategori: kat, harga, stok, gambar: "buku1.png" });
    e.target.reset(); alert("Stok baru berhasil ditambahkan.");
  });
}

/* ===== 4. CHECKOUT ===== */
if (page === "checkout") {
  let keranjang = [];
  const pilih = $("#pilihBuku");
  dataKatalogBuku.filter((b) => b.stok > 0).forEach((b) => {
    const o = document.createElement("option"); o.value = b.kode; o.textContent = b.judul + " - " + rp(b.harga) + " (stok " + b.stok + ")"; pilih.append(o);
  });
  const cari = (k) => dataKatalogBuku.find((b) => b.kode === k);

  function render() {
    const body = $("#bodyKeranjang"); body.replaceChildren();
    keranjang.forEach((it, i) => {
      const b = cari(it.kode), tr = document.createElement("tr");
      const tdQty = document.createElement("td"), q = document.createElement("input");
      q.type = "number"; q.min = 1; q.max = b.stok; q.value = it.qty;
      q.onchange = () => { const v = parseInt(q.value); if (!(v >= 1) || v > b.stok) { alert("Jumlah harus 1 - " + b.stok + " (sesuai stok)."); q.value = it.qty; return; } it.qty = v; render(); };
      tdQty.append(q);
      const tdA = document.createElement("td"), h = document.createElement("button");
      h.className = "bahaya"; h.textContent = "Hapus"; h.onclick = () => { keranjang.splice(i, 1); render(); }; tdA.append(h);
      tr.append(buatSel(b.judul), buatSel(rp(b.harga)), tdQty, buatSel(rp(b.harga * it.qty)), tdA); body.append(tr);
    });
    $("#kosong").classList.toggle("hidden", keranjang.length > 0);
    $("#totalBayar").textContent = rp(keranjang.reduce((a, it) => a + cari(it.kode).harga * it.qty, 0));
  }
  render();

  $("#btnTambah").addEventListener("click", () => {
    const kode = pilih.value, qty = parseInt($("#qtyBaru").value), b = cari(kode);
    if (!kode) return setError("keranjang", "Pilih buku terlebih dahulu.");
    if (!(qty >= 1)) return setError("keranjang", "Jumlah minimal 1.");
    const ada = keranjang.find((x) => x.kode === kode), total = (ada ? ada.qty : 0) + qty;
    if (total > b.stok) return setError("keranjang", "Jumlah melebihi stok (" + b.stok + ").");
    if (ada) ada.qty = total; else keranjang.push({ kode, qty });
    setError("keranjang", ""); render();
  });

  $("#formOrder").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#oNama").value.trim(), em = $("#oEmail").value.trim(), hp = $("#oHp").value.trim();
    const alamat = $("#oAlamat").value.trim(), bayar = $("#oBayar").value, eksp = $("#oEksp").value;
    let msg = "";
    if (!keranjang.length) msg = "Keranjang masih kosong. Tambahkan buku dulu.";
    else if (nama.length < 3) msg = "Nama pemesan minimal 3 karakter.";
    else if (!emailValid(em)) msg = "Format email tidak valid.";
    else if (!/^08\d{8,11}$/.test(hp)) msg = "Nomor HP harus diawali 08 dan 10-13 digit.";
    else if (alamat.length < 10) msg = "Alamat pengiriman minimal 10 karakter.";
    else if (!bayar || !eksp) msg = "Pilih metode pembayaran dan ekspedisi.";
    if (!setError("order", msg)) return;

    const total = keranjang.reduce((a, it) => a + cari(it.kode).harga * it.qty, 0);
    const jml = keranjang.reduce((a, it) => a + it.qty, 0);
    const no = "DO" + Date.now().toString().slice(-9), tgl = new Date().toISOString().slice(0, 10);
    const trx = baca("trx", []); trx.push({ no, tanggal: tgl, nama, total, bayar }); localStorage.setItem("trx", JSON.stringify(trx));
    const trk = baca("trk", []); trk.push({ no, nama, status: 0, ekspedisi: eksp, tanggal: tgl, paket: "Paket Buku (" + jml + " item)", total }); localStorage.setItem("trk", JSON.stringify(trk));
    $("#noDO").textContent = no; bukaModal("modalSukses");
    keranjang = []; render(); e.target.reset();
  });
}

/* ===== 5. TRACKING ===== */
if (page === "tracking") {
  $("#formCari").addEventListener("submit", (e) => {
    e.preventDefault();
    const no = $("#noDelivery").value.trim().toUpperCase(), hasil = $("#hasil");
    if (!setError("cari", no ? "" : "Nomor Delivery Order wajib diisi.")) return;
    const d = semuaTrack().find((x) => x.no === no);
    if (!d) { hasil.classList.add("hidden"); alert("Nomor Delivery Order " + no + " tidak ditemukan."); return; }
    $("#rNama").textContent = d.nama; $("#rEksp").textContent = d.ekspedisi; $("#rTgl").textContent = d.tanggal;
    $("#rPaket").textContent = d.paket; $("#rTotal").textContent = rp(d.total); $("#rStatus").textContent = tahapPengiriman[d.status];
    $("#bar").style.width = ((d.status + 1) / tahapPengiriman.length) * 100 + "%";
    const ul = $("#tahap"); ul.replaceChildren();
    tahapPengiriman.forEach((t, i) => { const li = buatSel(t, "li"); if (i <= d.status) li.className = "on"; ul.append(li); });
    hasil.classList.remove("hidden");
  });
}
