import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { DeleteModal } from '@/components/utilities/DeleteModal'
import LikeButton from '@/components/utilities/LikeButton'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Bug } from '@/features/bugs/types/Bug'
import { BugSection } from '@/features/bugs/ui/BugSection'
import { BugStatus } from '@/features/bugs/ui/BugStatus'
import { EnvironmentTable } from '@/features/bugs/ui/EnvironmentTable'
import { TagList } from '@/features/bugs/ui/TagList'
import { CommnetForm } from '@/features/comment/components/CommentForm'
import { CommentList } from '@/features/comment/components/CommentList'
import { CommentFormData } from '@/features/comment/types/CommnetFormData'
import { useAuth } from '@/hooks/useAuth'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const BugDetail = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { id } = router.query
  const { currentUser, isAuthenticated } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: bug, isPending } = useQuery<Bug>({
    queryKey: ['bug', id],
    queryFn: () => fetcher(API_URLS.BUG.SHOW(String(id))),
    enabled: !!id,
  })

  const deleteBugMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await axios.delete(API_URLS.BUG.DELETE(id), {
          headers: getAuthHeaders() ?? {},
        })
        return res.data
      } catch (error) {
        throw new Error('削除に失敗しました')
      }
    },
    onSuccess: (data) => {
      toast.success(data.message)
      router.push('/bugs')
    },
    onError: () => toast.error('削除に失敗しました'),
  })

  const handleDeleteBug = () => {
    if (id) {
      deleteBugMutation.mutate(String(id))
    }
  }

  const likeMutation = useMutation({
    mutationFn: async ({
      bugId,
      isLiked,
    }: {
      bugId: string
      isLiked: boolean
    }) => {
      if (isLiked) {
        const response = await axios.delete(API_URLS.BUG.LIKE.DELETE(bugId), {
          headers: getAuthHeaders(),
        })
        return response.data
      } else {
        const response = await axios.post(
          API_URLS.BUG.LIKE.CREATE(bugId),
          {},
          {
            headers: getAuthHeaders(),
          },
        )
        return response.data
      }
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ['bug', id],
      })
    },
    onError: (error) => {
      console.error('Error toggling like:', error)
    },
  })

  const commentMutation = useMutation({
    mutationFn: async (content: CommentFormData) => {
      try {
        const res = await axios.post(
          API_URLS.BUG.COMMENT.CREATE(String(id)),
          content,
          { headers: getAuthHeaders() ?? {} },
        )
        return res.data
      } catch (error) {
        throw new Error('コメントの送信に失敗しました')
      }
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ['bug', id],
      })
    },
    onError: () => toast.error('コメントの送信に失敗しました'),
  })

  const handleCommentSubmit: SubmitHandler<CommentFormData> = (data) => {
    if (!isAuthenticated) {
      toast.error('ログインしてください')
    }
    commentMutation.mutate(data)
  }

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const res = await axios.delete(
          API_URLS.BUG.COMMENT.DELETE(String(id), commentId),
          {
            headers: getAuthHeaders() ?? {},
          },
        )
        return res.data
      } catch (error) {
        throw new Error('コメントの削除に失敗しました')
      }
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ['bug', id],
      })
    },
    onError: () => toast.error('コメントの削除に失敗しました'),
  })

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId)
  }

  const handleToggleLike = (bugId: string, isLiked: boolean) => {
    likeMutation.mutate({ bugId, isLiked })
  }

  return (
    <Layout>
      {isPending ? (
        <Loading />
      ) : bug ? (
        <div className="mx-auto max-w-4xl p-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {currentUser?.id === bug.user.id && (
                <BugStatus isSolved={bug.isSolved} status={bug.status} />
              )}
              <p className="text-right text-sm text-gray-500">{`${bug?.fromToday} に投稿`}</p>
              <h2 className="card-title text-3xl">{bug?.title}</h2>
              <TagList tags={bug.tags} />
              <div className="my-4 space-y-20">
                <EnvironmentTable environments={bug?.environments || []} />
                <BugSection
                  title="エラーメッセージ"
                  content={bug?.errorMessage}
                />
                <BugSection title="エラー内容" content={bug?.content} />
                <BugSection
                  title="やりたいこと"
                  content={bug?.expectedBehavior}
                />
                <BugSection title="試したこと">
                  <ul>
                    {bug?.attempts?.map((attempt, index) => (
                      <li key={index} className="mb-2">
                        <p>{attempt.content}</p>
                      </li>
                    ))}
                  </ul>
                </BugSection>
                <BugSection title="解決方法" content={bug?.solution} />
                <BugSection title="原因" content={bug?.cause} />
                <BugSection title="参考リンク">
                  <ul>
                    {bug?.references?.map((reference, index) => (
                      <li key={index} className="mb-2">
                        <a
                          href={reference.url}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                          rel="noreferrer"
                        >
                          {reference.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BugSection>
                <BugSection title="その他" content={bug?.etc} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/users/${bug.user.id}`}>
                    <Image
                      src={bug.user.imageUrl || '/images/default-avatar.png'}
                      alt={`${bug.user.nickname}のアバター`}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                  </Link>
                  <Link
                    href={`/users/${bug.user.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    {bug.user.nickname}
                  </Link>
                </div>
                <LikeButton
                  bugId={bug.id}
                  likeCount={bug.likeCount}
                  isLiked={bug.isLiked}
                  isLoading={likeMutation.isPending}
                  onToggleLike={handleToggleLike}
                />
              </div>

              {bug?.user.id === currentUser?.id && (
                <div className="mt-10 flex justify-end gap-2">
                  <button
                    className="btn bg-black px-10 text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    削除
                  </button>
                  <button className="btn btn-primary px-10">
                    <Link href={`/bugs/${bug.id}/edit`}>編集</Link>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="card mt-6 bg-base-100 shadow-lg">
            <div className="card-body">
              <CommentList
                comments={bug.comments}
                onDelete={handleDeleteComment}
              />
              <CommnetForm onSubmit={handleCommentSubmit} />
            </div>
          </div>
        </div>
      ) : (
        <NoData />
      )}
      {isModalOpen && (
        <DeleteModal
          title="本当に削除しますか？"
          description="削除すると復元できません"
          onClose={() => setIsModalOpen(false)}
          onClick={handleDeleteBug}
        />
      )}
    </Layout>
  )
}
export default BugDetail
