import { useState, useEffect } from 'react'
import { DeepstreamClient } from '@deepstream/client'

export interface Message {
  /** Username of the author */
  u: string
  /** Timestamp number of the message */
  t: number
  /** Message text */
  m: string
}

const useMessages = ({
  talkId,
  client,
  talkReady
}: {
  talkId: string
  client: DeepstreamClient
  talkReady: boolean
}) => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map())

  const submitMessage = (message: Message) => {
    client.event.emit(`talk/${talkId}/message`, message as any)
  }

  useEffect(() => {
    if (talkReady === false) return

    const handleMessage = (message) => {
      const msg: Message = message
      const key = `${msg.t}/${msg.u}`

      // Limit the amount of messages to 250
      if (!messages.has(key) && messages.size === 250) {
        messages.delete(messages.keys().next().value)
      }

      messages.set(key, msg)

      setMessages(new Map(messages))
    }

    setTimeout(() => {
      client.event.subscribe(`talk/${talkId}/message`, handleMessage)
    }, 500)

    return () => {
      client.event.unsubscribe(`talk/${talkId}/message`, handleMessage)
    }
  }, [talkReady])

  return { messages, submitMessage }
}

export default useMessages
