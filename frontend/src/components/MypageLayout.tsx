import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Footer } from './layouts/Footer'
import { Header } from './layouts/Header'

export const MypageLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const isActive = (path: string) => router.pathname === path

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Header />
      <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row">
        <main className="w-full md:order-2 md:max-w-5xl lg:max-w-6xl">
          {children}
        </main>

        <div className="w-full rounded-md bg-white p-4 shadow-lg md:order-1 md:w-64">
          <ul className="menu flex flex-col p-2 font-bold">
            <li className={isActive('/mypage') ? 'text-primary' : ''}>
              <Link href="/mypage">バグ</Link>
            </li>
            <li className={isActive('/mypage/follows') ? 'text-primary' : ''}>
              <Link href="/mypage/follows">フォロー・フォロワー</Link>
            </li>
            <li className={isActive('/mypage/profile') ? 'text-primary' : ''}>
              <Link href="/mypage/profile">プロフィール</Link>
            </li>
            <li
              className={
                isActive('/mypage/password-change') ? 'text-primary' : ''
              }
            >
              <Link href="/mypage/password-change">パスワード変更</Link>
            </li>
            <li className={isActive('/mypage/email') ? 'text-primary' : ''}>
              <Link href="">メールアドレス変更</Link>
            </li>
            <li
              className={
                isActive('/mypage/account-delete') ? 'text-primary' : ''
              }
            >
              <Link href="/mypage/account-delete">アカウント削除</Link>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}
