import debounce from 'lodash.debounce'
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

export default class MessageForm extends React.Component<PropType, StateType> {
  lazySubmit: debounce
  lazyReset: debounce

  constructor(props) {
    super(props)

    this.state = this.createNewState()

    this.lazySubmit = debounce(this.submit, 80)
    this.lazyReset = debounce(this.reset, 1600)
  }

  createNewState = () => ({
    timestamp: Date.now(),
    lastMessage: '',
    message: ''
  })

  reset() {
    this.lazySubmit.cancel()
    this.setState(this.createNewState())
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

  handleChange = (evt) => {
    this.setState({ message: evt.target.value })
    this.lazySubmit()
    this.lazyReset()
  }

  handleKeyDown = (evt) => {
    this.lazyReset()

    if (evt.key === 'Enter' && !evt.ctrlKey) {
      evt.preventDefault()
      evt.stopPropagation()

      this.setState({ message: evt.target.value })
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
