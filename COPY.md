# Mio SLOWFIRE 品牌官网 — 文案物料

> 自动提取自代码仓库
> 生成时间：2026/4/27 18:56:42

## server/api-handler.mjs

- ) { res.writeHead(204); res.end(); return; }

  try {
    // ── 前台只读 ──
    if (req.method === 
- ).all();
      return sendJson(res, 200, rows);
    }

    // ── 后台管理 ──
    if (req.method === 
- 账号或密码错误
- );

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
      const fields = Object.keys(patch).map(k => 

## server/db.mjs

- ).get().c;
if (hasSections === 0) {
  db.prepare(`INSERT INTO sections (id,key,title,subtitle,content,sortOrder) VALUES
    ('s1','hero','Mio SLOWFIRE','慢火窑烤面包','不多做，只为你烤。我们相信面团需要时间来苏醒。天然酵母在低温中缓慢生长十二小时，入窑后以果木慢火烘烤，麦香与焦香在两百度的黑暗中交融。每一炉，都有主人。',0),
    ('s2','craft','十二小时慢火工艺','从面团到窑烤的旅程','天然酵母、低温发酵、果木窑烤，每一步都不急于求成。',1),
    ('s3','products','本季窑烤','每一款都有主人','欧包、吐司、恰巴塔、贝果、软欧包。',2),
    ('s4','ingredients','原物料','好面包从好原料开始','法国T65面粉、天然鲁邦种、冲绳黑糖、核桃与无花果。',3),
    ('s5','contact','找到我们','中央窑烤，就近自提','深圳市福田区。预订请扫码关注公众号。',4)
  `).run();
}

const hasSteps = db.prepare(
- ).get().c;
if (hasSteps === 0) {
  db.prepare(`INSERT INTO craft_steps (id,stepNumber,title,description,duration) VALUES
    ('c1',1,'和面','法国T65面粉与天然鲁邦种混合，加入冰水慢速搅拌至面筋初步形成。','30分钟'),
    ('c2',2,'低温发酵','面团在4°C环境中沉睡十二小时，酵母缓慢呼吸，麦香开始苏醒。','12小时'),
    ('c3',3,'整形','面团从冰箱取出回温，手工折叠整形，每一次折叠都是与面团的对话。','2小时'),
    ('c4',4,'最终醒发','整形后的面团在温暖湿润的环境中做最后的呼吸，等待入窑。','1.5小时'),
    ('c5',5,'窑烤','果木窑预热至220°C，面团入窑后蒸汽充盈，十五分钟后焦香四溢。','20分钟')
  `).run();
}

const hasProducts = db.prepare(
- ).get().c;
if (hasProducts === 0) {
  db.prepare(`INSERT INTO products (id,name,description,category,featured,sortOrder) VALUES
    ('p1','无花果核桃欧包','T65面粉、天然酵母、土耳其无花果、加州核桃。低糖低油，外脆内韧。','欧包',1,0),
    ('p2','日式生吐司','梦之力面粉、北海道牛乳、法国发酵黄油。如云朵般绵密柔软。','吐司',1,1),
    ('p3','橄榄恰巴塔','T65面粉、黑橄榄、迷迭香。大气孔、薄脆外壳、湿润内里。','恰巴塔',0,2),
    ('p4','海盐黄油贝果','高筋面粉、法国海盐、发酵黄油。表皮微脆，内里Q弹有嚼劲。','贝果',0,3),
    ('p5','芋泥软欧','高筋面粉、荔浦芋头、淡奶油。内馅绵密，面包体柔软拉丝。','软欧包',1,4)
  `).run();
}

const hasIngredients = db.prepare(
- ).get().c;
if (hasIngredients === 0) {
  db.prepare(`INSERT INTO ingredients (id,name,description,origin,sortOrder) VALUES
    ('i1','法国T65面粉','传统石磨工艺，保留小麦胚芽与麸皮，麦香浓郁，是做欧包的灵魂。','法国',0),
    ('i2','天然鲁邦种','2019年培育至今，已历五年。每天喂养，菌群稳定，赋予面包独特酸香。','自培',1),
    ('i3','法国发酵黄油','乳酸发酵工艺，奶香醇厚，是生吐司绵密口感的来源。','法国诺曼底',2),
    ('i4','土耳其无花果','自然风干，不加糖渍。微甜带籽，与核桃是绝配。','土耳其',3),
    ('i5','冲绳黑糖','传统铁锅熬制，矿物质丰富，甜味温润不抢麦香。','日本冲绳',4),
    ('i6','荔浦芋头','广西荔浦，粉糯香甜。蒸熟后手工捣泥，保留颗粒感。','中国广西',5)
  `).run();
}

