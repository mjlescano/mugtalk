import Link from 'next/link'
import useClient, { CONNECTION_STATE } from '../../hooks/use-client'
import useTalk from '../../hooks/use-talk'

const getClientStateTitle = (clientState: CONNECTION_STATE) => {
  switch (clientState) {
    case 'INITIALIZING':
      return 'Initializing...'
    case 'CONNECTING':
      return 'Connecting...'
    case 'ONLINE':
      return 'Online'
    case 'OFFLINE':
      return 'Offline'
    case 'ERROR':
      return 'Error'
  }
}

const Page = ({ talkId }) => {
  const { clientState } = useClient()
  const { users } = useTalk(talkId)

  return (
    <>
      <div>
        <Link href="/">
          <a>
            <sub>← Back</sub>
          </a>
        </Link>
      </div>
      <br />
      <div>
        <strong>Talk:</strong> {talkId}
      </div>
      <div>
        <strong>Status:</strong> {getClientStateTitle(clientState)}
      </div>
      <br />
      <div>
        <strong>Users:</strong>
      </div>
      <ul>
        {Object.values(users).map(({ id }) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </>
  )
}

Page.getInitialProps = ({ query }) => {
  return { talkId: query.talkId }
}

export default Page
