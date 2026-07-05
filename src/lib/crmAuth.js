// CRM Auth — JWT token + manager session stored in localStorage

const TOKEN_KEY = 'crm_token';
const MANAGER_KEY = 'crm_manager';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getManager() {
  try {
    return JSON.parse(localStorage.getItem(MANAGER_KEY));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  const m = getManager();
  return m && (m.role === 'super_admin' || m.role === 'security_officer');
}

export function isSuperAdmin() {
  const m = getManager();
  return m && m.role === 'super_admin';
}

export function setSession(token, manager) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(MANAGER_KEY, JSON.stringify(manager));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(MANAGER_KEY);
}