const hasAdmin = db.prepare(
- 慢火窑烤面包
- 不多做，只为你烤。我们相信面团需要时间来苏醒。天然酵母在低温中缓慢生长十二小时，入窑后以果木慢火烘烤，麦香与焦香在两百度的黑暗中交融。每一炉，都有主人。
- 十二小时慢火工艺
- 从面团到窑烤的旅程
- 天然酵母、低温发酵、果木窑烤，每一步都不急于求成。
- 本季窑烤
- 每一款都有主人
- 欧包、吐司、恰巴塔、贝果、软欧包。
- 原物料
- 好面包从好原料开始
- 法国T65面粉、天然鲁邦种、冲绳黑糖、核桃与无花果。
- 找到我们
- 中央窑烤，就近自提
- 深圳市福田区。预订请扫码关注公众号。
- 和面
- 法国T65面粉与天然鲁邦种混合，加入冰水慢速搅拌至面筋初步形成。
- 30分钟
- 低温发酵
- 面团在4°C环境中沉睡十二小时，酵母缓慢呼吸，麦香开始苏醒。
- 12小时
- 整形
- 面团从冰箱取出回温，手工折叠整形，每一次折叠都是与面团的对话。
- 2小时
- 最终醒发
- 整形后的面团在温暖湿润的环境中做最后的呼吸，等待入窑。
- 1.5小时
- 窑烤
- 果木窑预热至220°C，面团入窑后蒸汽充盈，十五分钟后焦香四溢。
- 20分钟
- 无花果核桃欧包
- T65面粉、天然酵母、土耳其无花果、加州核桃。低糖低油，外脆内韧。
- 欧包
- 日式生吐司
- 梦之力面粉、北海道牛乳、法国发酵黄油。如云朵般绵密柔软。
- 吐司
- 橄榄恰巴塔
- T65面粉、黑橄榄、迷迭香。大气孔、薄脆外壳、湿润内里。
- 恰巴塔
- 海盐黄油贝果
- 高筋面粉、法国海盐、发酵黄油。表皮微脆，内里Q弹有嚼劲。
- 贝果
- 芋泥软欧
- 高筋面粉、荔浦芋头、淡奶油。内馅绵密，面包体柔软拉丝。
- 软欧包
- 法国T65面粉
- 传统石磨工艺，保留小麦胚芽与麸皮，麦香浓郁，是做欧包的灵魂。
- 法国
- 天然鲁邦种
- 2019年培育至今，已历五年。每天喂养，菌群稳定，赋予面包独特酸香。
- 自培
- 法国发酵黄油
- 乳酸发酵工艺，奶香醇厚，是生吐司绵密口感的来源。
- 法国诺曼底
- 土耳其无花果
- 自然风干，不加糖渍。微甜带籽，与核桃是绝配。
- 土耳其
- 冲绳黑糖
- 传统铁锅熬制，矿物质丰富，甜味温润不抢麦香。
- 日本冲绳
- 荔浦芋头
- 广西荔浦，粉糯香甜。蒸熟后手工捣泥，保留颗粒感。
- 中国广西
- INSERT INTO sections (id,key,title,subtitle,content,sortOrder) VALUES
    ('s1','hero','Mio SLOWFIRE','慢火窑烤面包','不多做，只为你烤。我们相信面团需要时间来苏醒。天然酵母在低温中缓慢生长十二小时，入窑后以果木慢火烘烤，麦香与焦香在两百度的黑暗中交融。每一炉，都有主人。',0),
    ('s2','craft','十二小时慢火工艺','从面团到窑烤的旅程','天然酵母、低温发酵、果木窑烤，每一步都不急于求成。',1),
    ('s3','products','本季窑烤','每一款都有主人','欧包、吐司、恰巴塔、贝果、软欧包。',2),
    ('s4','ingredients','原物料','好面包从好原料开始','法国T65面粉、天然鲁邦种、冲绳黑糖、核桃与无花果。',3),
    ('s5','contact','找到我们','中央窑烤，就近自提','深圳市福田区。预订请扫码关注公众号。',4)
  
- INSERT INTO craft_steps (id,stepNumber,title,description,duration) VALUES
    ('c1',1,'和面','法国T65面粉与天然鲁邦种混合，加入冰水慢速搅拌至面筋初步形成。','30分钟'),
    ('c2',2,'低温发酵','面团在4°C环境中沉睡十二小时，酵母缓慢呼吸，麦香开始苏醒。','12小时'),
    ('c3',3,'整形','面团从冰箱取出回温，手工折叠整形，每一次折叠都是与面团的对话。','2小时'),
    ('c4',4,'最终醒发','整形后的面团在温暖湿润的环境中做最后的呼吸，等待入窑。','1.5小时'),
    ('c5',5,'窑烤','果木窑预热至220°C，面团入窑后蒸汽充盈，十五分钟后焦香四溢。','20分钟')
  
- INSERT INTO products (id,name,description,category,featured,sortOrder) VALUES
    ('p1','无花果核桃欧包','T65面粉、天然酵母、土耳其无花果、加州核桃。低糖低油，外脆内韧。','欧包',1,0),
    ('p2','日式生吐司','梦之力面粉、北海道牛乳、法国发酵黄油。如云朵般绵密柔软。','吐司',1,1),
    ('p3','橄榄恰巴塔','T65面粉、黑橄榄、迷迭香。大气孔、薄脆外壳、湿润内里。','恰巴塔',0,2),
    ('p4','海盐黄油贝果','高筋面粉、法国海盐、发酵黄油。表皮微脆，内里Q弹有嚼劲。','贝果',0,3),
    ('p5','芋泥软欧','高筋面粉、荔浦芋头、淡奶油。内馅绵密，面包体柔软拉丝。','软欧包',1,4)
  
- INSERT INTO ingredients (id,name,description,origin,sortOrder) VALUES
    ('i1','法国T65面粉','传统石磨工艺，保留小麦胚芽与麸皮，麦香浓郁，是做欧包的灵魂。','法国',0),
    ('i2','天然鲁邦种','2019年培育至今，已历五年。每天喂养，菌群稳定，赋予面包独特酸香。','自培',1),
    ('i3','法国发酵黄油','乳酸发酵工艺，奶香醇厚，是生吐司绵密口感的来源。','法国诺曼底',2),
    ('i4','土耳其无花果','自然风干，不加糖渍。微甜带籽，与核桃是绝配。','土耳其',3),
    ('i5','冲绳黑糖','传统铁锅熬制，矿物质丰富，甜味温润不抢麦香。','日本冲绳',4),
    ('i6','荔浦芋头','广西荔浦，粉糯香甜。蒸熟后手工捣泥，保留颗粒感。','中国广西',5)
  

## src/pages/AdminWorkshop.tsx

- 官网板块
- 产品
- 原物料
- 工艺
- 账号或密码错误
- 账号
- 密码
- 登录中...
- 进入工作台
- >默认账号: admin / miobakery2024</p>
        <a href=
- >← 返回官网</a>
      </div>
    </div>
  );
}

// ── Sections Panel ──
function SectionsPanel() {
  const [items, setItems] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
- 显示中
- 已隐藏
- 标题
- 副标题
- 内容
- 图片 URL（可选）
- 确定删除？
- 产品名称
- 欧包
- 名称
- 分类
- 主推
- 普通
- 描述
- 原料名称
- 产地
- 时长
- 图片 URL
- , { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await fetch(
- , { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    refresh();
  };

  const del = async (id: string) => { if (!confirm("确定删除？")) return; await fetch(

## src/pages/BrandPage.tsx

- >工艺</a>
            <a href=
- >产品</a>
            <a href=
- >原物料</a>
            <a href=
- >联系</a>
          </nav>
          <button onClick={() => go(
- 慢火窑烤面包
- >
                了解工艺
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section id=
- 工艺
- 十二小时慢火工艺
- 产品
- 本季窑烤
- >查看全部 {products.length} 款面包</button>
            </div>
          )}
        </div>
      </section>

      {/* Ingredients */}
      <section id=
- 原物料
- 好面包从好原料开始
- 找到我们
- >工艺</a>
                <a href=
- >产品</a>
                <a href=
- >内容管理后台</button>
                <a href=

## src/stores/appStore.ts

- 加载失败

