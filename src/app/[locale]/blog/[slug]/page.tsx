'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getBlogPost } from '@/data/blog-posts';
import { notFound } from 'next/navigation';

const topicLabels: Record<string, { en: string; 'zh-CN': string; 'zh-TW': string }> = {
  maintenance: { en: 'Maintenance', 'zh-CN': '维护', 'zh-TW': '維護' },
  costs: { en: 'Costs & Savings', 'zh-CN': '成本与节省', 'zh-TW': '成本與節省' },
  'how-to': { en: 'How-To', 'zh-CN': '操作指南', 'zh-TW': '操作指南' },
  local: { en: 'Local North Shore', 'zh-CN': '本地北岸', 'zh-TW': '本地北岸' },
  installer: { en: 'Installer Stories', 'zh-CN': '安装商故事', 'zh-TW': '安裝商故事' },
  faq: { en: 'FAQ', 'zh-CN': '常见问题', 'zh-TW': '常見問題' },
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = useLocale() as 'en' | 'zh-CN' | 'zh-TW';
  const post = getBlogPost(params.slug, locale);

  if (!post) {
    notFound();
  }

  const title = post.title[locale];
  const content = post.content[locale];
  const topic = topicLabels[post.topic]?.[locale] || post.topic;
  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/${locale}`}>
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}/blog`} className="text-emerald-600 font-medium text-sm">
              {locale === 'en' ? 'Back to Blog' : locale === 'zh-CN' ? '返回博客' : '返回博客'}
            </Link>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
            {locale === 'en'
              ? 'Get Quote'
              : locale === 'zh-CN'
                ? '获取报价'
                : '獲取報價'}
          </button>
        </div>
      </nav>

      {/* Article Header */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          {/* Topic Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full">
              {topic}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author}</span>
            </div>
            <div>
              <time dateTime={post.date}>{formattedDate}</time>
            </div>
            <div>
              {locale === 'en'
                ? `${post.readTime} min read`
                : locale === 'zh-CN'
                  ? `${post.readTime} 分钟阅读`
                  : `${post.readTime} 分鐘閱讀`}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-20">
        <article className="max-w-3xl mx-auto px-4 prose prose-lg max-w-none">
          <div className="prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold">
            {/* Render markdown-like content. For production, use a markdown parser like react-markdown or MDX */}
            <div
              dangerouslySetInnerHTML={{
                __html: content
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
                    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
                    if (line === '') return '<br />';
                    return `<p>${line}</p>`;
                  })
                  .join('\n'),
              }}
              className="space-y-4"
            />
          </div>
        </article>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'en'
              ? 'Ready to Get Started?'
              : locale === 'zh-CN'
                ? '准备好开始了吗？'
                : '準備好開始了嗎？'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'en'
              ? "Connect with North Shore heat pump experts for a free quote."
              : locale === 'zh-CN'
                ? '与北岸热泵专家联系，获取免费报价。'
                : '與北岸熱泵專家聯絡，獲取免費報價。'}
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition">
            {locale === 'en'
              ? 'Get Free Quote'
              : locale === 'zh-CN'
                ? '获取免费报价'
                : '獲取免費報價'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 HeatMatch. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
