import { User } from '../hooks/use-client'

export default ({ currentUser }: { currentUser: User }) => (
  <>
    <strong>UserId:</strong> {currentUser && currentUser.username}
  </>
)
