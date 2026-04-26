import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "brand.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT,
    content TEXT NOT NULL DEFAULT '',
    imageUrl TEXT,
    sortOrder INTEGER DEFAULT 0,
    isVisible INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT,
    category TEXT DEFAULT '',
    featured INTEGER DEFAULT 0,
    sortOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    origin TEXT,
    imageUrl TEXT,
    sortOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS craft_steps (
    id TEXT PRIMARY KEY,
    stepNumber INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

const hasSections = db.prepare("SELECT COUNT(*) as c FROM sections").get().c;
if (hasSections === 0) {
  db.prepare(`INSERT INTO sections (id,key,title,subtitle,content,sortOrder) VALUES
    ('s1','hero','Mio SLOWFIRE','慢火窑烤面包','不多做，只为你烤。我们相信面团需要时间来苏醒。天然酵母在低温中缓慢生长十二小时，入窑后以果木慢火烘烤，麦香与焦香在两百度的黑暗中交融。每一炉，都有主人。',0),
    ('s2','craft','十二小时慢火工艺','从面团到窑烤的旅程','天然酵母、低温发酵、果木窑烤，每一步都不急于求成。',1),
    ('s3','products','本季窑烤','每一款都有主人','欧包、吐司、恰巴塔、贝果、软欧包。',2),
    ('s4','ingredients','原物料','好面包从好原料开始','法国T65面粉、天然鲁邦种、冲绳黑糖、核桃与无花果。',3),
    ('s5','contact','找到我们','中央窑烤，就近自提','深圳市福田区。预订请扫码关注公众号。',4)
  `).run();
}

const hasSteps = db.prepare("SELECT COUNT(*) as c FROM craft_steps").get().c;
if (hasSteps === 0) {
  db.prepare(`INSERT INTO craft_steps (id,stepNumber,title,description,duration) VALUES
    ('c1',1,'和面','法国T65面粉与天然鲁邦种混合，加入冰水慢速搅拌至面筋初步形成。','30分钟'),
    ('c2',2,'低温发酵','面团在4°C环境中沉睡十二小时，酵母缓慢呼吸，麦香开始苏醒。','12小时'),
    ('c3',3,'整形','面团从冰箱取出回温，手工折叠整形，每一次折叠都是与面团的对话。','2小时'),
    ('c4',4,'最终醒发','整形后的面团在温暖湿润的环境中做最后的呼吸，等待入窑。','1.5小时'),
    ('c5',5,'窑烤','果木窑预热至220°C，面团入窑后蒸汽充盈，十五分钟后焦香四溢。','20分钟')
  `).run();
}

const hasProducts = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
if (hasProducts === 0) {
  db.prepare(`INSERT INTO products (id,name,description,category,featured,sortOrder) VALUES
    ('p1','无花果核桃欧包','T65面粉、天然酵母、土耳其无花果、加州核桃。低糖低油，外脆内韧。','欧包',1,0),
    ('p2','日式生吐司','梦之力面粉、北海道牛乳、法国发酵黄油。如云朵般绵密柔软。','吐司',1,1),
    ('p3','橄榄恰巴塔','T65面粉、黑橄榄、迷迭香。大气孔、薄脆外壳、湿润内里。','恰巴塔',0,2),
    ('p4','海盐黄油贝果','高筋面粉、法国海盐、发酵黄油。表皮微脆，内里Q弹有嚼劲。','贝果',0,3),
    ('p5','芋泥软欧','高筋面粉、荔浦芋头、淡奶油。内馅绵密，面包体柔软拉丝。','软欧包',1,4)
  `).run();
}

const hasIngredients = db.prepare("SELECT COUNT(*) as c FROM ingredients").get().c;
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

const hasAdmin = db.prepare("SELECT COUNT(*) as c FROM admin_users").get().c;
if (hasAdmin === 0) {
  db.prepare("INSERT INTO admin_users (id,username,password) VALUES ('a1','admin','miobakery2024')").run();
}

export { db };
