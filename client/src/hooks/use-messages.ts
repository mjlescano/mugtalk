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

export default function useMessages ({
  talkId,
  client,
  talkReady
}: {
  talkId: string
  client: DeepstreamClient
  talkReady: boolean
}) {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map())

  const submitMessage = (message: Message) => {
    if (!client) throw new Error('Missing client')
    client.event.emit(`talk/${talkId}/message`, message as any)
  }

  useEffect(() => {
    if (talkReady === false) return

    const handleMessage = (data: unknown) => {
      const msg = data as Message
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
