import type { Metadata } from 'next';
import { Onest, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Imagine. Build. Launch. | Agence F+',
  description:
    'A communication, AI, development and digital strategy agency. We imagine, build and launch your bespoke digital projects.',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/favicon-192.png' }],
  },
  openGraph: {
    title: 'Imagine. Build. Launch. | Agence F+',
    description:
      'A communication, AI, development and digital strategy agency. We imagine, build and launch your bespoke digital projects.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${onest.variable} ${ibmPlexSans.variable} js reveals-armed lenis`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
              window.addEventListener('beforeunload', function() {
                window.scrollTo(0, 0);
              });
              window.addEventListener('unload', function() {
                window.scrollTo(0, 0);
              });
              try {
                if (localStorage.getItem('fplus-theme') === 'light') {
                  document.documentElement.classList.add('theme-light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
