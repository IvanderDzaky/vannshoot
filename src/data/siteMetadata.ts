export const siteMetadata = {
  title: process.env.NEXT_PUBLIC_SEO_TITLE || 'Tiba Tiba Ngoding',
  author: process.env.NEXT_PUBLIC_SEO_AUTHOR || 'Tiba Tiba Ngoding',
  description:
    process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
    'Sejak 2023, kami telah membantu berbagai bisnis mewujudkan visi digital mereka. Dengan dedikasi tinggi dan keahlian rekayasa perangkat lunak modern, kami menciptakan website premium, aplikasi kustom, dan solusi IT bisnis yang andal dan tepat sasaran.',
  language: process.env.NEXT_PUBLIC_SEO_LANGUAGE || 'id-ID',
  siteUrl: process.env.NEXT_PUBLIC_SEO_SITE_URL || '',
  socialBanner: '/assets/img/seo_twitter-card.jpg',
  email: process.env.NEXT_PUBLIC_SEO_EMAIL || '',
  instagram: process.env.NEXT_PUBLIC_SEO_INSTAGRAM || '',
  instagram_atomic: process.env.NEXT_PUBLIC_SEO_INSTAGRAM_ATOMIC || '',
  x: process.env.NEXT_PUBLIC_SEO_X || '',
  facebook: process.env.NEXT_PUBLIC_SEO_FACEBOOK || '',
  youtube: process.env.NEXT_PUBLIC_SEO_YOUTUBE || '',
  phone: process.env.NEXT_PUBLIC_SEO_PHONE || '',
  locale: process.env.NEXT_PUBLIC_SEO_LOCALE || 'id-ID',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
};
