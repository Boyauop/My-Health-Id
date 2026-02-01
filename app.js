// Minimal SPA router & UI renderer for prototype

const Views = {
  dashboard: renderDashboard,
  "health-id": renderHealthID,
  records: renderRecords,
  appointments: renderAppointments,
  telemed: renderTelemed,
  derm: renderDerm,
  "drug-checker": renderDrugChecker,
  hie: renderHIE,
  admin: renderAdmin
};

const roleSelect = document.getElementById('role');
const sidenav = document.getElementById('sidenav');
const main = document.getElementById('main');
const rightRail = document.getElementById('right-rail');
const emergencyBtn = document.getElementById('emergency-btn');

function init(){
  document.querySelectorAll('.sidenav li').forEach(li=>{
    li.addEventListener('click', ()=> {
      document.querySelectorAll('.sidenav li').forEach(x=>x.classList.remove('active'));
      li.classList.add('active');
      navigateTo(li.dataset.view);
    })
  });
  roleSelect.addEventListener('change', ()=> {
    const role = roleSelect.value;
    document.querySelectorAll('.admin-only').forEach(el=> el.style.display = role === 'admin' ? 'block' : 'none');
    navigateTo('dashboard');
  });
  emergencyBtn.addEventListener('click', ()=> showEmergencyModal());
  navigateTo('dashboard');
  renderRightRail(SAMPLE_PATIENT);
}

function navigateTo(view){
  const fn = Views[view] || renderNotFound;
  main.innerHTML = '';
  fn(main);
}

