import Link from 'next/link'
import { FaPen } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export const Header = () => {
  const { isFetched, isAuthenticated, signout } = useAuth()
  return (
    <div className="navbar bg-base-100 shadow-xl">
      <div className="flex-1">
        <Link href="/bugs" className="btn btn-ghost text-xl">
          Bug Note
        </Link>
      </div>
      <div className="flex-none">
        {isFetched && (
          <>
            {isAuthenticated ? (
              <>
                <Link href="/bugs/new">
                  <button className="btn btn-circle btn-ghost">
                    <FaPen className="text-xl text-primary" />
                  </button>
                </Link>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="avatar btn btn-circle btn-ghost"
                  >
                    <div className="w-10 rounded-full"></div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <Link href="/mypage" className="justify-between">
                        マイページ
                      </Link>
                    </li>
                    <li>
                      <a>設定</a>
                    </li>
                    <li>
                      <button onClick={signout}>ログアウト</button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link href="/auth/signup">新規登録</Link>
                </li>
                <li>
                  <Link href="/auth/signin">ログイン</Link>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
