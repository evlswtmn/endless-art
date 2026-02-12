// CareTracker - Data Management Layer
// All data persisted in localStorage - no server, no accounts, your data stays on your device

const STORAGE_KEY = 'caretracker_data';

const defaultData = {
  settings: {
    userName: '',
    location: { country: 'US', state: '' },
    agi: 0,
    taxYear: new Date().getFullYear(),
    shiftPattern: {
      type: 'rotating',
      shiftLength: 12,
      pattern: [],
      startDate: '',
    },
    currency: 'USD',
    setupComplete: false,
  },
  dependents: [],
  mileageLog: [],
  expenses: [],
  appointments: [],
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export const Store = {
  _data: null,
  _listeners: [],

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this._data = deepMerge(defaultData, JSON.parse(saved));
      } catch (e) {
        this._data = JSON.parse(JSON.stringify(defaultData));
      }
    } else {
      this._data = JSON.parse(JSON.stringify(defaultData));
    }
    return this._data;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    this._listeners.forEach((fn) => fn(this._data));
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  get data() {
    return this._data;
  },

  // --- Dependents ---
  addDependent(dependent) {
    const entry = { id: generateId(), ...dependent };
    this._data.dependents.push(entry);
    this.save();
    return entry;
  },

  updateDependent(id, updates) {
    const idx = this._data.dependents.findIndex((d) => d.id === id);
    if (idx >= 0) {
      this._data.dependents[idx] = { ...this._data.dependents[idx], ...updates };
      this.save();
    }
  },

  removeDependent(id) {
    this._data.dependents = this._data.dependents.filter((d) => d.id !== id);
    this.save();
  },

  // --- Mileage Log ---
  // IRS requires: date, destination, medical purpose, miles driven
  // We also capture: start location, odometer readings, dependents transported, timestamp
  addMileageEntry(entry) {
    const record = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this._data.mileageLog.push(record);
    this._data.mileageLog.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.save();
    return record;
  },

  updateMileageEntry(id, updates) {
    const idx = this._data.mileageLog.findIndex((e) => e.id === id);
    if (idx >= 0) {
      this._data.mileageLog[idx] = { ...this._data.mileageLog[idx], ...updates };
      this.save();
    }
  },

  removeMileageEntry(id) {
    this._data.mileageLog = this._data.mileageLog.filter((e) => e.id !== id);
    this.save();
  },

  // --- Expenses ---
  addExpense(expense) {
    const record = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...expense,
    };
    this._data.expenses.push(record);
    this._data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.save();
    return record;
  },

  updateExpense(id, updates) {
    const idx = this._data.expenses.findIndex((e) => e.id === id);
    if (idx >= 0) {
      this._data.expenses[idx] = { ...this._data.expenses[idx], ...updates };
      this.save();
    }
  },

  removeExpense(id) {
    this._data.expenses = this._data.expenses.filter((e) => e.id !== id);
    this.save();
  },

  // --- Appointments ---
  addAppointment(apt) {
    const record = { id: generateId(), ...apt };
    this._data.appointments.push(record);
    this._data.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save();
    return record;
  },

  updateAppointment(id, updates) {
    const idx = this._data.appointments.findIndex((a) => a.id === id);
    if (idx >= 0) {
      this._data.appointments[idx] = { ...this._data.appointments[idx], ...updates };
      this.save();
    }
  },

  removeAppointment(id) {
    this._data.appointments = this._data.appointments.filter((a) => a.id !== id);
    this.save();
  },

  // --- Settings ---
  updateSettings(updates) {
    this._data.settings = deepMerge(this._data.settings, updates);
    this.save();
  },

  // --- Query Helpers ---
  getMileageForYear(year) {
    return this._data.mileageLog.filter(
      (e) => new Date(e.date).getFullYear() === year
    );
  },

  getExpensesForYear(year) {
    return this._data.expenses.filter(
      (e) => new Date(e.date).getFullYear() === year
    );
  },

  getAppointmentsForDate(dateStr) {
    return this._data.appointments.filter((a) => a.date === dateStr);
  },

  getMileageForDate(dateStr) {
    return this._data.mileageLog.filter((e) => e.date === dateStr);
  },

  getExpensesForDate(dateStr) {
    return this._data.expenses.filter((e) => e.date === dateStr);
  },

  // --- Shift Pattern ---
  getShiftForDate(dateStr) {
    const pattern = this._data.settings.shiftPattern;
    if (!pattern.pattern.length || !pattern.startDate) return null;

    const start = new Date(pattern.startDate + 'T00:00:00');
    const target = new Date(dateStr + 'T00:00:00');
    const diffDays = Math.floor((target - start) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const idx = diffDays % pattern.pattern.length;
    return pattern.pattern[idx]; // 'D' = day, 'N' = night, 'O' = off
  },

  // --- Export/Import ---
  exportData() {
    return JSON.stringify(this._data, null, 2);
  },

  importData(json) {
    try {
      const data = JSON.parse(json);
      this._data = deepMerge(defaultData, data);
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  },

  clearAllData() {
    this._data = JSON.parse(JSON.stringify(defaultData));
    this.save();
  },
};
