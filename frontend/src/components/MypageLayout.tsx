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
      <div className="flex flex-1 p-6">
        <div className="w-64 rounded-md bg-white p-4 shadow-lg">
          <ul className="menu p-2 font-bold">
            <li className={isActive('/mypage') ? 'text-primary' : ''}>
              <Link href="/mypage">バグ</Link>
            </li>
            <li className={isActive('/mypage/follows') ? 'text-primary' : ''}>
              <Link href="/mypage/follows">フォロー・フォロワー</Link>
            </li>
            <li className={isActive('/mypage/profile') ? 'text-primary' : ''}>
              <Link href="">プロフィール</Link>
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

        <main className="mx-auto flex-1 p-4 md:max-w-4xl lg:max-w-3xl">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
