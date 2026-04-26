import { useState, useEffect } from "react";
import { Lock, LogOut, Plus, Trash2, Eye, EyeOff, Flame } from "lucide-react";
import { useAppStore } from "../stores/appStore";
import type { Section, Product, Ingredient, CraftStep } from "../types";

export default function AdminWorkshop() {
  const { adminUser, login, logout } = useAppStore();
  const [tab, setTab] = useState<"sections" | "products" | "ingredients" | "craft">("sections");

  if (!adminUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-ash">
      <header className="sticky top-0 z-40 border-b border-border bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-ember" />
            <span className="font-display font-bold">Mio</span>
            <span className="text-xs text-muted">品牌内容工作台</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">{adminUser.username}</span>
            <button onClick={() => { logout(); window.location.href = "/"; }} className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-kiln hover:bg-kiln hover:text-white transition">
              <LogOut className="h-3 w-3" />退出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {[
            { id: "sections" as const, label: "官网板块" },
            { id: "products" as const, label: "产品" },
            { id: "ingredients" as const, label: "原物料" },
            { id: "craft" as const, label: "工艺" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold transition border-b-2 ${
                tab === t.id ? "border-kiln text-kiln" : "border-transparent text-muted hover:text-kiln"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "sections" && <SectionsPanel />}
          {tab === "products" && <ProductsPanel />}
          {tab === "ingredients" && <IngredientsPanel />}
          {tab === "craft" && <CraftPanel />}
        </div>
      </main>
    </div>
  );
}

// ── Login ──
function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => Promise<boolean> }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setError("");
    const ok = await onLogin(user, pass);
    setLoading(false);
    if (!ok) setError("账号或密码错误");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ash px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-soft">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kiln text-ash">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-brush text-2xl text-kiln">工作台登录</h1>
          <p className="mt-1 text-xs text-muted">Mio SLOWFIRE 品牌内容管理</p>
        </div>
        <div className="mt-6 grid gap-3">
          <input className="input-field" value={user} onChange={e => setUser(e.target.value)} placeholder="账号" />
          <input className="input-field" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="密码" onKeyDown={e => e.key === "Enter" && submit()} />
          {error && <p className="text-sm text-ember">{error}</p>}
          <button onClick={submit} disabled={loading} className="btn-primary w-full">
            {loading ? "登录中..." : "进入工作台"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted">默认账号: admin / miobakery2024</p>
        <a href="/" className="mt-4 block text-center text-xs text-muted hover:text-kiln">← 返回官网</a>
      </div>
    </div>
  );
}

// ── Sections Panel ──
function SectionsPanel() {
  const [items, setItems] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sections").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  }, []);

  const update = async (id: string, patch: Partial<Section>) => {
    await fetch(`/api/admin/sections/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  if (loading) return <p className="text-muted">加载中...</p>;

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div key={s.id} className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ember uppercase">{s.key}</span>
            <button onClick={() => update(s.id, { isVisible: s.isVisible ? 0 : 1 })} className="text-xs flex items-center gap-1 text-muted hover:text-kiln">
              {s.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {s.isVisible ? "显示中" : "已隐藏"}
            </button>
          </div>
          <div className="grid gap-3">
            <input className="input-field" value={s.title} onChange={e => setItems(prev => prev.map(i => i.id === s.id ? { ...i, title: e.target.value } : i))} onBlur={() => update(s.id, { title: s.title })} placeholder="标题" />
            <input className="input-field" value={s.subtitle || ""} onChange={e => setItems(prev => prev.map(i => i.id === s.id ? { ...i, subtitle: e.target.value } : i))} onBlur={() => update(s.id, { subtitle: s.subtitle })} placeholder="副标题" />
            <textarea className="input-field min-h-24 resize-none" value={s.content} onChange={e => setItems(prev => prev.map(i => i.id === s.id ? { ...i, content: e.target.value } : i))} onBlur={() => update(s.id, { content: s.content })} placeholder="内容" />
            <input className="input-field" value={s.imageUrl || ""} onChange={e => setItems(prev => prev.map(i => i.id === s.id ? { ...i, imageUrl: e.target.value } : i))} onBlur={() => update(s.id, { imageUrl: s.imageUrl })} placeholder="图片 URL（可选）" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Products Panel ──
function ProductsPanel() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  }, []);

  const refresh = () => fetch("/api/admin/products").then(r => r.json()).then(setItems);

  const update = async (id: string, patch: Partial<Product>) => {
    await fetch(`/api/admin/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    refresh();
  };

  const add = async () => {
    const name = prompt("产品名称");
    if (!name) return;
    await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: "", category: "欧包" }) });
    refresh();
  };

  if (loading) return <p className="text-muted">加载中...</p>;

  return (
    <div>
      <button onClick={add} className="btn-ember mb-4"><Plus className="h-4 w-4" />新增产品</button>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
              <input className="input-field py-2 text-sm" value={p.name} onChange={e => setItems(prev => prev.map(i => i.id === p.id ? { ...i, name: e.target.value } : i))} onBlur={() => update(p.id, { name: p.name })} placeholder="名称" />
              <input className="input-field py-2 text-sm" value={p.category} onChange={e => setItems(prev => prev.map(i => i.id === p.id ? { ...i, category: e.target.value } : i))} onBlur={() => update(p.id, { category: p.category })} placeholder="分类" />
              <button onClick={() => update(p.id, { featured: p.featured ? 0 : 1 })} className={`rounded-full px-3 py-2 text-xs font-semibold ${p.featured ? "bg-ember text-white" : "bg-ash text-muted"}`}>
                {p.featured ? "主推" : "普通"}
              </button>
              <button onClick={() => del(p.id)} className="flex items-center justify-center rounded-full bg-ash p-2 text-muted hover:text-ember transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea className="input-field mt-2 min-h-16 resize-none text-sm" value={p.description} onChange={e => setItems(prev => prev.map(i => i.id === p.id ? { ...i, description: e.target.value } : i))} onBlur={() => update(p.id, { description: p.description })} placeholder="描述" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ingredients Panel ──
function IngredientsPanel() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ingredients").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  }, []);

  const refresh = () => fetch("/api/admin/ingredients").then(r => r.json()).then(setItems);

  const update = async (id: string, patch: Partial<Ingredient>) => {
    await fetch(`/api/admin/ingredients/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    refresh();
  };

  const del = async (id: string) => { if (!confirm("确定删除？")) return; await fetch(`/api/admin/ingredients/${id}`, { method: "DELETE" }); refresh(); };

  const add = async () => {
    const name = prompt("原料名称");
    if (!name) return;
    await fetch("/api/admin/ingredients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: "", origin: "" }) });
    refresh();
  };

  if (loading) return <p className="text-muted">加载中...</p>;

  return (
    <div>
      <button onClick={add} className="btn-ember mb-4"><Plus className="h-4 w-4" />新增原料</button>
      <div className="space-y-3">
        {items.map((ing) => (
          <div key={ing.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input className="input-field py-2 text-sm" value={ing.name} onChange={e => setItems(prev => prev.map(i => i.id === ing.id ? { ...i, name: e.target.value } : i))} onBlur={() => update(ing.id, { name: ing.name })} placeholder="名称" />
              <input className="input-field py-2 text-sm" value={ing.origin} onChange={e => setItems(prev => prev.map(i => i.id === ing.id ? { ...i, origin: e.target.value } : i))} onBlur={() => update(ing.id, { origin: ing.origin })} placeholder="产地" />
              <button onClick={() => del(ing.id)} className="flex items-center justify-center rounded-full bg-ash p-2 text-muted hover:text-ember transition"><Trash2 className="h-4 w-4" /></button>
            </div>
            <textarea className="input-field mt-2 min-h-16 resize-none text-sm" value={ing.description} onChange={e => setItems(prev => prev.map(i => i.id === ing.id ? { ...i, description: e.target.value } : i))} onBlur={() => update(ing.id, { description: ing.description })} placeholder="描述" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Craft Panel ──
function CraftPanel() {
  const [items, setItems] = useState<CraftStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/craft-steps").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  }, []);

  const update = async (id: string, patch: Partial<CraftStep>) => {
    await fetch(`/api/admin/craft-steps/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  if (loading) return <p className="text-muted">加载中...</p>;

  return (
    <div className="space-y-4">
      {items.map((step) => (
        <div key={step.id} className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-white text-xs font-bold">{step.stepNumber}</span>
            <span className="text-xs text-muted">工艺步骤</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="input-field py-2 text-sm" value={step.title} onChange={e => setItems(prev => prev.map(i => i.id === step.id ? { ...i, title: e.target.value } : i))} onBlur={() => update(step.id, { title: step.title })} placeholder="标题" />
            <input className="input-field py-2 text-sm" value={step.duration} onChange={e => setItems(prev => prev.map(i => i.id === step.id ? { ...i, duration: e.target.value } : i))} onBlur={() => update(step.id, { duration: step.duration })} placeholder="时长" />
            <input className="input-field py-2 text-sm" value={step.imageUrl || ""} onChange={e => setItems(prev => prev.map(i => i.id === step.id ? { ...i, imageUrl: e.target.value } : i))} onBlur={() => update(step.id, { imageUrl: step.imageUrl })} placeholder="图片 URL" />
          </div>
          <textarea className="input-field mt-2 min-h-20 resize-none text-sm" value={step.description} onChange={e => setItems(prev => prev.map(i => i.id === step.id ? { ...i, description: e.target.value } : i))} onBlur={() => update(step.id, { description: step.description })} placeholder="描述" />
        </div>
      ))}
    </div>
  );
}
