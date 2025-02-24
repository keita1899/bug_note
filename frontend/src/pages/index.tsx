import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { ErrorMessage } from '@/components/utilities/ErrorMessage'
import { Loading } from '@/components/utilities/Loading'
import { fetcher } from '@/utils'

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetcher('http://localhost:3100/api/v1/hello'),
  })

  console.log(data)

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage />

  return (
    <Layout>
      <div></div>
    </Layout>
  )
}
