import debounce from 'lodash.debounce'
import shortid from 'shortid'
import React from 'react'

export default class MessageForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = this.createNewState()

    this.lazySubmit = debounce(this.submit, 80)
    this.lazyReset = debounce(this.reset, 2000)
  }

  createNewState = () => ({
    id: shortid.generate(),
    timestamp: Date.now(),
    lastText: '',
    text: ''
  })

  reset () {
    this.lazySubmit.cancel()
    this.setState(this.createNewState())
  }

  submit () {
    const text = this.state.text.trim()

    if (!text) return
    if (text === this.state.lastText) return

    if (this.props.onSubmit) {
      this.props.onSubmit({
        id: this.state.id,
        timestamp: this.state.timestamp,
        text
      })
    }

    this.setState({ lastText: text })
  }

  handleChange = (evt) => {
    this.setState({ text: evt.target.value })
    this.lazySubmit()
    this.lazyReset()
  }

  handleKeyDown = (evt) => {
    this.lazyReset()

    if (evt.key === 'Enter' && !evt.ctrlKey) {
      evt.preventDefault()
      evt.stopPropagation()

      this.setState({ text: evt.target.value })
      this.submit()
      this.reset()
    }
  }

  render () {
    return (
      <textarea
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.text} />
    )
  }
}
