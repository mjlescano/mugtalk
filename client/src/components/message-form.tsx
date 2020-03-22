import debounce from 'debounce-fn'
import React from 'react'
import { Message } from '../hooks/use-messages'

interface PropType {
  username: string
  onSubmit: (message: Message) => any
}

interface StateType {
  timestamp: number
  message: string
  lastMessage: string
}

const createNewState = () => ({
  timestamp: Date.now(),
  lastMessage: '',
  message: ''
})

export default class MessageForm extends React.Component<PropType, StateType> {
  state = createNewState()
  lazySubmit = debounce(this.submit, { wait: 80 })
  lazyReset = debounce(this.reset, { wait: 1600 })

  reset() {
    this.lazySubmit.cancel()
    this.setState(createNewState())
  }

  submit() {
    const text = this.state.message.trim()

    if (!text) return
    if (text === this.state.lastMessage) return

    if (this.props.onSubmit) {
      this.props.onSubmit({
        u: this.props.username,
        t: this.state.timestamp,
        m: text
      })
    }

    this.setState({ lastMessage: text })
  }

  handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
    this.setState({ message: evt.currentTarget.value })
    this.lazySubmit()
    this.lazyReset()
  }

  handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (evt) => {
    this.lazyReset()


    if (evt.key === 'Enter' && !evt.ctrlKey) {
      evt.preventDefault()
      evt.stopPropagation()

      this.setState({ message: evt.currentTarget.value })
      this.submit()
      this.reset()
    }
  }

  render() {
    return (
      <textarea
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.message}
      />
    )
  }
}
