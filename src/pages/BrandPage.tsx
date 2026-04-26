import { useEffect } from "react";
import { Flame, Clock, Wheat, ArrowRight, ChefHat, Thermometer, Wind } from "lucide-react";
import { useAppStore } from "../stores/appStore";

export default function BrandPage({ go }: { go: (path: string) => void }) {
  const { sections, products, ingredients, craftSteps, fetchAll, loading } = useAppStore();

  useEffect(() => { fetchAll(); }, []);

  const hero = sections.find(s => s.key === "hero");
  const craft = sections.find(s => s.key === "craft");
  const productsSec = sections.find(s => s.key === "products");
  const ingredientsSec = sections.find(s => s.key === "ingredients");
  const contact = sections.find(s => s.key === "contact");

  const featuredProducts = products.filter(p => p.featured);

  const craftIcons = [ChefHat, Clock, Wind, Thermometer, Flame];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Flame className="mx-auto h-12 w-12 text-ember animate-flicker" />
          <p className="mt-4 font-brush text-xl text-kiln">窑火正在点燃...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 bg-ash/90 backdrop-blur-xl border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-ember" />
            <span className="font-display text-lg font-bold tracking-tight">Mio</span>
            <span className="font-script text-sm text-smoke">slowfire</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-smoke md:flex">
            <a href="#craft" className="hover:text-kiln transition">工艺</a>
            <a href="#products" className="hover:text-kiln transition">产品</a>
            <a href="#ingredients" className="hover:text-kiln transition">原物料</a>
            <a href="#contact" className="hover:text-kiln transition">联系</a>
          </nav>
          <button onClick={() => go("/admin")} className="text-xs font-semibold text-smoke hover:text-kiln transition">
            后台
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ash pt-24">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-ember/5 blur-3xl" />
        <div className="absolute -left-20 top-1/3 h-[400px] w-[400px] rounded-full bg-wheat/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-32">
          <div className="max-w-2xl">
            <p className="font-serif text-lg italic text-smoke">SLOWFIRE BAKERY</p>
            <h1 className="mt-4 font-brush text-6xl text-kiln sm:text-7xl">
              {hero?.title || "Mio SLOWFIRE"}
            </h1>
            <p className="mt-4 font-brush text-2xl text-ember">
              {hero?.subtitle || "慢火窑烤面包"}
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              {hero?.content}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#products" className="btn-ember">
                探索本季窑烤 <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#craft" className="btn-primary">
                了解工艺
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12">
            <p className="text-sm font-semibold text-ember">{craft?.subtitle || "工艺"}</p>
            <h2 className="section-title mt-2">{craft?.title || "十二小时慢火工艺"}</h2>
            <p className="section-subtitle mt-3 max-w-xl">{craft?.content}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {craftSteps.map((step, i) => {
              const Icon = craftIcons[i] || Flame;
              return (
                <div key={step.id} className="relative rounded-2xl border border-border bg-ash p-6 text-center transition hover:-translate-y-1 hover:shadow-card">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ember shadow-soft">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-ember">STEP {step.stepNumber}</p>
                  <p className="mt-2 font-semibold text-kiln">{step.title}</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{step.description}</p>
                  <p className="mt-3 text-xs text-smoke font-medium">{step.duration}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-ash py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12">
            <p className="text-sm font-semibold text-ember">{productsSec?.subtitle || "产品"}</p>
            <h2 className="section-title mt-2">{productsSec?.title || "本季窑烤"}</h2>
            <p className="section-subtitle mt-3">{productsSec?.content}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <div key={p.id} className="group rounded-2xl border border-border bg-white p-5 transition hover:shadow-elevated hover:-translate-y-1">
                <div className="flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 via-stone-50 to-yellow-50">
                  <span className="text-5xl">🍞</span>
                </div>
                <div className="mt-4">
                  <span className="text-xs font-semibold text-ember">{p.category}</span>
                  <h3 className="mt-1 text-lg font-semibold text-kiln">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
          {products.length > featuredProducts.length && (
            <div className="mt-10 text-center">
              <button className="btn-primary">查看全部 {products.length} 款面包</button>
            </div>
          )}
        </div>
      </section>

      {/* Ingredients */}
      <section id="ingredients" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12">
            <p className="text-sm font-semibold text-ember">{ingredientsSec?.subtitle || "原物料"}</p>
            <h2 className="section-title mt-2">{ingredientsSec?.title || "好面包从好原料开始"}</h2>
            <p className="section-subtitle mt-3">{ingredientsSec?.content}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-start gap-4 rounded-2xl border border-border bg-ash p-5 transition hover:border-kiln/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-wheat shadow-soft">
                  <Wheat className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-kiln">{ing.name}</p>
                  <p className="text-xs text-ember mt-0.5">{ing.origin}</p>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{ing.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="border-t border-border bg-kiln py-16 text-ash">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <p className="font-display text-2xl font-bold">Mio</p>
              <p className="font-script text-lg italic text-smoke-light">slowfire</p>
              <p className="mt-4 font-brush text-xl text-ember">{contact?.title || "找到我们"}</p>
              <p className="mt-2 text-sm text-smoke-light leading-relaxed max-w-sm">
                {contact?.content}
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">探索</p>
              <div className="mt-4 space-y-2 text-sm text-smoke-light">
                <a href="#craft" className="block hover:text-ash transition">工艺</a>
                <a href="#products" className="block hover:text-ash transition">产品</a>
                <a href="#ingredients" className="block hover:text-ash transition">原物料</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">运营</p>
              <div className="mt-4 space-y-2 text-sm text-smoke-light">
                <button onClick={() => go("/admin")} className="block hover:text-ash transition">内容管理后台</button>
                <a href="http://8.133.194.58" target="_blank" rel="noreferrer" className="block hover:text-ash transition">前往预订系统 →</a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-kiln-light pt-8 text-center text-xs text-smoke-light">
            <p>© {new Date().getFullYear()} Mio SLOWFIRE — 不多做，只为你烤</p>
          </div>
        </div>
      </footer>
    </>
  );
}
