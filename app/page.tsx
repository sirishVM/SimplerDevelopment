import { generateSEO } from '@/lib/utils/seo';
import { getFeaturedBlogPosts } from '@/lib/actions/blog';
import { HomeClient } from './(pages)/HomeClient';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateSoftwareApplicationSchema, generateWebSiteWithSearchActionSchema } from '@/lib/utils/structured-data';

export const metadata = generateSEO({
  title: 'All-in-One Intelligent Business Operating System',
  description: 'Run your whole business on Hatrio — websites, CRM, an AI brain, email, bookings & billing in one unified, intelligent platform.',
  path: '/',
});

export default async function HomePage() {
  // Pull the 3 most recent real blog posts from the DB so the "From the Blog"
  // cards link to live slugs. (Previously HomeClient read a stale static file
  // whose slugs 404'd.)
  const recentPosts = await getFeaturedBlogPosts();
  const homepageJsonLd = [
    generateSoftwareApplicationSchema(),
    generateWebSiteWithSearchActionSchema(),
  ];
  return (
    <>
      <StructuredData data={homepageJsonLd} />
      <HomeClient recentPosts={recentPosts} />
    </>
  );
}
