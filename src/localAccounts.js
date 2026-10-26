const ACCOUNTS_KEY = "paper-ink-local-accounts";
const HASH_ITERATIONS = 310_000;

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "{}");
  } catch {
    throw new Error("Couldn’t read saved accounts in this browser.");
  }
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: HASH_ITERATIONS },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    throw new Error("Couldn’t save your account in this browser. Check available storage and try again.");
  }
}

export async function registerLocalAccount(details) {
  const accounts = getAccounts();
  const email = details.email.trim().toLowerCase();
  if (accounts[email]) {
    throw new Error("An account with this email already exists in this browser. Please sign in.");
  }

  const salt = createSalt();
  const user = {
    id: crypto.randomUUID(),
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    email,
  };
  accounts[email] = {
    user,
    salt: bytesToHex(salt),
    passwordHash: await hashPassword(details.password, salt),
  };
  saveAccounts(accounts);
  return user;
}

export async function loginLocalAccount(credentials) {
  const email = credentials.email.trim().toLowerCase();
  const account = getAccounts()[email];
  if (!account) {
    throw new Error("No local account was found for this email. Please create an account first.");
  }

  const matches = await hashPassword(credentials.password, hexToBytes(account.salt));
  if (matches !== account.passwordHash) {
    throw new Error("Email or password is incorrect.");
  }
  return account.user;
}

export function hasLocalAccount(email) {
  return Boolean(getAccounts()[email.trim().toLowerCase()]);
}
