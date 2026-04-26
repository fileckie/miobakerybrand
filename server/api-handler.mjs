import { db } from "./db.mjs";

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  try {
    // ── 前台只读 ──
    if (req.method === "GET" && url.pathname === "/api/sections") {
      const rows = db.prepare("SELECT * FROM sections WHERE isVisible=1 ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "GET" && url.pathname === "/api/craft-steps") {
      const rows = db.prepare("SELECT * FROM craft_steps ORDER BY stepNumber").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "GET" && url.pathname === "/api/products") {
      const rows = db.prepare("SELECT * FROM products ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "GET" && url.pathname === "/api/ingredients") {
      const rows = db.prepare("SELECT * FROM ingredients ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }

    // ── 后台管理 ──
    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const { username, password } = await readJson(req);
      const user = db.prepare("SELECT * FROM admin_users WHERE username=? AND password=?").get(username, password);
      if (!user) return sendJson(res, 401, { error: "账号或密码错误" });
      return sendJson(res, 200, { id: user.id, username: user.username });
    }

    if (req.method === "GET" && url.pathname === "/api/admin/sections") {
      const rows = db.prepare("SELECT * FROM sections ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "PUT" && url.pathname.startsWith("/api/admin/sections/")) {
      const id = url.pathname.split("/").pop();
      const patch = await readJson(req);
      const fields = Object.keys(patch).map(k => `${k}=?`).join(",");
      db.prepare(`UPDATE sections SET ${fields} WHERE id=?`).run(...Object.values(patch), id);
      return sendJson(res, 200, { success: true });
    }

    if (req.method === "GET" && url.pathname === "/api/admin/products") {
      const rows = db.prepare("SELECT * FROM products ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "POST" && url.pathname === "/api/admin/products") {
      const body = await readJson(req);
      const id = generateId();
      db.prepare("INSERT INTO products (id,name,description,imageUrl,category,featured,sortOrder) VALUES (?,?,?,?,?,?,?)").run(
        id, body.name||"", body.description||"", body.imageUrl||"", body.category||"", body.featured?1:0, body.sortOrder||0
      );
      return sendJson(res, 200, { id });
    }
    if (req.method === "PUT" && url.pathname.startsWith("/api/admin/products/")) {
      const id = url.pathname.split("/").pop();
      const patch = await readJson(req);
      const fields = Object.keys(patch).map(k => `${k}=?`).join(",");
      db.prepare(`UPDATE products SET ${fields} WHERE id=?`).run(...Object.values(patch), id);
      return sendJson(res, 200, { success: true });
    }
    if (req.method === "DELETE" && url.pathname.startsWith("/api/admin/products/")) {
      const id = url.pathname.split("/").pop();
      db.prepare("DELETE FROM products WHERE id=?").run(id);
      return sendJson(res, 200, { success: true });
    }

    if (req.method === "GET" && url.pathname === "/api/admin/ingredients") {
      const rows = db.prepare("SELECT * FROM ingredients ORDER BY sortOrder").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "POST" && url.pathname === "/api/admin/ingredients") {
      const body = await readJson(req);
      const id = generateId();
      db.prepare("INSERT INTO ingredients (id,name,description,origin,imageUrl,sortOrder) VALUES (?,?,?,?,?,?)").run(
        id, body.name||"", body.description||"", body.origin||"", body.imageUrl||"", body.sortOrder||0
      );
      return sendJson(res, 200, { id });
    }
    if (req.method === "PUT" && url.pathname.startsWith("/api/admin/ingredients/")) {
      const id = url.pathname.split("/").pop();
      const patch = await readJson(req);
      const fields = Object.keys(patch).map(k => `${k}=?`).join(",");
      db.prepare(`UPDATE ingredients SET ${fields} WHERE id=?`).run(...Object.values(patch), id);
      return sendJson(res, 200, { success: true });
    }
    if (req.method === "DELETE" && url.pathname.startsWith("/api/admin/ingredients/")) {
      const id = url.pathname.split("/").pop();
      db.prepare("DELETE FROM ingredients WHERE id=?").run(id);
      return sendJson(res, 200, { success: true });
    }

    if (req.method === "GET" && url.pathname === "/api/admin/craft-steps") {
      const rows = db.prepare("SELECT * FROM craft_steps ORDER BY stepNumber").all();
      return sendJson(res, 200, rows);
    }
    if (req.method === "PUT" && url.pathname.startsWith("/api/admin/craft-steps/")) {
      const id = url.pathname.split("/").pop();
      const patch = await readJson(req);
      const fields = Object.keys(patch).map(k => `${k}=?`).join(",");
      db.prepare(`UPDATE craft_steps SET ${fields} WHERE id=?`).run(...Object.values(patch), id);
      return sendJson(res, 200, { success: true });
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (e) {
    console.error("API error:", e);
    sendJson(res, 500, { error: e.message });
  }
}
