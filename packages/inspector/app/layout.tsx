import { Roboto } from '@next/font/google';
import clsx from 'clsx';

import { AppLayout } from './components/AppLayout';

import './styles.css';

const roboto300 = Roboto({
  weight: '300',
});
const roboto400 = Roboto({
  weight: '400',
});
const roboto500 = Roboto({
  weight: '500',
});
const roboto700 = Roboto({
  weight: '700',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx(
        roboto300.className,
        roboto400.className,
        roboto500.className,
        roboto700.className
      )}
    >
      <head>
        <title>App Inspector</title>
        <meta
          name="viewport"
          content="initi
        al-scale=1, width=device-width"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>"
        ></link>
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
