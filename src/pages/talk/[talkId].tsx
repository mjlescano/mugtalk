import Link from 'next/link'
import useClient, { CONNECTION_STATE } from '../../hooks/use-client'
import useTalk from '../../hooks/use-talk'
import useMessages from '../../hooks/use-messages'
import MessageForm from '../../components/message-form'
import map from '../../lib/map'

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
  const { client, isOnline, clientState, currentUser } = useClient()
  const { users, talkReady } = useTalk({
    talkId,
    client,
    currentUser,
    isOnline
  })
  const { messages, submitMessage } = useMessages({ talkId, client, talkReady })

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
      {talkReady && (
        <>
          <div>
            <strong>Users:</strong>
          </div>
          <ul>
            {Object.values(users).map(({ username }) => (
              <li key={username}>{username}</li>
            ))}
          </ul>
        </>
      )}
      {messages.size > 0 && (
        <>
          <div>
            <strong>Messages:</strong>
          </div>
          <ul>
            {map(messages, ([key, msg]) => (
              <li key={key}>{msg.m}</li>
            ))}
          </ul>
        </>
      )}
      {talkReady && (
        <MessageForm username={currentUser.username} onSubmit={submitMessage} />
      )}
    </>
  )
}

Page.getInitialProps = ({ query }) => {
  return { talkId: query.talkId }
}

export default Page
