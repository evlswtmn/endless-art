// CareTracker - Main Application
// Single Page App: Dashboard, Mileage, Expenses, Calendar, Settings

import { Store } from './store.js';
import { Tax } from './tax.js';

// ─── Initialize ───
Store.init();
let currentView = 'dashboard';
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();

// Update header deduction badge whenever data changes
Store.onChange(() => updateDeductionBadge());

// ─── Icons (inline SVG paths) ───
const Icons = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
  car: '<svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
  receipt: '<svg viewBox="0 0 24 24"><path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
};

// ─── Navigation ───
function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.view);
    });
  });
}

function navigateTo(view) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  renderView();
}

// ─── Main Render ───
function renderView() {
  const main = document.getElementById('mainContent');

  // Check if setup is needed
  if (!Store.data.settings.setupComplete) {
    renderSetup(main);
    return;
  }

  switch (currentView) {
    case 'dashboard': renderDashboard(main); break;
    case 'mileage': renderMileage(main); break;
    case 'expenses': renderExpenses(main); break;
    case 'calendar': renderCalendar(main); break;
    case 'settings': renderSettings(main); break;
  }
  updateDeductionBadge();
}

function updateDeductionBadge() {
  const el = document.getElementById('totalDeduction');
  if (!el) return;
  const calcs = Tax.calculateDeductions(
    Store.data.mileageLog,
    Store.data.expenses,
    Store.data.settings
  );
  el.textContent = Tax.formatCurrency(calcs.totalEstimatedSavings);
}

// ─── Setup Wizard ───
let setupStep = 0;

