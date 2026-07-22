import fs from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  registeredAt: number;
  balance: number;
  token: string;
}

export interface SpinRecord {
  ip: string;
  fingerprint: string;
  userId?: string;
  timestamp: number;
}

// Check if Cloudflare D1 environment variables are set
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || "19c8cd09-b6bd-43d1-aeb9-735cafd80a61";

export const isD1Configured = !!(CF_ACCOUNT_ID && CF_API_TOKEN && CF_D1_DATABASE_ID);
let d1Active = isD1Configured;

// Cloudflare D1 HTTP client using native Node fetch
async function queryD1(sql: string, params: any[] = []): Promise<any> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sql, params })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`D1 query failed: ${response.statusText} (${text})`);
  }

  const json: any = await response.json();
  if (!json.success) {
    throw new Error(`D1 API error: ${JSON.stringify(json.errors)}`);
  }

  return json.result[0];
}

// Local File-based state (fallback)
const SPINS_FILE = path.join(process.cwd(), "spins.json");
const USERS_FILE = path.join(process.cwd(), "users.json");

let localSpins: SpinRecord[] = [];
let localUsers: UserRecord[] = [];

// Initialize local data
function initLocal() {
  try {
    if (fs.existsSync(SPINS_FILE)) {
      localSpins = JSON.parse(fs.readFileSync(SPINS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to load local spins.json", e);
  }
  try {
    if (fs.existsSync(USERS_FILE)) {
      localUsers = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to load local users.json", e);
  }
}

function saveLocalSpins() {
  try {
    fs.writeFileSync(SPINS_FILE, JSON.stringify(localSpins, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save local spins.json", e);
  }
}

function saveLocalUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save local users.json", e);
  }
}

export async function initializeDatabase() {
  // Always load local files first so they are ready as a fallback if D1 fails later
  initLocal();

  if (d1Active) {
    console.log("☁️ D1 Database configured. Initializing schema...");
    try {
      // Create users table
      await queryD1(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE,
          email TEXT UNIQUE,
          passwordHash TEXT,
          registeredAt INTEGER,
          balance REAL,
          token TEXT
        );
      `);

      // Create spins table
      await queryD1(`
        CREATE TABLE IF NOT EXISTS spins (
          ip TEXT,
          fingerprint TEXT,
          userId TEXT,
          timestamp INTEGER
        );
      `);
      console.log("✅ D1 Database schema verified successfully!");
    } catch (e) {
      console.error("❌ Failed to initialize D1 schema. Disabling D1 and falling back to local files.", e);
      d1Active = false;
    }
  } else {
    console.log("📁 D1 Database NOT fully configured or disabled. Falling back to local files.");
  }
}

// User methods
export async function getUsers(): Promise<UserRecord[]> {
  if (d1Active) {
    try {
      const res = await queryD1("SELECT * FROM users;");
      return res.results || [];
    } catch (e) {
      console.error("D1 getUsers failed, falling back to local storage and disabling D1", e);
      d1Active = false;
    }
  }
  return localUsers;
}

export async function findUserByUsernameOrEmail(identifier: string): Promise<UserRecord | null> {
  const cleanId = identifier.trim().toLowerCase();
  if (d1Active) {
    try {
      const res = await queryD1(
        "SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? LIMIT 1;",
        [cleanId, cleanId]
      );
      const rows = res.results || [];
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error("D1 findUserByUsernameOrEmail failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  return localUsers.find(u => u.username.toLowerCase() === cleanId || u.email === cleanId) || null;
}

export async function findUserByToken(token: string): Promise<UserRecord | null> {
  if (d1Active) {
    try {
      const res = await queryD1("SELECT * FROM users WHERE token = ? LIMIT 1;", [token]);
      const rows = res.results || [];
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error("D1 findUserByToken failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  return localUsers.find(u => u.token === token) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (d1Active) {
    try {
      const res = await queryD1("SELECT * FROM users WHERE id = ? LIMIT 1;", [id]);
      const rows = res.results || [];
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error("D1 findUserById failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  return localUsers.find(u => u.id === id) || null;
}

export async function createUser(user: UserRecord): Promise<void> {
  if (d1Active) {
    try {
      await queryD1(
        "INSERT INTO users (id, username, email, passwordHash, registeredAt, balance, token) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [user.id, user.username, user.email, user.passwordHash, user.registeredAt, user.balance, user.token]
      );
      return;
    } catch (e) {
      console.error("D1 createUser failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  localUsers.push(user);
  saveLocalUsers();
}

export async function updateUserToken(userId: string, token: string): Promise<void> {
  if (d1Active) {
    try {
      await queryD1("UPDATE users SET token = ? WHERE id = ?;", [token, userId]);
      return;
    } catch (e) {
      console.error("D1 updateUserToken failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  const u = localUsers.find(usr => usr.id === userId);
  if (u) {
    u.token = token;
    saveLocalUsers();
  }
}

export async function updateUserBalance(userId: string, balance: number): Promise<void> {
  if (d1Active) {
    try {
      await queryD1("UPDATE users SET balance = ? WHERE id = ?;", [balance, userId]);
      return;
    } catch (e) {
      console.error("D1 updateUserBalance failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  const u = localUsers.find(usr => usr.id === userId);
  if (u) {
    u.balance = balance;
    saveLocalUsers();
  }
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  if (d1Active) {
    try {
      await queryD1("UPDATE users SET passwordHash = ? WHERE id = ?;", [passwordHash, userId]);
      return;
    } catch (e) {
      console.error("D1 updateUserPassword failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  const u = localUsers.find(usr => usr.id === userId);
  if (u) {
    u.passwordHash = passwordHash;
    saveLocalUsers();
  }
}

// Spin methods
export async function getSpins(): Promise<SpinRecord[]> {
  if (d1Active) {
    try {
      const res = await queryD1("SELECT * FROM spins;");
      return res.results || [];
    } catch (e) {
      console.error("D1 getSpins failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  return localSpins;
}

export async function findRecentSpin(ip: string, fingerprint: string, userId?: string, cooldownMs: number = 24 * 60 * 60 * 1000): Promise<SpinRecord | null> {
  const minTime = Date.now() - cooldownMs;
  if (d1Active) {
    try {
      let query = "SELECT * FROM spins WHERE timestamp > ? AND (ip = ? OR fingerprint = ?";
      const params = [minTime, ip, fingerprint];
      if (userId) {
        query += " OR userId = ?";
        params.push(userId);
      }
      query += ") ORDER BY timestamp DESC LIMIT 1;";
      
      const res = await queryD1(query, params);
      const rows = res.results || [];
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error("D1 findRecentSpin failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }

  return localSpins.find(s => {
    const isIpMatch = ip && s.ip === ip;
    const isFpMatch = fingerprint && s.fingerprint === fingerprint;
    const isUserMatch = userId && s.userId === userId;
    return (isIpMatch || isFpMatch || isUserMatch) && s.timestamp > minTime;
  }) || null;
}

export async function addSpin(spin: SpinRecord): Promise<void> {
  if (d1Active) {
    try {
      await queryD1(
        "INSERT INTO spins (ip, fingerprint, userId, timestamp) VALUES (?, ?, ?, ?);",
        [spin.ip, spin.fingerprint, spin.userId || null, spin.timestamp]
      );
      return;
    } catch (e) {
      console.error("D1 addSpin failed, falling back to local and disabling D1", e);
      d1Active = false;
    }
  }
  localSpins.push(spin);
  saveLocalSpins();
}
