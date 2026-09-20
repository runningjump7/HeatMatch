'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { getAllBlogPosts } from '@/data/blog-posts';

const topicLabels: Record<string, { en: string; 'zh-CN': string; 'zh-TW': string }> = {
  maintenance: { en: 'Maintenance', 'zh-CN': '维护', 'zh-TW': '維護' },
  costs: { en: 'Costs & Savings', 'zh-CN': '成本与节省', 'zh-TW': '成本與節省' },
  'how-to': { en: 'How-To', 'zh-CN': '操作指南', 'zh-TW': '操作指南' },
  local: { en: 'Local North Shore', 'zh-CN': '本地北岸', 'zh-TW': '本地北岸' },
  installer: { en: 'Installer Stories', 'zh-CN': '安装商故事', 'zh-TW': '安裝商故事' },
  faq: { en: 'FAQ', 'zh-CN': '常见问题', 'zh-TW': '常見問題' },
};

export default function BlogPage() {
  const locale = useLocale() as 'en' | 'zh-CN' | 'zh-TW';
  const t = useTranslations();
  const posts = getAllBlogPosts(locale);

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/${locale}`}>
            <img src="/icons/heatmatch-logo.svg" alt="HeatMatch" className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}#how-it-works`} className="text-gray-600 hover:text-gray-900 text-sm">
              {t('nav.howItWorks')}
            </Link>
            <Link href={`/${locale}#coverage`} className="text-gray-600 hover:text-gray-900 text-sm">
              {t('nav.coverage')}
            </Link>
            <Link href={`/${locale}/blog`} className="text-emerald-600 font-medium text-sm">
              Blog
            </Link>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition">
            {t('nav.getQuote')}
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? 'HeatMatch Blog' : locale === 'zh-CN' ? '热匹配博客' : '熱匹配博客'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {locale === 'en'
              ? 'Learn about heat pumps, installation tips, and get advice from North Shore experts.'
              : locale === 'zh-CN'
                ? '了解热泵、安装提示，并获得北岸专家的建议。'
                : '了解熱泵、安裝提示，並獲得北岸專家的建議。'}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {locale === 'en'
                  ? 'No posts yet. Check back soon!'
                  : locale === 'zh-CN'
                    ? '暂无文章。敬请期待！'
                    : '暫無文章。敬請期待！'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = post.title[locale];
                const excerpt = post.excerpt[locale];
                const topic = topicLabels[post.topic]?.[locale] || post.topic;

                return (
                  <Link
                    key={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-300 hover:shadow-lg transition"
                  >
                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="bg-emerald-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-xs font-semibold text-emerald-700">
                          {locale === 'en' ? 'Featured' : locale === 'zh-CN' ? '精选' : '精選'}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Topic Tag */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          {topic}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition line-clamp-2">
                        {title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                        <span>
                          {locale === 'en'
                            ? `${post.readTime} min read`
                            : locale === 'zh-CN'
                              ? `${post.readTime} 分钟阅读`
                              : `${post.readTime} 分鐘閱讀`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {locale === 'en'
              ? 'Ready to Get a Heat Pump?'
              : locale === 'zh-CN'
                ? '准备好安装热泵了吗？'
                : '準備好安裝熱泵了嗎？'}
          </h2>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition">
            {locale === 'en'
              ? 'Get a Free Quote'
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
