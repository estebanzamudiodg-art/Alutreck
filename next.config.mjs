/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite servir imágenes desde Supabase Storage.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
