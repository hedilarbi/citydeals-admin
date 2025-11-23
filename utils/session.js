export const AUTH_TOKEN_COOKIE = "citydeals_token";
export const ADMIN_INFO_COOKIE = "citydeals_admin";

const baseCookieConfig = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const getServerCookies = async () => {
  const { cookies } = await import("next/headers");
  return cookies();
};

const readClientCookie = (name) => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieString = document.cookie || "";
  const cookiesArray = cookieString.split(";").map((entry) => entry.trim());
  const match = cookiesArray.find((entry) => entry.startsWith(`${name}=`));
  if (!match) return null;
  const value = match.split("=").slice(1).join("=");
  return decodeURIComponent(value);
};

export async function persistSession({ token, admin }) {
  if (typeof window !== "undefined") {
    throw new Error("persistSession ne peut être utilisé que côté serveur.");
  }

  const cookieStore = await getServerCookies();

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
  if (typeof window !== "undefined") {
    throw new Error("destroySession ne peut être utilisé que côté serveur.");
  }

  const cookieStore = await getServerCookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_INFO_COOKIE);
}

export async function getSession() {
  let token = null;
  let adminRaw = null;

  if (typeof window === "undefined") {
    const cookieStore = await getServerCookies();
    token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
    adminRaw = cookieStore.get(ADMIN_INFO_COOKIE)?.value ?? null;
  } else {
    token = readClientCookie(AUTH_TOKEN_COOKIE);
    adminRaw = readClientCookie(ADMIN_INFO_COOKIE);
  }

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
