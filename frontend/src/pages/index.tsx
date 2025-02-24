import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { Error } from '@/components/utilities/Error'
import { Loading } from '@/components/utilities/Loaing'
import { fetcher } from '@/utils'

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetcher('http://localhost:3100/api/v1/hello'),
  })

  console.log(data)

  if (isLoading) return <Loading />
  if (error) return <Error />

  return (
    <Layout>
      <div></div>
    </Layout>
  )
}
