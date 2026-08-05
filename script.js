// DEFAULT PATIENT RECORDS
const defaultRecords = [
  {
    id: 1,
    name: "Eleanor Vance",
    age: 34,
    dept: "Cardiology",
    doctor: "Dr. Aris Thorne",
    diagnosis: "Routine hypertension follow-up and ECG examination.",
    date: "2026-08-12",
    status: "Scheduled"
  },
  {
    id: 2,
    name: "Marcus Holloway",
    age: 28,
    dept: "Neurology",
    doctor: "Dr. Clara Oswald",
    diagnosis: "Migraine management evaluation and MRI review.",
    date: "2026-08-05",
    status: "Completed"
  },
  {
    id: 3,
    name: "Sophia Chen",
    age: 12,
    dept: "Pediatrics",
    doctor: "Dr. Julian Bashir",
    diagnosis: "Annual pediatric checkup and immunization update.",
    date: "2026-08-15",
    status: "Pending Review"
  }
];

// STATE MANAGEMENT
let records = JSON.parse(localStorage.getItem("healthRecords")) || defaultRecords;

// RENDER RECORDS & METRICS
function renderRecords(filterList = records) {
  const grid = document.getElementById("recordsGrid");
  grid.innerHTML = "";

  if (filterList.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No patient records found.</p>`;
    updateMetrics();
    return;
  }

  filterList.forEach(rec => {
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="patient-info">
          <h3>${rec.name}</h3>
          <span>${rec.age} Yrs Old • ${rec.dept}</span>
        </div>
        <span class="status-badge status-${rec.status.replace(' ', '')}">${rec.status}</span>
      </div>

      <div class="record-body">
        <p>${rec.diagnosis}</p>
        <div class="record-meta">
          <p><strong>Doctor:</strong> ${rec.doctor}</p>
          <p><strong>Date:</strong> ${rec.date}</p>
        </div>
      </div>

      <div class="card-actions">
        <button onclick="toggleStatus(${rec.id})"><i class="fas fa-sync-alt"></i> Update Status</button>
        <button class="btn-del" onclick="deleteRecord(${rec.id})"><i class="far fa-trash-alt"></i> Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });

  updateMetrics();
}

// UPDATE METRICS
function updateMetrics() {
  document.getElementById("statTotalPatients").innerText = records.length;
  const scheduledCount = records.filter(r => r.status === "Scheduled").length;
  document.getElementById("statAppointments").innerText = scheduledCount;
}

// TOGGLE APPOINTMENT STATUS
function toggleStatus(id) {
  const statuses = ["Scheduled", "Completed", "Pending Review"];
  records = records.map(r => {
    if (r.id === id) {
      const nextIdx = (statuses.indexOf(r.status) + 1) % statuses.length;
      r.status = statuses[nextIdx];
    }
    return r;
  });
  saveAndRender();
}

// DELETE RECORD
function deleteRecord(id) {
  records = records.filter(r => r.id !== id);
  saveAndRender();
}

// SEARCH & FILTER
function filterRecords() {
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  const deptVal = document.getElementById("departmentFilter").value;
  const statusVal = document.getElementById("statusFilter").value;

  const filtered = records.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchVal) ||
                        r.diagnosis.toLowerCase().includes(searchVal) ||
                        r.doctor.toLowerCase().includes(searchVal);
    const matchDept = deptVal === "all" || r.dept === deptVal;
    const matchStatus = statusVal === "all" || r.status === statusVal;

    return matchSearch && matchDept && matchStatus;
  });

  renderRecords(filtered);
}

// MODAL CONTROLS
function openBookingModal() {
  document.getElementById("bookingModal").style.display = "flex";
}

function closeBookingModal() {
  document.getElementById("bookingModal").style.display = "none";
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const newRecord = {
    id: Date.now(),
    name: document.getElementById("patientName").value,
    age: document.getElementById("patientAge").value,
    dept: document.getElementById("patientDept").value,
    doctor: document.getElementById("doctorName").value,
    diagnosis: document.getElementById("patientDiagnosis").value,
    date: document.getElementById("appointmentDate").value,
    status: document.getElementById("appointmentStatus").value
  };

  records.push(newRecord);
  saveAndRender();
  closeBookingModal();
  document.getElementById("bookingForm").reset();
}

// PERSISTENCE
function saveAndRender() {
  localStorage.setItem("healthRecords", JSON.stringify(records));
  renderRecords();
}

// INITIALIZE
renderRecords();
