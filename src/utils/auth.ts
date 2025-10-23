// Admin authentication utilities

export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

export const ADMIN_CREDENTIALS = {
  email: "admin@timbukar.com",
  password: "admin123", // In production, use hashed passwords and proper authentication
};

export const isAdminLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  const user = localStorage.getItem("user");
  if (!user) return false;

  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === "admin";
  } catch {
    return false;
  }
};

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === "admin") {
      return parsedUser;
    }
    return null;
  } catch {
    return null;
  }
};

export const loginAdmin = (email: string, password: string): boolean => {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const adminUser: AdminUser = {
      email: ADMIN_CREDENTIALS.email,
      name: "Administrator",
      role: "admin",
    };
    localStorage.setItem("user", JSON.stringify(adminUser));
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem("user");
};
