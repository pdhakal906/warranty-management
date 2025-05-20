// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@/app/globals.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps, Box } from '@mantine/core';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Warranty Management',
  description: 'Warranty Management',
  icons: {
    icon: '/hammer.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box style={{ display: 'flex', flex: 1 }}>
              <Box style={{ width: '120px', borderRight: '1px solid #eee' }}>
                <Sidebar />
              </Box>
              <Box style={{ flex: 1, padding: '20px' }}>
                {children}
              </Box>
            </Box>
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}