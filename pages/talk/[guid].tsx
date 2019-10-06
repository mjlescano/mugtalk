import dynamic from 'next/dynamic'
import Link from 'next/link'
import useClient, { CONNECTION_STATE } from '../../hooks/use-client'
import useTalk from '../../hooks/use-talk'

const CurrentUser = dynamic(() => import('../../components/current-user'), {
  ssr: false
})

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

const Page = ({ guid }) => {
  const { clientState, currentUser } = useClient()
  const { users } = useTalk(guid)
  // if (this.state.recordReady === false) {
  //   return <div>Loading conversations...</div>
  // }

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
        <strong>Talk:</strong> {guid}
      </div>
      <div>
        <strong>Status:</strong> {getClientStateTitle(clientState)}
      </div>
      <br />
      <div>
        <strong>Users:</strong>
      </div>
      <ul>
        {Object.values(users).map(({ username }) => (
          <li key={username}>{username}</li>
        ))}
      </ul>
    </>
  )
}

Page.getInitialProps = ({ query }) => {
  return { guid: query.guid }
}

export default Page
