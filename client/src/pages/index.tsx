import Link from 'next/link'
import nanoid from 'nanoid'
import Layout from '../components/layout'
import useAsyncValue from '../hooks/use-async-value'

export default function Page () {
  const randomId = useAsyncValue(nanoid)

  return (
    <Layout>
      <div>MugTalk.</div>
      <p>
        {randomId !== null && (
          <Link href={`/talk/${randomId}`}>
            <a>Start a Talk</a>
          </Link>
        )}
      </p>
    </Layout>
  )
}
