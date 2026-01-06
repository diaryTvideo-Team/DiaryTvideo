'use client';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'diary_users';
const CURRENT_USER_KEY = 'diary_current_user';

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(
  email: string,
  password: string,
  name: string,
): { success: boolean; error?: string } {
  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password: btoa(password), // Simple encoding (not secure, but works for demo)
    name,
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true };
}

export function login(
  email: string,
  password: string,
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.password !== btoa(password)) {
    return { success: false, error: 'Invalid password' };
  }

  const publicUser: User = { id: user.id, email: user.email, name: user.name };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

  return { success: true, user: publicUser };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}
