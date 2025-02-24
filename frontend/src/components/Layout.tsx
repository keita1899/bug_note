import { ReactNode } from 'react'
import { Footer } from './layouts/Footer'
import { Header } from './layouts/Header'

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  )
}
