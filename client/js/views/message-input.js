import debounce from 'mout/function/debounce'
import shortid from 'shortid'
import React from 'react'
import Component from './component'

function generateId() {
  return `${shortid.generate()}-${Date.now()}`
}

class Textarea extends Component {
  constructor (props) {
    super(props)

    this.state = {
      id: generateId(),
      lastValue: '',
      value: ''
    }

    this._bind('handleChange', 'handleKeyDown')

    this.lazySubmit = debounce(this.submit, 80)
    this.lazyReset = debounce(this.reset, 1500)
  }

  reset () {
    this.lazySubmit.cancel()

    this.setState({
      id: generateId(),
      lastValue: '',
      value: ''
    })
  }

  submit () {
    const value = this.state.value.trim()

    if (!value) return
    if (value === this.state.lastValue) return

    if (this.props.onSubmit) this.props.onSubmit({
      id: this.state.id,
      text: value
    })

    this.setState({ lastValue: value })
  }

  handleChange (evt) {
    this.setState({ value: event.target.value })
    this.lazySubmit()
    this.lazyReset()
  }

  handleKeyDown (evt) {
    if (evt.key === 'Enter' && !evt.ctrlKey) {
      evt.preventDefault()
      evt.stopPropagation()

      this.setState({ value: event.target.value })
      this.submit()
      this.reset()
    }
  }

  render () {
    return <textarea
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
      value={this.state.value} />
  }
}

export default class MessageInput extends Component {
  render () {
    return (
      <div className="message-input">
        <Textarea
          className="input"
          onSubmit={this.props.onSubmit} />
      </div>
    )
  }
}
