export interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; 'zh-CN': string; 'zh-TW': string };
  excerpt: { en: string; 'zh-CN': string; 'zh-TW': string };
  content: { en: string; 'zh-CN': string; 'zh-TW': string };
  author: string;
  date: string;
  topic: 'maintenance' | 'costs' | 'how-to' | 'local' | 'installer' | 'faq';
  readTime: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'sample-post',
    slug: 'what-is-a-heat-pump',
    title: {
      en: 'What is a Heat Pump? A Complete Guide for North Shore Homeowners',
      'zh-CN': '什么是热泵？北岸房主的完整指南',
      'zh-TW': '什麼是熱泵？北岸房主的完整指南',
    },
    excerpt: {
      en: 'Confused about heat pumps? Learn how they work, their benefits, and whether one is right for your home.',
      'zh-CN': '对热泵感到困惑？了解它们的工作原理、优势以及是否适合您的家。',
      'zh-TW': '對熱泵感到困惑？了解它們的工作原理、優勢以及是否適合您的家。',
    },
    content: {
      en: `# What is a Heat Pump?

A heat pump is a heating and cooling system that transfers heat from outside air into your home (or vice versa in summer). Unlike traditional heaters that burn fuel, heat pumps are energy-efficient and environmentally friendly.

## How They Work

Heat pumps use a refrigerant cycle to move heat from a cooler area to a warmer one. Even on cold days, there's heat energy in the air that the system can extract and use.

### Key Advantages
- **Energy Efficient** — Can reduce heating costs by 50–70% compared to electric heaters
- **Year-Round Comfort** — Provides heating in winter and cooling in summer
- **Environmentally Friendly** — Lower carbon footprint than traditional systems
- **Quiet Operation** — Modern units are much quieter than older systems
- **Government Rebates** — Many New Zealand homeowners qualify for subsidies

## Is it Right for You?

Heat pumps work well in most climates, including Auckland's North Shore. They're especially effective if you:
- Currently use electric heating
- Want to reduce energy bills
- Are building or renovating
- Qualify for government incentives

## Next Steps

If you're considering a heat pump, contact local North Shore installers for a free quote. They can assess your home and recommend the best system for your needs.`,
      'zh-CN': `# 什么是热泵？

热泵是一种加热和冷却系统，可以将热量从室外空气转移到您的家中（或在夏季反之）。与燃烧燃料的传统加热器不同，热泵能源效率高且环保。

## 它们如何工作

热泵使用制冷剂循环将热量从较冷的区域转移到较暖的区域。即使在寒冷的日子，空气中也有可以提取和使用的热能。

### 主要优势
- **能源效率高** — 与电加热器相比，可将供暖成本降低 50-70%
- **全年舒适** — 在冬季提供加热，在夏季提供冷却
- **环保** — 碳足迹低于传统系统
- **安静运行** — 现代装置的运行比旧系统安静得多
- **政府补助** — 许多新西兰房主符合补贴条件

## 它适合你吗？

热泵在大多数气候中都能很好地工作，包括奥克兰北岸。如果您符合以下条件，它们特别有效：
- 目前使用电加热
- 想要降低能源账单
- 正在建造或装修
- 符合政府激励条件

## 下一步

如果您正在考虑安装热泵，请联系本地北岸安装商获取免费报价。他们可以评估您的家并推荐最适合您需求的系统。`,
      'zh-TW': `# 什麼是熱泵？

熱泵是一種加熱和冷卻系統，可以將熱量從室外空氣轉移到您的家中（或在夏季反之）。與燃燒燃料的傳統加熱器不同，熱泵能源效率高且環保。

## 它們如何工作

熱泵使用製冷劑循環將熱量從較冷的區域轉移到較暖的區域。即使在寒冷的日子，空氣中也有可以提取和使用的熱能。

### 主要優勢
- **能源效率高** — 與電加熱器相比，可將供暖成本降低 50-70%
- **全年舒適** — 在冬季提供加熱，在夏季提供冷卻
- **環保** — 碳足跡低於傳統系統
- **安靜運行** — 現代裝置的運行比舊系統安靜得多
- **政府補助** — 許多紐西蘭房主符合補貼條件

## 它適合你嗎？

熱泵在大多數氣候中都能很好地工作，包括奧克蘭北岸。如果您符合以下條件，它們特別有效：
- 目前使用電加熱
- 想要降低能源賬單
- 正在建造或裝修
- 符合政府激勵條件

## 下一步

如果您正在考慮安裝熱泵，請聯絡本地北岸安裝商獲取免費報價。他們可以評估您的家並推薦最適合您需求的系統。`,
    },
    author: 'HeatMatch',
    date: '2026-09-20',
    topic: 'how-to',
    readTime: 5,
    featured: true,
  },
];

export function getBlogPost(slug: string, locale: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts(locale: string): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
