import Link from 'next/link'
import nanoid from 'nanoid'

const Page = ({ randomId }) => (
  <>
    <div>MugTalk.</div>
    <p>
      <Link href={`/talk/${randomId}`}>
        <a>Start a Talk</a>
      </Link>
    </p>
  </>
)

Page.getInitialProps = async () => {
  const randomId = await nanoid()
  return { randomId }
}

export default Page
