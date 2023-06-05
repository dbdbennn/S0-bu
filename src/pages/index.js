import { Inter } from 'next/font/google'
import StartPage from './startpage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <StartPage />
  )
}