function renderSetup(container) {
  const steps = [
    // Step 0: Welcome
    () => `
      <div class="setup-step">
        ${renderSetupDots(0, 4)}
        <h2>Welcome to CareTracker</h2>
        <p>Track medical mileage and expenses for the people you care for. Get every deduction you're entitled to.</p>
        <div class="card disclaimer">
          <strong>Important:</strong> CareTracker helps you organize records for tax purposes.
          This is an estimation tool — not tax advice. Always consult a qualified tax professional
          for your specific situation. All data stays on your device.
        </div>
        <div class="mt-16">
          <button class="btn btn-primary btn-block" onclick="window._nextSetup()">Get Started</button>
        </div>
      </div>`,

    // Step 1: Your info
    () => `
      <div class="setup-step">
        ${renderSetupDots(1, 4)}
        <h2>About You</h2>
        <p>We need some basics to calculate your deductions.</p>
        <div style="text-align:left">
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input class="form-input" id="setupName" type="text"
              value="${Store.data.settings.userName}" placeholder="Your name">
          </div>
          <div class="form-group">
            <label class="form-label">State</label>
            <select class="form-select" id="setupState">
              <option value="">Select your state</option>
              ${Tax.getStates()
                .map((s) => `<option value="${s.code}" ${Store.data.settings.location.state === s.code ? 'selected' : ''}>${s.name}</option>`)
                .join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Estimated Annual Gross Income (AGI)</label>
            <div class="form-hint">Used to calculate the 7.5% threshold for medical deductions. We never share this.</div>
            <input class="form-input" id="setupAGI" type="number" inputmode="numeric"
              value="${Store.data.settings.agi || ''}" placeholder="e.g. 55000">
          </div>
          <div class="form-group">
            <label class="form-label">Tax Year</label>
            <select class="form-select" id="setupYear">
              ${[2024, 2025, 2026].map((y) => `<option value="${y}" ${Store.data.settings.taxYear === y ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="mt-16 flex gap-8">
          <button class="btn btn-outline" style="flex:1" onclick="window._prevSetup()">Back</button>
          <button class="btn btn-primary" style="flex:2" onclick="window._saveSetupInfo()">Continue</button>
        </div>
      </div>`,

    // Step 2: Add dependents
    () => `
      <div class="setup-step">
        ${renderSetupDots(2, 4)}
        <h2>Who Do You Care For?</h2>
        <p>Add the people you transport to medical appointments or pay medical expenses for.</p>
        <div id="setupDependentsList" style="text-align:left">
          ${Store.data.dependents.map((d) => `
            <div class="card flex-between">
              <div>
                <div class="list-title">${escapeHtml(d.name)}</div>
                <div class="list-subtitle">${escapeHtml(d.relationship || '')}</div>
              </div>
              <button class="btn-icon" onclick="window._removeSetupDep('${d.id}')">
                ${Icons.trash}
              </button>
            </div>`).join('')}
        </div>
        <div class="card" style="text-align:left">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input class="form-input" id="setupDepName" type="text" placeholder="e.g. Jane">
          </div>
          <div class="form-group">
            <label class="form-label">Relationship</label>
            <input class="form-input" id="setupDepRel" type="text" placeholder="e.g. Wife, Mother-in-law">
          </div>
          <button class="btn btn-accent btn-sm btn-block" onclick="window._addSetupDep()">+ Add Person</button>
        </div>
        <div class="mt-16 flex gap-8">
          <button class="btn btn-outline" style="flex:1" onclick="window._prevSetup()">Back</button>
          <button class="btn btn-primary" style="flex:2" onclick="window._nextSetup()">
            ${Store.data.dependents.length > 0 ? 'Continue' : 'Skip for Now'}
          </button>
        </div>
      </div>`,

    // Step 3: Shift pattern
    () => `
      <div class="setup-step">
        ${renderSetupDots(3, 4)}
        <h2>Your Shift Schedule</h2>
        <p>Set up your rotating shift pattern so we can overlay it on the calendar. You can skip this and set it up later.</p>
        <div style="text-align:left">
          <div class="form-group">
            <label class="form-label">Pattern Start Date</label>
            <div class="form-hint">Pick a date when your pattern starts (or started most recently)</div>
            <input class="form-input" id="setupShiftStart" type="date"
              value="${Store.data.settings.shiftPattern.startDate}">
          </div>
          <div class="form-group">
            <label class="form-label">Build Your Pattern</label>
            <div class="form-hint">Tap to cycle: Day (D) → Night (N) → Off (O). Add as many days as your rotation needs.</div>
            <div class="shift-pattern-builder" id="setupShiftPattern">
              ${(Store.data.settings.shiftPattern.pattern.length > 0
                ? Store.data.settings.shiftPattern.pattern
                : ['D', 'D', 'N', 'N', 'O', 'O', 'O']
              ).map((s, i) => `<button class="shift-day-btn ${s}" data-idx="${i}" onclick="window._cycleShift(${i})">${s}</button>`).join('')}
            </div>
            <div class="mt-8 flex gap-8">
              <button class="btn btn-sm btn-outline" onclick="window._addShiftDay()">+ Add Day</button>
              <button class="btn btn-sm btn-outline" onclick="window._removeShiftDay()">- Remove Day</button>
            </div>
          </div>
        </div>
        <div class="mt-16 flex gap-8">
          <button class="btn btn-outline" style="flex:1" onclick="window._prevSetup()">Back</button>
          <button class="btn btn-primary" style="flex:2" onclick="window._finishSetup()">Finish Setup</button>
        </div>
      </div>`,
  ];

  container.innerHTML = steps[setupStep]();
}

function renderSetupDots(current, total) {
  return `<div class="setup-progress">${Array.from({ length: total }, (_, i) =>
    `<div class="setup-dot ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}"></div>`
  ).join('')}</div>`;
}

// Setup global handlers
let _shiftPattern = Store.data.settings.shiftPattern.pattern.length > 0
  ? [...Store.data.settings.shiftPattern.pattern]
  : ['D', 'D', 'N', 'N', 'O', 'O', 'O'];

window._nextSetup = () => { setupStep++; renderView(); };
window._prevSetup = () => { setupStep--; renderView(); };

window._saveSetupInfo = () => {
  Store.updateSettings({
    userName: document.getElementById('setupName').value.trim(),
    location: { country: 'US', state: document.getElementById('setupState').value },
    agi: parseFloat(document.getElementById('setupAGI').value) || 0,
    taxYear: parseInt(document.getElementById('setupYear').value),
  });
  setupStep++;
  renderView();
};

window._addSetupDep = () => {
  const name = document.getElementById('setupDepName').value.trim();
  const relationship = document.getElementById('setupDepRel').value.trim();
  if (!name) return;
  Store.addDependent({ name, relationship });
  renderView();
};

window._removeSetupDep = (id) => {
  Store.removeDependent(id);
  renderView();
};

window._cycleShift = (idx) => {
  const order = ['D', 'N', 'O'];
  const cur = order.indexOf(_shiftPattern[idx]);
  _shiftPattern[idx] = order[(cur + 1) % 3];
  const btn = document.querySelector(`.shift-day-btn[data-idx="${idx}"]`);
  if (btn) {
    btn.textContent = _shiftPattern[idx];
    btn.className = `shift-day-btn ${_shiftPattern[idx]}`;
  }
};

window._addShiftDay = () => {
  _shiftPattern.push('O');
  renderView();
};

window._removeShiftDay = () => {
  if (_shiftPattern.length > 1) {
    _shiftPattern.pop();
    renderView();
  }
};

window._finishSetup = () => {
  const startDate = document.getElementById('setupShiftStart')?.value || '';
  Store.updateSettings({
    shiftPattern: {
      type: 'rotating',
      shiftLength: 12,
      pattern: [..._shiftPattern],
      startDate: startDate,
    },
    setupComplete: true,
  });
  setupStep = 0;
  navigateTo('dashboard');
};

// ─── Dashboard View ───
function renderDashboard(container) {
  const calcs = Tax.calculateDeductions(
    Store.data.mileageLog,
    Store.data.expenses,
    Store.data.settings
  );

  const recentTrips = Store.data.mileageLog.slice(0, 3);
  const recentExpenses = Store.data.expenses.slice(0, 3);

  container.innerHTML = `
    <div class="savings-display">
      <div class="savings-label">Estimated Tax Savings (${calcs.year})</div>
      <div class="savings-amount">${Tax.formatCurrency(calcs.totalEstimatedSavings)}</div>
      <div class="savings-detail">
        Federal: ${Tax.formatCurrency(calcs.federalSavings)} (${(calcs.federalRate * 100).toFixed(0)}% bracket)
        ${calcs.stateSavings > 0 ? ` + State: ${Tax.formatCurrency(calcs.stateSavings)}` : ''}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${Tax.formatMiles(calcs.totalMiles)}</div>
        <div class="stat-label">Miles Logged</div>
      </div>
      <div class="stat-card">
        <div class="stat-value accent">${Tax.formatCurrency(calcs.mileageDeduction)}</div>
        <div class="stat-label">Mileage Value</div>
      </div>
      <div class="stat-card">
        <div class="stat-value warning">${Tax.formatCurrency(calcs.totalExpenses)}</div>
        <div class="stat-label">Expenses</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Tax.formatCurrency(calcs.totalMedical)}</div>
        <div class="stat-label">Total Medical</div>
      </div>
    </div>

    ${calcs.agi > 0 ? `
      <div class="card">
        <div class="card-title">Deduction Threshold</div>
        <div class="mt-8">
          <div class="flex-between mb-8">
            <span style="font-size:0.85rem">7.5% of AGI (${Tax.formatCurrency(calcs.agi)})</span>
            <span style="font-weight:600">${Tax.formatCurrency(calcs.agiThreshold)}</span>
          </div>
          <div style="background:var(--bg-input);border-radius:8px;height:12px;overflow:hidden">
            <div style="background:${calcs.totalMedical >= calcs.agiThreshold ? 'var(--accent)' : 'var(--primary-light)'};height:100%;width:${Math.min(100, (calcs.totalMedical / Math.max(calcs.agiThreshold, 1)) * 100).toFixed(1)}%;border-radius:8px;transition:width 0.3s"></div>
          </div>
          <div class="form-hint mt-8">
            ${calcs.totalMedical >= calcs.agiThreshold
              ? `You've exceeded the threshold! ${Tax.formatCurrency(calcs.deductibleAmount)} is deductible.`
              : `${Tax.formatCurrency(calcs.agiThreshold - calcs.totalMedical)} more to reach deductible threshold.`}
          </div>
        </div>
      </div>` : ''}

    <div class="flex gap-8 mb-16">
      <button class="btn btn-primary" style="flex:1" onclick="window._quickTrip()">
        + Log Trip
      </button>
      <button class="btn btn-accent" style="flex:1" onclick="window._quickExpense()">
        + Add Expense
      </button>
    </div>

    ${recentTrips.length > 0 ? `
      <div class="section-header">
        <span class="section-title">Recent Trips</span>
        <button class="btn btn-sm btn-outline" onclick="window._nav('mileage')">View All</button>
      </div>
      <div class="card">
        ${recentTrips.map((t) => renderMileageItem(t)).join('')}
      </div>` : ''}

    ${recentExpenses.length > 0 ? `
      <div class="section-header">
        <span class="section-title">Recent Expenses</span>
        <button class="btn btn-sm btn-outline" onclick="window._nav('expenses')">View All</button>
      </div>
      <div class="card">
        ${recentExpenses.map((e) => renderExpenseItem(e)).join('')}
      </div>` : ''}

    ${recentTrips.length === 0 && recentExpenses.length === 0 ? `
      <div class="empty-state">
        <p>Start logging your medical trips and expenses to see your deductions grow.</p>
      </div>` : ''}

    <div class="disclaimer">
      <strong>Disclaimer:</strong> Estimated savings based on ${calcs.year} tax rates.
      Medical mileage rate: ${Tax.formatCurrency(calcs.mileageRate)}/mile.
      Medical expenses deductible above 7.5% of AGI. Consult a tax professional for your specific situation.
    </div>
  `;
}

window._nav = (view) => navigateTo(view);
window._quickTrip = () => { navigateTo('mileage'); setTimeout(() => showMileageForm(), 100); };
window._quickExpense = () => { navigateTo('expenses'); setTimeout(() => showExpenseForm(), 100); };

// ─── Mileage View ───
function renderMileage(container) {
  const year = Store.data.settings.taxYear;
  const entries = Store.getMileageForYear(year);
  const totalMiles = entries.reduce((s, e) => s + (parseFloat(e.miles) || 0), 0);
  const rate = Tax.getMileageRate('US', year);

  container.innerHTML = `
    <div class="section-header">
      <span class="section-title">Medical Mileage (${year})</span>
    </div>
    <div class="stats-grid" style="grid-template-columns:1fr 1fr 1fr">
      <div class="stat-card">
        <div class="stat-value" style="font-size:1.2rem">${entries.length}</div>
        <div class="stat-label">Trips</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="font-size:1.2rem">${Tax.formatMiles(totalMiles)}</div>
        <div class="stat-label">Miles</div>
      </div>
      <div class="stat-card">
        <div class="stat-value accent" style="font-size:1.2rem">${Tax.formatCurrency(totalMiles * rate)}</div>
        <div class="stat-label">Deduction</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Trip Log</span>
        <span style="font-size:0.75rem;color:var(--text-secondary)">IRS-compliant records</span>
      </div>
      ${entries.length === 0 ? `
        <div class="empty-state">
          <p>No trips logged yet. Tap the + button to log your first medical trip.</p>
        </div>` : entries.map((t) => renderMileageItem(t, true)).join('')}
    </div>

    <button class="fab" onclick="window._showMileageForm()" aria-label="Log new trip">
      ${Icons.plus}
    </button>
  `;
}

function renderMileageItem(trip, showActions = false) {
  const deps = (trip.dependentIds || [])
    .map((id) => Store.data.dependents.find((d) => d.id === id))
    .filter(Boolean);
  const rate = Tax.getMileageRate('US', Store.data.settings.taxYear);

  return `
    <div class="list-item">
      <div class="list-icon mileage">&#x1F697;</div>
      <div class="list-body">
        <div class="list-title">${escapeHtml(trip.destination || 'Medical trip')}</div>
        <div class="list-subtitle">${escapeHtml(trip.purpose || '')}</div>
        ${deps.length > 0 ? `<div class="dependent-badges">${deps.map((d) => `<span class="dep-badge">${escapeHtml(d.name)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="list-meta">
        <div class="list-amount">${Tax.formatMiles(trip.miles)} mi</div>
        <div class="list-date">${formatDate(trip.date)}</div>
        <div style="font-size:0.7rem;color:var(--accent)">${Tax.formatCurrency(trip.miles * rate)}</div>
        ${showActions ? `
          <div class="list-actions mt-8">
            <button class="btn-icon" onclick="window._editTrip('${trip.id}')" aria-label="Edit">${Icons.edit}</button>
            <button class="btn-icon" onclick="window._deleteTrip('${trip.id}')" aria-label="Delete">${Icons.trash}</button>
          </div>` : ''}
      </div>
    </div>`;
}

function showMileageForm(existing = null) {
  const isEdit = !!existing;
  const today = new Date().toISOString().split('T')[0];

  showModal(isEdit ? 'Edit Trip' : 'Log Medical Trip', `
    <div class="form-group">
      <label class="form-label">Date *</label>
      <input class="form-input" id="tripDate" type="date" value="${existing?.date || today}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Starting Location</label>
      <input class="form-input" id="tripStart" type="text" value="${escapeAttr(existing?.startLocation || '')}" placeholder="e.g. Home, 123 Main St">
    </div>
    <div class="form-group">
      <label class="form-label">Destination *</label>
      <input class="form-input" id="tripDest" type="text" value="${escapeAttr(existing?.destination || '')}" placeholder="e.g. Dr. Smith's Office">
    </div>
    <div class="form-group">
      <label class="form-label">Medical Purpose *</label>
      <div class="form-hint">IRS requires a description of the medical reason for travel</div>
      <input class="form-input" id="tripPurpose" type="text" value="${escapeAttr(existing?.purpose || '')}" placeholder="e.g. Cardiology appointment, Physical therapy">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Miles (one way) *</label>
        <input class="form-input" id="tripMiles" type="number" inputmode="decimal" step="0.1" min="0"
          value="${existing?.miles || ''}" placeholder="0.0">
      </div>
      <div class="form-group">
        <label class="form-label">Round Trip?</label>
        <label class="form-checkbox" style="height:46px">
          <input type="checkbox" id="tripRoundTrip" ${existing?.roundTrip !== false ? 'checked' : ''}>
          <span>Yes, double miles</span>
        </label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Odometer Start</label>
        <input class="form-input" id="tripOdoStart" type="number" inputmode="numeric"
          value="${existing?.odometerStart || ''}" placeholder="Optional">
      </div>
      <div class="form-group">
        <label class="form-label">Odometer End</label>
        <input class="form-input" id="tripOdoEnd" type="number" inputmode="numeric"
          value="${existing?.odometerEnd || ''}" placeholder="Optional">
      </div>
    </div>
    ${Store.data.dependents.length > 0 ? `
      <div class="form-group">
        <label class="form-label">Who was transported?</label>
        <div class="chip-group">
          ${Store.data.dependents.map((d) => `
            <label class="chip ${(existing?.dependentIds || []).includes(d.id) ? 'active' : ''}" data-dep-id="${d.id}" onclick="this.classList.toggle('active')">
              ${escapeHtml(d.name)}
            </label>`).join('')}
        </div>
      </div>` : ''}
    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea class="form-textarea" id="tripNotes" rows="2" placeholder="Any additional details">${existing?.notes || ''}</textarea>
    </div>
  `, () => {
    const milesInput = parseFloat(document.getElementById('tripMiles').value) || 0;
    const roundTrip = document.getElementById('tripRoundTrip').checked;
    const miles = roundTrip ? milesInput * 2 : milesInput;
    const dependentIds = Array.from(document.querySelectorAll('.chip.active'))
      .map((c) => c.dataset.depId)
      .filter(Boolean);

    const data = {
      date: document.getElementById('tripDate').value,
      startLocation: document.getElementById('tripStart').value.trim(),
      destination: document.getElementById('tripDest').value.trim(),
      purpose: document.getElementById('tripPurpose').value.trim(),
      miles: miles,
      roundTrip: roundTrip,
      odometerStart: document.getElementById('tripOdoStart').value || null,
      odometerEnd: document.getElementById('tripOdoEnd').value || null,
      dependentIds: dependentIds,
      notes: document.getElementById('tripNotes').value.trim(),
    };

    if (!data.date || !data.destination || !data.purpose || !miles) {
      alert('Please fill in date, destination, purpose, and miles.');
      return false;
    }

    if (isEdit) {
      Store.updateMileageEntry(existing.id, data);
    } else {
      Store.addMileageEntry(data);
    }
    return true;
  });
}

window._showMileageForm = () => showMileageForm();
window._editTrip = (id) => {
  const trip = Store.data.mileageLog.find((t) => t.id === id);
  if (trip) showMileageForm(trip);
};
window._deleteTrip = (id) => {
  if (confirm('Delete this trip record?')) {
    Store.removeMileageEntry(id);
    renderView();
  }
};

// ─── Expenses View ───
function renderExpenses(container) {
  const year = Store.data.settings.taxYear;
  const entries = Store.getExpensesForYear(year);
  const total = entries.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  const categories = {};
  entries.forEach((e) => {
    const cat = e.category || 'other';
    categories[cat] = (categories[cat] || 0) + (parseFloat(e.amount) || 0);
  });

  container.innerHTML = `
    <div class="section-header">
      <span class="section-title">Medical Expenses (${year})</span>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value warning" style="font-size:1.2rem">${Tax.formatCurrency(total)}</div>
        <div class="stat-label">Total Expenses</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="font-size:1.2rem">${entries.length}</div>
        <div class="stat-label">Entries</div>
      </div>
    </div>

    ${Object.keys(categories).length > 0 ? `
      <div class="card">
        <div class="card-title">By Category</div>
        ${Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => `
          <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)">
            <span class="category-badge ${cat}">${cat}</span>
            <span style="font-weight:600">${Tax.formatCurrency(amt)}</span>
          </div>`).join('')}
      </div>` : ''}

    <div class="card">
      <div class="card-header">
        <span class="card-title">Expense Log</span>
      </div>
      ${entries.length === 0 ? `
        <div class="empty-state">
          <p>No expenses logged yet. Tap the + button to add a medical expense.</p>
        </div>` : entries.map((e) => renderExpenseItem(e, true)).join('')}
    </div>

    <button class="fab" onclick="window._showExpenseForm()" aria-label="Add expense">
      ${Icons.plus}
    </button>
  `;
}

function renderExpenseItem(expense, showActions = false) {
  const deps = (expense.dependentIds || [])
    .map((id) => Store.data.dependents.find((d) => d.id === id))
    .filter(Boolean);

  return `
    <div class="list-item">
      <div class="list-icon expense">&#x1F4B0;</div>
      <div class="list-body">
        <div class="list-title">${escapeHtml(expense.description || expense.category)}</div>
        <div class="list-subtitle">
          <span class="category-badge ${expense.category || 'other'}">${expense.category || 'other'}</span>
          ${expense.provider ? ` &middot; ${escapeHtml(expense.provider)}` : ''}
        </div>
        ${deps.length > 0 ? `<div class="dependent-badges">${deps.map((d) => `<span class="dep-badge">${escapeHtml(d.name)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="list-meta">
        <div class="list-amount" style="color:var(--warning)">${Tax.formatCurrency(expense.amount)}</div>
        <div class="list-date">${formatDate(expense.date)}</div>
        ${showActions ? `
          <div class="list-actions mt-8">
            <button class="btn-icon" onclick="window._editExpense('${expense.id}')" aria-label="Edit">${Icons.edit}</button>
            <button class="btn-icon" onclick="window._deleteExpense('${expense.id}')" aria-label="Delete">${Icons.trash}</button>
          </div>` : ''}
      </div>
    </div>`;
}

function showExpenseForm(existing = null) {
  const isEdit = !!existing;
  const today = new Date().toISOString().split('T')[0];
  const categories = ['copay', 'prescription', 'equipment', 'insurance', 'therapy', 'other'];

  showModal(isEdit ? 'Edit Expense' : 'Add Medical Expense', `
    <div class="form-group">
      <label class="form-label">Date *</label>
      <input class="form-input" id="expDate" type="date" value="${existing?.date || today}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Category *</label>
      <select class="form-select" id="expCategory">
        ${categories.map((c) => `<option value="${c}" ${existing?.category === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Description *</label>
      <input class="form-input" id="expDesc" type="text" value="${escapeAttr(existing?.description || '')}" placeholder="e.g. Office visit copay, Monthly prescription">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount *</label>
        <input class="form-input" id="expAmount" type="number" inputmode="decimal" step="0.01" min="0"
          value="${existing?.amount || ''}" placeholder="0.00">
      </div>
      <div class="form-group">
        <label class="form-label">Provider</label>
        <input class="form-input" id="expProvider" type="text" value="${escapeAttr(existing?.provider || '')}" placeholder="e.g. CVS, Dr. Jones">
      </div>
    </div>
    ${Store.data.dependents.length > 0 ? `
      <div class="form-group">
        <label class="form-label">For whom?</label>
        <div class="chip-group">
          ${Store.data.dependents.map((d) => `
            <label class="chip ${(existing?.dependentIds || []).includes(d.id) ? 'active' : ''}" data-dep-id="${d.id}" onclick="this.classList.toggle('active')">
              ${escapeHtml(d.name)}
            </label>`).join('')}
        </div>
      </div>` : ''}
    <div class="form-group">
      <label class="form-label">Receipt Reference</label>
      <input class="form-input" id="expReceipt" type="text" value="${escapeAttr(existing?.receiptRef || '')}" placeholder="Optional - receipt # or reference">
    </div>
    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea class="form-textarea" id="expNotes" rows="2" placeholder="Any additional details">${existing?.notes || ''}</textarea>
    </div>
  `, () => {
    const dependentIds = Array.from(document.querySelectorAll('.chip.active'))
      .map((c) => c.dataset.depId)
      .filter(Boolean);

    const data = {
      date: document.getElementById('expDate').value,
      category: document.getElementById('expCategory').value,
      description: document.getElementById('expDesc').value.trim(),
      amount: parseFloat(document.getElementById('expAmount').value) || 0,
      provider: document.getElementById('expProvider').value.trim(),
      dependentIds: dependentIds,
      receiptRef: document.getElementById('expReceipt').value.trim(),
      notes: document.getElementById('expNotes').value.trim(),
    };

    if (!data.date || !data.description || !data.amount) {
      alert('Please fill in date, description, and amount.');
      return false;
    }

    if (isEdit) {
      Store.updateExpense(existing.id, data);
    } else {
      Store.addExpense(data);
    }
    return true;
  });
}

window._showExpenseForm = () => showExpenseForm();
window._editExpense = (id) => {
  const exp = Store.data.expenses.find((e) => e.id === id);
  if (exp) showExpenseForm(exp);
};
window._deleteExpense = (id) => {
  if (confirm('Delete this expense record?')) {
    Store.removeExpense(id);
    renderView();
  }
};

// ─── Calendar View ───
function renderCalendar(container) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  let calGrid = '';
  // Day headers
  dayNames.forEach((d) => {
    calGrid += `<div class="cal-header">${d}</div>`;
  });

  // Empty cells before month starts
  for (let i = 0; i < startDow; i++) {
    calGrid += '<div class="cal-day empty"></div>';
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const shift = Store.getShiftForDate(dateStr);
    const apts = Store.getAppointmentsForDate(dateStr);
    const trips = Store.getMileageForDate(dateStr);
    const exps = Store.getExpensesForDate(dateStr);
    const isToday = dateStr === todayStr;

    const shiftClass = shift ? `shift-${shift}` : '';
    const todayClass = isToday ? 'today' : '';

    let dots = '';
    if (apts.length || trips.length || exps.length) {
      dots = '<div class="dots">';
      if (apts.length) dots += '<span class="dot apt"></span>';
      if (trips.length) dots += '<span class="dot trip"></span>';
      if (exps.length) dots += '<span class="dot exp"></span>';
      dots += '</div>';
    }

    calGrid += `<div class="cal-day ${shiftClass} ${todayClass}" data-date="${dateStr}" onclick="window._showDayDetail('${dateStr}')">
      <span class="day-num">${day}</span>
      ${dots}
    </div>`;
  }

  container.innerHTML = `
    <div class="calendar-controls">
      <button class="btn btn-sm btn-outline" onclick="window._calPrev()">${Icons.chevronLeft}</button>
      <span class="calendar-month">${monthNames[calendarMonth]} ${calendarYear}</span>
      <button class="btn btn-sm btn-outline" onclick="window._calNext()">${Icons.chevronRight}</button>
    </div>

    <div class="card">
      <div class="calendar-grid">
        ${calGrid}
      </div>
      <div class="calendar-legend">
        <div class="legend-item"><div class="legend-color" style="background:var(--shift-day)"></div> Day Shift</div>
        <div class="legend-item"><div class="legend-color" style="background:var(--shift-night)"></div> Night Shift</div>
        <div class="legend-item"><div class="legend-color" style="background:var(--shift-off)"></div> Off</div>
        <div class="legend-item"><div class="legend-color" style="background:var(--accent)"></div> Appointment</div>
        <div class="legend-item"><div class="legend-color" style="background:var(--primary)"></div> Trip</div>
      </div>
    </div>

    <div class="mt-16">
      <div class="section-header">
        <span class="section-title">Upcoming Appointments</span>
        <button class="btn btn-sm btn-accent" onclick="window._showAptForm()">+ Add</button>
      </div>
      ${renderUpcomingAppointments()}
    </div>

    <button class="fab" onclick="window._showAptForm()" aria-label="Add appointment">
      ${Icons.plus}
    </button>
  `;
}

function renderUpcomingAppointments() {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = Store.data.appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  if (upcoming.length === 0) {
    return '<div class="card"><div class="empty-state"><p>No upcoming appointments.</p></div></div>';
  }

  return `<div class="card">${upcoming.map((apt) => {
    const deps = (apt.dependentIds || [])
      .map((id) => Store.data.dependents.find((d) => d.id === id))
      .filter(Boolean);
    const shift = Store.getShiftForDate(apt.date);
    const shiftLabel = shift === 'D' ? ' (Day Shift)' : shift === 'N' ? ' (Night Shift)' : shift === 'O' ? ' (Off)' : '';

    return `
      <div class="list-item">
        <div class="list-icon appointment">&#x1F4C5;</div>
        <div class="list-body">
          <div class="list-title">${escapeHtml(apt.purpose || 'Appointment')}</div>
          <div class="list-subtitle">${escapeHtml(apt.provider || '')} ${apt.time ? '@ ' + apt.time : ''}</div>
          ${deps.length > 0 ? `<div class="dependent-badges">${deps.map((d) => `<span class="dep-badge">${escapeHtml(d.name)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="list-meta">
          <div class="list-date">${formatDate(apt.date)}${shiftLabel}</div>
          ${shift === 'D' || shift === 'N' ? '<div style="color:var(--danger);font-size:0.7rem;font-weight:600">CONFLICT</div>' : ''}
          <div class="list-actions mt-8">
            <button class="btn-icon" onclick="window._editApt('${apt.id}')" aria-label="Edit">${Icons.edit}</button>
            <button class="btn-icon" onclick="window._deleteApt('${apt.id}')" aria-label="Delete">${Icons.trash}</button>
          </div>
        </div>
      </div>`;
  }).join('')}</div>`;
}

window._calPrev = () => {
  calendarMonth--;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  renderView();
};

window._calNext = () => {
  calendarMonth++;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  renderView();
};

window._showDayDetail = (dateStr) => {
  const apts = Store.getAppointmentsForDate(dateStr);
  const trips = Store.getMileageForDate(dateStr);
  const exps = Store.getExpensesForDate(dateStr);
  const shift = Store.getShiftForDate(dateStr);
  const shiftLabel = shift === 'D' ? 'Day Shift' : shift === 'N' ? 'Night Shift' : shift === 'O' ? 'Off Day' : 'No shift data';

  let content = `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:0.85rem;color:var(--text-secondary)">${shiftLabel}</div>
    </div>
  `;

  if (apts.length > 0) {
    content += `<div class="card-title mb-8">Appointments</div>`;
    content += apts.map((a) => `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <strong>${escapeHtml(a.purpose || 'Appointment')}</strong>
      <div style="font-size:0.85rem;color:var(--text-secondary)">${a.time || ''} ${a.provider ? '- ' + escapeHtml(a.provider) : ''}</div>
    </div>`).join('');
  }

  if (trips.length > 0) {
    content += `<div class="card-title mb-8 mt-16">Trips</div>`;
    content += trips.map((t) => `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <strong>${escapeHtml(t.destination)}</strong> - ${Tax.formatMiles(t.miles)} mi
      <div style="font-size:0.85rem;color:var(--text-secondary)">${escapeHtml(t.purpose || '')}</div>
    </div>`).join('');
  }

  if (exps.length > 0) {
    content += `<div class="card-title mb-8 mt-16">Expenses</div>`;
    content += exps.map((e) => `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <strong>${escapeHtml(e.description)}</strong> - ${Tax.formatCurrency(e.amount)}
    </div>`).join('');
  }

  if (!apts.length && !trips.length && !exps.length) {
    content += '<p style="text-align:center;color:var(--text-secondary)">Nothing logged for this day.</p>';
  }

  content += `
    <div class="mt-16 flex gap-8">
      <button class="btn btn-primary btn-sm" style="flex:1" onclick="window._closeModal();window._quickTripForDate('${dateStr}')">+ Log Trip</button>
      <button class="btn btn-accent btn-sm" style="flex:1" onclick="window._closeModal();window._quickExpForDate('${dateStr}')">+ Expense</button>
      <button class="btn btn-outline btn-sm" style="flex:1" onclick="window._closeModal();window._showAptFormForDate('${dateStr}')">+ Appt</button>
    </div>
  `;

  showModal(formatDate(dateStr), content, null);
};

window._quickTripForDate = (dateStr) => {
  setTimeout(() => showMileageForm({ date: dateStr, dependentIds: [] }), 100);
};

window._quickExpForDate = (dateStr) => {
  setTimeout(() => showExpenseForm({ date: dateStr, dependentIds: [] }), 100);
};

// ─── Appointments ───
function showAptForm(existing = null, defaultDate = null) {
  const isEdit = !!existing;
  const today = defaultDate || new Date().toISOString().split('T')[0];

  showModal(isEdit ? 'Edit Appointment' : 'Add Appointment', `
    <div class="form-group">
      <label class="form-label">Date *</label>
      <input class="form-input" id="aptDate" type="date" value="${existing?.date || today}">
    </div>
    <div class="form-group">
      <label class="form-label">Time</label>
      <input class="form-input" id="aptTime" type="time" value="${existing?.time || ''}">
    </div>
    <div class="form-group">
      <label class="form-label">Purpose *</label>
      <input class="form-input" id="aptPurpose" type="text" value="${escapeAttr(existing?.purpose || '')}" placeholder="e.g. Cardiology follow-up">
    </div>
    <div class="form-group">
      <label class="form-label">Provider / Doctor</label>
      <input class="form-input" id="aptProvider" type="text" value="${escapeAttr(existing?.provider || '')}" placeholder="e.g. Dr. Smith">
    </div>
    <div class="form-group">
      <label class="form-label">Location</label>
      <input class="form-input" id="aptLocation" type="text" value="${escapeAttr(existing?.location || '')}" placeholder="e.g. City Medical Center">
    </div>
    ${Store.data.dependents.length > 0 ? `
      <div class="form-group">
        <label class="form-label">For whom?</label>
        <div class="chip-group">
          ${Store.data.dependents.map((d) => `
            <label class="chip ${(existing?.dependentIds || []).includes(d.id) ? 'active' : ''}" data-dep-id="${d.id}" onclick="this.classList.toggle('active')">
              ${escapeHtml(d.name)}
            </label>`).join('')}
        </div>
      </div>` : ''}
    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea class="form-textarea" id="aptNotes" rows="2">${existing?.notes || ''}</textarea>
    </div>
  `, () => {
    const dependentIds = Array.from(document.querySelectorAll('.chip.active'))
      .map((c) => c.dataset.depId)
      .filter(Boolean);

    const data = {
      date: document.getElementById('aptDate').value,
      time: document.getElementById('aptTime').value,
      purpose: document.getElementById('aptPurpose').value.trim(),
      provider: document.getElementById('aptProvider').value.trim(),
      location: document.getElementById('aptLocation').value.trim(),
      dependentIds: dependentIds,
      notes: document.getElementById('aptNotes').value.trim(),
    };

    if (!data.date || !data.purpose) {
      alert('Please fill in date and purpose.');
      return false;
    }

    if (isEdit) {
      Store.updateAppointment(existing.id, data);
    } else {
      Store.addAppointment(data);
    }
    return true;
  });
}

window._showAptForm = () => showAptForm();
window._showAptFormForDate = (dateStr) => setTimeout(() => showAptForm(null, dateStr), 100);
window._editApt = (id) => {
  const apt = Store.data.appointments.find((a) => a.id === id);
  if (apt) showAptForm(apt);
};
window._deleteApt = (id) => {
  if (confirm('Delete this appointment?')) {
    Store.removeAppointment(id);
    renderView();
  }
};

// ─── Settings View ───
function renderSettings(container) {
  const s = Store.data.settings;
  const rate = Tax.getMileageRate(s.location?.country || 'US', s.taxYear);

  container.innerHTML = `
    <div class="section-header">
      <span class="section-title">Settings</span>
    </div>

    <div class="card">
      <div class="card-title">Personal Information</div>
      <div class="form-group mt-8">
        <label class="form-label">Name</label>
        <input class="form-input" id="setName" type="text" value="${escapeAttr(s.userName)}" onchange="window._saveSetting('userName', this.value)">
      </div>
      <div class="form-group">
        <label class="form-label">State</label>
        <select class="form-select" id="setState" onchange="window._saveLocation(this.value)">
          <option value="">Select state</option>
          ${Tax.getStates().map((st) => `<option value="${st.code}" ${s.location?.state === st.code ? 'selected' : ''}>${st.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Estimated AGI (Annual Gross Income)</label>
        <input class="form-input" id="setAGI" type="number" inputmode="numeric" value="${s.agi || ''}" placeholder="e.g. 55000"
          onchange="window._saveSetting('agi', parseFloat(this.value) || 0)">
        <div class="form-hint">Medical expenses above 7.5% of AGI (${Tax.formatCurrency((s.agi || 0) * 0.075)}) are deductible.</div>
      </div>
      <div class="form-group">
        <label class="form-label">Tax Year</label>
        <select class="form-select" id="setYear" onchange="window._saveSetting('taxYear', parseInt(this.value))">
          ${[2024, 2025, 2026].map((y) => `<option value="${y}" ${s.taxYear === y ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
      <div class="form-hint">IRS Medical Mileage Rate (${s.taxYear}): ${Tax.formatCurrency(rate)}/mile</div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Care Recipients</span>
        <button class="btn btn-sm btn-accent" onclick="window._showDepForm()">+ Add</button>
      </div>
      ${Store.data.dependents.length === 0 ? '<p class="form-hint">No care recipients added yet.</p>' : ''}
      ${Store.data.dependents.map((d) => `
        <div class="list-item">
          <div class="list-body">
            <div class="list-title">${escapeHtml(d.name)}</div>
            <div class="list-subtitle">${escapeHtml(d.relationship || '')}</div>
          </div>
          <div class="list-actions">
            <button class="btn-icon" onclick="window._editDep('${d.id}')">${Icons.edit}</button>
            <button class="btn-icon" onclick="window._deleteDep('${d.id}')">${Icons.trash}</button>
          </div>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-title">Shift Pattern</div>
      <div class="form-group mt-8">
        <label class="form-label">Pattern Start Date</label>
        <input class="form-input" id="setShiftStart" type="date" value="${s.shiftPattern.startDate}"
          onchange="window._saveShiftStart(this.value)">
      </div>
      <div class="form-group">
        <label class="form-label">Rotation Pattern</label>
        <div class="form-hint">Tap to cycle: D (Day) → N (Night) → O (Off)</div>
        <div class="shift-pattern-builder" id="settingsShiftPattern">
          ${(s.shiftPattern.pattern.length > 0 ? s.shiftPattern.pattern : []).map((sh, i) =>
            `<button class="shift-day-btn ${sh}" data-idx="${i}" onclick="window._cycleSettingsShift(${i})">${sh}</button>`
          ).join('')}
        </div>
        <div class="mt-8 flex gap-8">
          <button class="btn btn-sm btn-outline" onclick="window._addSettingsShiftDay()">+ Add Day</button>
          <button class="btn btn-sm btn-outline" onclick="window._removeSettingsShiftDay()">- Remove</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Data Management</div>
      <div class="mt-8 flex gap-8" style="flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" onclick="window._exportData()">
          ${Icons.download} Export Data
        </button>
        <button class="btn btn-sm btn-outline" onclick="window._importData()">
          ${Icons.upload} Import Data
        </button>
        <button class="btn btn-sm btn-danger" onclick="window._clearData()">Clear All Data</button>
      </div>
      <div class="form-hint mt-8">Export creates a JSON backup. Import restores from a previous backup.</div>
    </div>

    <div class="disclaimer">
      <strong>CareTracker v1.0</strong><br>
      Caregiver Expense & Deduction Tracker<br><br>
      This tool provides estimates only and is not a substitute for professional tax advice.
      Always consult a qualified tax professional. All data is stored locally on your device
      and is never transmitted to any server.<br><br>
      IRS mileage log requirements: date, destination, medical purpose, and miles driven
      must be recorded contemporaneously (at or near the time of travel).
    </div>
  `;
}

window._saveSetting = (key, value) => {
  Store.updateSettings({ [key]: value });
  updateDeductionBadge();
};

window._saveLocation = (state) => {
  Store.updateSettings({ location: { country: 'US', state: state } });
  updateDeductionBadge();
};

window._saveShiftStart = (value) => {
  const pattern = Store.data.settings.shiftPattern;
  Store.updateSettings({ shiftPattern: { ...pattern, startDate: value } });
};

window._cycleSettingsShift = (idx) => {
  const order = ['D', 'N', 'O'];
  const pattern = [...Store.data.settings.shiftPattern.pattern];
  const cur = order.indexOf(pattern[idx]);
  pattern[idx] = order[(cur + 1) % 3];
  Store.updateSettings({ shiftPattern: { ...Store.data.settings.shiftPattern, pattern } });
  const btn = document.querySelector(`#settingsShiftPattern .shift-day-btn[data-idx="${idx}"]`);
  if (btn) {
    btn.textContent = pattern[idx];
    btn.className = `shift-day-btn ${pattern[idx]}`;
  }
};

window._addSettingsShiftDay = () => {
  const pattern = [...Store.data.settings.shiftPattern.pattern, 'O'];
  Store.updateSettings({ shiftPattern: { ...Store.data.settings.shiftPattern, pattern } });
  renderView();
};

window._removeSettingsShiftDay = () => {
  const pattern = [...Store.data.settings.shiftPattern.pattern];
  if (pattern.length > 1) {
    pattern.pop();
    Store.updateSettings({ shiftPattern: { ...Store.data.settings.shiftPattern, pattern } });
    renderView();
  }
};

// Dependent management
function showDepForm(existing = null) {
  const isEdit = !!existing;
  showModal(isEdit ? 'Edit Person' : 'Add Care Recipient', `
    <div class="form-group">
      <label class="form-label">Name *</label>
      <input class="form-input" id="depName" type="text" value="${escapeAttr(existing?.name || '')}" placeholder="Full name">
    </div>
    <div class="form-group">
      <label class="form-label">Relationship</label>
      <input class="form-input" id="depRel" type="text" value="${escapeAttr(existing?.relationship || '')}" placeholder="e.g. Wife, Mother-in-law, Parent">
    </div>
    <div class="form-group">
      <label class="form-label">Medical Conditions (optional)</label>
      <textarea class="form-textarea" id="depConditions" rows="2" placeholder="Helps organize records by condition">${existing?.conditions || ''}</textarea>
    </div>
  `, () => {
    const data = {
      name: document.getElementById('depName').value.trim(),
      relationship: document.getElementById('depRel').value.trim(),
      conditions: document.getElementById('depConditions').value.trim(),
    };
    if (!data.name) {
      alert('Please enter a name.');
      return false;
    }
    if (isEdit) {
      Store.updateDependent(existing.id, data);
    } else {
      Store.addDependent(data);
    }
    return true;
  });
}

window._showDepForm = () => showDepForm();
window._editDep = (id) => {
  const dep = Store.data.dependents.find((d) => d.id === id);
  if (dep) showDepForm(dep);
};
window._deleteDep = (id) => {
  if (confirm('Remove this care recipient? Their trips and expenses will remain.')) {
    Store.removeDependent(id);
    renderView();
  }
};

// Data export/import
window._exportData = () => {
  const json = Store.exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `caretracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window._importData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (Store.importData(ev.target.result)) {
        alert('Data imported successfully!');
        renderView();
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

window._clearData = () => {
  if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
    if (confirm('Really delete everything? Export a backup first if needed.')) {
      Store.clearAllData();
      setupStep = 0;
      renderView();
    }
  }
};

// ─── Modal System ───
function showModal(title, contentHtml, onSave) {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" onclick="window._closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        ${contentHtml}
      </div>
      ${onSave ? `
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="window._closeModal()">Cancel</button>
          <button class="btn btn-primary" id="modalSaveBtn">Save</button>
        </div>` : `
        <div class="modal-footer">
          <button class="btn btn-primary btn-block" onclick="window._closeModal()">Close</button>
        </div>`}
    </div>
  `;

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window._closeModal();
  });

  document.body.appendChild(overlay);

  // Wire up save button
  if (onSave) {
    document.getElementById('modalSaveBtn').addEventListener('click', () => {
      const result = onSave();
      if (result !== false) {
        window._closeModal();
        renderView();
      }
    });
  }
}

window._closeModal = () => {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
};

// ─── Utility Functions ───
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Boot ───
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderView();
});