function renderRightRail(patient){
  rightRail.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <h3>Quick Summary</h3>
    <p><strong>${patient.name}</strong></p>
    <p class="small">${patient.dob} • ${patient.gender}</p>
    <hr/>
    <p><strong>Allergies</strong></p>
    <p>${patient.allergies.join(', ') || 'None'}</p>
    <p><strong>Medications</strong></p>
    <p>${patient.medications.slice(0,3).join(', ') || 'None'}</p>
    <hr/>
    <button class="btn" onclick="alert('Open full consent panel')">Manage Consent</button>
  `;
  rightRail.appendChild(el);
}

/* Views */

function renderDashboard(root){
  const role = roleSelect.value;
  const wrapper = document.createElement('div');
  const healthCard = document.createElement('section');
  healthCard.className = 'card health-id';
  healthCard.innerHTML = `
    <div class="id-card" style="display:flex;gap:16px;align-items:center">
      <div style="min-width:260px;padding:14px;border-radius:12px;background:linear-gradient(180deg,#fff,#f7fbff);box-shadow:0 6px 18px rgba(51,107,255,0.06)">
        <h3>Health ID</h3>
        <div style="margin-top:8px"><span class="badge">${SAMPLE_PATIENT.healthId}</span></div>
        <p style="margin-top:10px;color:var(--muted)">Issued: ${SAMPLE_PATIENT.issued}</p>
        <div style="margin-top:10px"><button class="btn primary" onclick="navigator.clipboard.writeText('${SAMPLE_PATIENT.healthId}')">Copy ID</button> <button class="btn" onclick="alert('Share QR (mock)')">Share QR</button></div>
      </div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h2 style="margin:0">${SAMPLE_PATIENT.name}</h2>
            <small style="color:var(--muted)">${SAMPLE_PATIENT.dob} • ${SAMPLE_PATIENT.gender}</small>
          </div>
          <div class="controls">
            <button class="btn" onclick="navigateTo('appointments')">Book Appointment</button>
            <button class="btn" onclick="navigateTo('telemed')">Start Visit</button>
          </div>
        </div>
        <div style="margin-top:12px">
          <h4>Recent Records</h4>
          <div class="records-timeline">
            ${SAMPLE_RECORDS.slice(0,3).map(r=>`
              <div class="record-item">
                <div>
                  <strong>${r.title}</strong>
                  <div><small>${r.date} • ${r.source}</small></div>
                </div>
                <div><button class="btn" onclick="openRecord('${r.id}')">Open</button></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  wrapper.appendChild(healthCard);

  if(role === 'patient'){
    const meds = document.createElement('section');
    meds.className = 'card grid cols-3';
    meds.innerHTML = `
      <div>
        <h4>Medications</h4>
        <ul>${SAMPLE_PATIENT.medications.map(m=>`<li>${m}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>Appointments</h4>
        <ul>${SAMPLE_APPOINTMENTS.map(a=>`<li>${a.date} — ${a.with}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>AI Tools</h4>
        <ul><li><a href="#" onclick="navigateTo('drug-checker')">Drug Interaction Checker</a></li><li><a href="#" onclick="navigateTo('derm')">Dermatology Consult</a></li></ul>
      </div>
    `;
    wrapper.appendChild(meds);
  } else if(role === 'clinician'){
    const clinic = document.createElement('section');
    clinic.className = 'card';
    clinic.innerHTML = `
      <h3>Today's Patients</h3>
      <ul>
        ${SAMPLE_RECORDS.slice(0,5).map(r=>`<li><strong>${r.title}</strong> — ${r.date} <button class="btn" style="margin-left:8px" onclick="openRecord('${r.id}')">Open</button></li>`).join('')}
      </ul>
    `;
    wrapper.appendChild(clinic);
  } else {
    const admin = document.createElement('section');
    admin.className = 'card';
    admin.innerHTML = `<h3>Admin Dashboard</h3><p>Nodes: 3 • Health IDs issued: 12,104</p>`;
    wrapper.appendChild(admin);
  }

  root.appendChild(wrapper);
}

function renderHealthID(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <h2>My Health ID</h2>
    <p><strong>ID:</strong> <span class="badge">${SAMPLE_PATIENT.healthId}</span></p>
    <p><strong>Name:</strong> ${SAMPLE_PATIENT.name}</p>
    <p><strong>Issued:</strong> ${SAMPLE_PATIENT.issued}</p>
    <hr/>
    <h4>Share Access</h4>
    <p>Generate a one-time consent token or QR to share selected records with clinicians or facilities.</p>
    <div style="margin-top:8px"><button class="btn primary" onclick="alert('Generate token (mock)')">Generate Consent Token</button> <button class="btn" onclick="alert('Revoke sessions (mock)')">Revoke Access</button></div>
  `;
  root.appendChild(el);
}

function renderRecords(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Records</h2>
    <div class="search"><input id="record-search" type="search" placeholder="Search records by keyword"/><button class="btn" onclick="searchRecords()">Search</button></div>
    <div id="records-list" style="margin-top:12px"></div>`;
  root.appendChild(el);
  populateRecordsList();
}

function populateRecordsList(query){
  const list = document.getElementById('records-list');
  const items = SAMPLE_RECORDS.filter(r=>!query || r.title.toLowerCase().includes(query.toLowerCase()));
  list.innerHTML = items.map(r=>`
    <div class="record-item card">
      <div>
        <strong>${r.title}</strong>
        <div><small>${r.date} • ${r.source}</small></div>
        <div style="margin-top:6px;color:var(--muted)">${r.summary}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn" onclick="openRecord('${r.id}')">Open</button>
        <button class="btn" onclick="downloadRecord('${r.id}')">Download</button>
      </div>
    </div>
  `).join('');
}
function searchRecords(){
  const q = document.getElementById('record-search').value;
  populateRecordsList(q);
}

function openRecord(id){
  const r = SAMPLE_RECORDS.find(x=>x.id===id);
  if(!r) return alert('Not found');
  main.innerHTML = '';
  const scr = document.createElement('div');
  scr.className = 'card';
  scr.innerHTML = `
    <button class="btn" onclick="navigateTo('records')">← Back</button>
    <h2>${r.title}</h2>
    <small style="color:var(--muted)">${r.date} • ${r.source}</small>
    <hr/>
    <p>${r.summary}</p>
    <h4>Structured Data</h4>
    <pre style="background:#f4f7ff;padding:10px;border-radius:8px">${JSON.stringify(r.fhir, null, 2)}</pre>
    <div style="margin-top:12px"><button class="btn primary" onclick="alert('Start referral (mock)')">Refer / Transfer</button> <button class="btn" onclick="alert('Add note (mock)')">Add Note</button></div>
  `;
  main.appendChild(scr);
}

function renderAppointments(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Appointments</h2>
    <div class="card">
      <h4>Book Appointment</h4>
      <label>Specialty<select id="spec"><option>General</option><option>Dermatology</option></select></label>
      <label>Date<input id="app-date" type="date"/></label>
      <div style="margin-top:8px"><button class="btn primary" onclick="bookAppointment()">Book</button></div>
    </div>
    <div style="margin-top:12px">
      <h4>Upcoming</h4>
      <ul>${SAMPLE_APPOINTMENTS.map(a=>`<li>${a.date} — ${a.with}</li>`).join('')}</ul>
    </div>`;
  root.appendChild(el);
}
function bookAppointment(){
  const d = document.getElementById('app-date').value;
  if(!d) return alert('Pick a date');
  alert('Appointment booked for ' + d);
}

function renderTelemed(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Telemedicine</h2>
  <p>Secure chat & video (mock)</p>
  <div style="display:flex;gap:12px">
    <div style="flex:1">
      <div class="card"><h4>Messages</h4><div id="messages">No active conversations</div></div>
    </div>
    <div style="width:320px">
      <div class="card"><h4>Patient Summary</h4><p>${SAMPLE_PATIENT.name}</p></div>
    </div>
  </div>`;
  root.appendChild(el);
}

function renderDerm(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Dermatology Consult</h2>
    <p>Upload an image for asynchronous triage, or start live consult.</p>
    <input id="derm-file" type="file" accept="image/*" />
    <div style="margin-top:8px"><button class="btn primary" onclick="uploadDerm()">Upload & Run AI</button></div>
    <div id="derm-result" style="margin-top:12px"></div>`;
  root.appendChild(el);
}
function uploadDerm(){
  const f = document.getElementById('derm-file').files[0];
  if(!f) return alert('Choose an image');
  document.getElementById('derm-result').innerHTML = `<div class="card"><strong>AI Triage:</strong> Non-urgent • Confidence: 0.82<br/><small style="color:var(--muted)">Suggestion: follow-up with GP</small></div>`;
}

function renderDrugChecker(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Drug Interaction Checker</h2>
    <p>Enter medications to check interactions.</p>
    <input id="med-input" placeholder="e.g., ibuprofen, metformin"/>
    <div style="margin-top:8px"><button class="btn primary" onclick="runDrugCheck()">Check</button></div>
    <div id="drug-result" style="margin-top:12px"></div>`;
  root.appendChild(el);
}
function runDrugCheck(){
  const meds = document.getElementById('med-input').value;
  if(!meds) return alert('Enter medication names');
  const text = meds.toLowerCase();
  const out = [];
  if(text.includes('warfarin') && text.includes('ibuprofen')) out.push({severity:'high',msg:'NSAIDs increase bleeding risk with warfarin'});
  if(out.length===0) document.getElementById('drug-result').innerHTML = `<div class="card">No major interactions found (mock).</div>`;
  else document.getElementById('drug-result').innerHTML = out.map(o=>`<div class="card"><strong>${o.severity.toUpperCase()}</strong> — ${o.msg}</div>`).join('');
}

function renderHIE(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Hospital-to-Hospital Transfer</h2>
    <p>Create a signed FHIR bundle and send to another node (mock).</p>
    <div style="margin-top:8px"><button class="btn primary" onclick="alert('Create & send bundle (mock)')">Send Transfer</button></div>`;
  root.appendChild(el);
}

function renderAdmin(root){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h2>Admin Console</h2><p>Manage nodes, keys, policies (mock)</p>`;
  root.appendChild(el);
}

function renderNotFound(root){
  root.innerHTML = `<div class="card"><h2>Not found</h2></div>`;
}

function downloadRecord(id){
  const r = SAMPLE_RECORDS.find(x=>x.id===id);
  const blob = new Blob([JSON.stringify(r, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${id}.json`; a.click();
  URL.revokeObjectURL(url);
}

function showEmergencyModal(){
  const reason = prompt('Emergency access reason (logged):');
  if(!reason) return;
  alert('Emergency access granted (mock). Logged: ' + reason);
}

window.navigateTo = navigateTo;
window.openRecord = openRecord;
window.bookAppointment = bookAppointment;
window.searchRecords = searchRecords;
window.uploadDerm = uploadDerm;
window.runDrugCheck = runDrugCheck;

init();
