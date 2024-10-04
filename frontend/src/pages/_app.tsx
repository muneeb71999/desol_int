import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <div className={` ${inter.className}`}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  </div>
}
