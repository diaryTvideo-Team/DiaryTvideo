"use client";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "diary_users";
const CURRENT_USER_KEY = "diary_current_user";
const VERIFICATION_KEY_PREFIX = "diary_verification_";

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
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
    return { success: false, error: "Email already registered" };
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password: btoa(password), // Simple encoding (not secure, but works for demo)
    name,
    createdAt: new Date().toISOString(),
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
    return { success: false, error: "User not found" };
  }

  if (user.password !== btoa(password)) {
    return { success: false, error: "Invalid password" };
  }

  const publicUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

  return { success: true, user: publicUser };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function updateName(
  userId: string,
  newName: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  users[userIndex].name = newName;
  saveUsers(users);

  // Update current user in session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.name = newName;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  return { success: true };
}

export function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  if (users[userIndex].password !== btoa(currentPassword)) {
    return { success: false, error: "Current password is incorrect" };
  }

  users[userIndex].password = btoa(newPassword);
  saveUsers(users);

  return { success: true };
}

export function deleteAccount(
  userId: string,
  password: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  if (users[userIndex].password !== btoa(password)) {
    return { success: false, error: "Password is incorrect" };
  }

  // Remove user
  users.splice(userIndex, 1);
  saveUsers(users);

  // Remove user's diary entries
  const ENTRIES_KEY = `diary_entries_${userId}`;
  localStorage.removeItem(ENTRIES_KEY);

  // Logout
  logout();

  return { success: true };
}

interface VerificationData {
  code: string;
  expiresAt: number;
}

export function sendVerificationCode(email: string): { success: boolean } {
  if (typeof window === "undefined") return { success: false };

  // Generate random 6-character alphanumeric code
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Set expiration to 5 minutes from now
  const expiresAt = Date.now() + 5 * 60 * 1000;

  const verificationData: VerificationData = {
    code,
    expiresAt,
  };

  localStorage.setItem(
    `${VERIFICATION_KEY_PREFIX}${email.toLowerCase()}`,
    JSON.stringify(verificationData),
  );

  console.log(`[DEV] Verification code for ${email}: ${code}`);

  return { success: true };
}

export function verifyCode(
  email: string,
  code: string,
): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false };

  // Accept any 6-character alphanumeric code as valid
  if (code.length !== 6 || !/^[A-Z0-9]{6}$/i.test(code)) {
    return { success: false, error: "Invalid verification code" };
  }

  const verificationKey = `${VERIFICATION_KEY_PREFIX}${email.toLowerCase()}`;
  const data = localStorage.getItem(verificationKey);

  if (!data) {
    return { success: false, error: "No verification code found" };
  }

  const verificationData: VerificationData = JSON.parse(data);

  // Check if code has expired
  if (Date.now() > verificationData.expiresAt) {
    localStorage.removeItem(verificationKey);
    return { success: false, error: "Verification code has expired" };
  }

  // Clean up verification data
  localStorage.removeItem(verificationKey);

  return { success: true };
}

export function resendVerificationCode(email: string): { success: boolean } {
  console.log(`[DEV] Resending verification code to ${email}`);
  return sendVerificationCode(email);
}

export function sendPasswordResetEmail(email?: string): { success: boolean } {
  const resetEmail = email || "user@example.com";
  console.log(`[DEV] Sending password reset email to ${resetEmail}`);
  console.log(
    `[DEV] Password reset link: https://example.com/reset-password?token=abc123`,
  );
  return { success: true };
}

export function resendPasswordResetEmail(email?: string): { success: boolean } {
  console.log(`[DEV] Resending password reset email`);
  return sendPasswordResetEmail(email);
}
