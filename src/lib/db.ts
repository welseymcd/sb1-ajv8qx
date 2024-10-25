import { openDB } from 'idb';

const DB_NAME = 'calloff-tracker';
const DB_VERSION = 1;

export const db = await openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Employees store
    if (!db.objectStoreNames.contains('employees')) {
      const employeeStore = db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
      employeeStore.createIndex('name', 'name');
      employeeStore.createIndex('department', 'department');
    }

    // Call-offs store
    if (!db.objectStoreNames.contains('calloffs')) {
      const calloffStore = db.createObjectStore('calloffs', { keyPath: 'id', autoIncrement: true });
      calloffStore.createIndex('employeeId', 'employeeId');
      calloffStore.createIndex('date', 'date');
      calloffStore.createIndex('type', 'type');
    }
  },
});

export interface Employee {
  id?: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
}

export interface Calloff {
  id?: number;
  employeeId: number;
  date: string;
  type: 'sick' | 'personal' | 'vacation' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  notes?: string;
}

export const employeeDB = {
  async add(employee: Employee) {
    return db.add('employees', employee);
  },
  async getAll() {
    return db.getAll('employees');
  },
  async get(id: number) {
    return db.get('employees', id);
  },
  async update(employee: Employee) {
    return db.put('employees', employee);
  },
  async delete(id: number) {
    return db.delete('employees', id);
  },
};

export const calloffDB = {
  async add(calloff: Calloff) {
    return db.add('calloffs', calloff);
  },
  async getAll() {
    return db.getAll('calloffs');
  },
  async get(id: number) {
    return db.get('calloffs', id);
  },
  async update(calloff: Calloff) {
    return db.put('calloffs', calloff);
  },
  async delete(id: number) {
    return db.delete('calloffs', id);
  },
  async getByEmployee(employeeId: number) {
    const index = db.transaction('calloffs').store.index('employeeId');
    return index.getAll(employeeId);
  },
};