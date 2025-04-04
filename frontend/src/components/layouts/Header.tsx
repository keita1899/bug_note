import Image from 'next/image'
import Link from 'next/link'
import { FaPen } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export const Header = () => {
  const { currentUser, isFetched, isAuthenticated, signout } = useAuth()
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
                    <div className="w-10 rounded-full">
                      <Image
                        src={
                          currentUser?.imageUrl || '/images/default-avatar.png'
                        }
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <span className="border-b font-bold">
                        {currentUser?.name}
                      </span>
                    </li>
                    <li>
                      <Link href="/mypage" className="justify-between">
                        マイページ
                      </Link>
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
