const API_URL = "https://script.google.com/macros/s/AKfycbyxk_k_Y4XfdgmWuvKS8q7PVKPnXpq5DuWIqBcRr_Rowa0xlWKv7eOwjOea_3g7IOjO/exec";

let allData = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    allData = data;
    populateFilter(data);
    renderSoal(data);
  });

function renderSoal(data) {
  const container = document.getElementById('soal-container');
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<p>Belum ada soal tersedia.</p>';
    return;
  }

  data.forEach(soal => {
    const div = document.createElement('div');
    div.className = 'soal-item';
    div.innerHTML = `
      <strong>${soal.pelajaran}</strong><br>
      Tahun: ${soal.tahun}<br>
      Jenis: ${soal.jenis}<br>
      Semester: ${soal.semester}<br>
      <a href="${soal.link}" target="_blank">Download Soal</a>
    `;
    container.appendChild(div);
  });
}

function populateFilter(data) {
  const tahunSet = new Set(data.map(d => d.tahun));
  const jenisSet = new Set(data.map(d => d.jenis));
  const semesterSet = new Set(data.map(d => d.semester));
  const pelajaranSet = new Set(data.map(d => d.pelajaran));

  document.getElementById('filter-tahun').innerHTML = '<option value="">Tahun Ajaran</option>' + 
    Array.from(tahunSet).map(x => `<option value="${x}">${x}</option>`).join('');
  document.getElementById('filter-jenis').innerHTML = '<option value="">Jenis Ujian</option>' + 
    Array.from(jenisSet).map(x => `<option value="${x}">${x}</option>`).join('');
  document.getElementById('filter-semester').innerHTML = '<option value="">Semester</option>' + 
    Array.from(semesterSet).map(x => `<option value="${x}">${x}</option>`).join('');
  document.getElementById('filter-pelajaran').innerHTML = '<option value="">Pelajaran</option>' + 
    Array.from(pelajaranSet).map(x => `<option value="${x}">${x}</option>`).join('');
}

document.getElementById('form-soal').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const file = form.file.files[0];

  const reader = new FileReader();
  reader.onload = function() {
    const base64Data = reader.result.split(',')[1];

    // Pakai FormData TANPA headers
    const formData = new FormData();
    formData.append("tahun", form.tahun.value);
    formData.append("jenis", form.jenis.value);
    formData.append("semester", form.semester.value);
    formData.append("pelajaran", form.pelajaran.value);
    formData.append("file", base64Data);
    formData.append("nama_file", file.name);

    fetch(API_URL, {
      method: "POST",
      body: formData // TANPA headers!
    })
    .then((res) => res.text())
    .then((text) => {
      alert("Soal berhasil di-upload!");
      location.reload();
    })
    .catch((err) => {
      alert("Gagal upload soal");
      console.error(err);
    });
  };

  reader.readAsDataURL(file);
});
