import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flashcards-g7.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/cards', '/new', '/progress', '/study/review', '/study/quiz'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
