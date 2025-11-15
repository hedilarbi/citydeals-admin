import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE = "citydeals_token";
export const ADMIN_INFO_COOKIE = "citydeals_admin";

const baseCookieConfig = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export async function persistSession({ token, admin }) {
  const cookieStore = await cookies();

  if (token) {
    cookieStore.set(AUTH_TOKEN_COOKIE, token, {
      ...baseCookieConfig,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (admin) {
    cookieStore.set(ADMIN_INFO_COOKIE, JSON.stringify(admin), {
      ...baseCookieConfig,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_INFO_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
  const adminRaw = cookieStore.get(ADMIN_INFO_COOKIE)?.value ?? null;
  let admin = null;

  if (adminRaw) {
    try {
      admin = JSON.parse(adminRaw);
    } catch (error) {
      admin = null;
    }
  }

  return { token, admin };
}
