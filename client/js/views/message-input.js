import React from 'react'
import Component from './component'

class Textarea extends Component {
  constructor () {
    super()
    this._bind('handleChange', 'handleKeyDown')
  }

  handleChange (evt) {
    let value = React.findDOMNode(this).value
    if (this.props.onChange && value !== this.lastValue) {
      this.props.onChange(value)
    }
    this.lastValue = value
  }

  handleKeyDown (e) {
    if (e.key === 'Enter') this.handleEnter(e)
  }

  handleEnter (e) {
    if (e.ctrlKey) return
    e.preventDefault()
    e.stopPropagation()

    let el = React.findDOMNode(this)
    let value = el.value.trim()

    if (!value) return

    el.value = ''
    if (this.props.onSubmit) this.props.onSubmit(value)
  }

  render () {
    return <textarea
      onInput={this.handleChange}
      onBlur={this.handleChange}
      onKeyDown={this.handleKeyDown} />
  }
}

export default class MessageInput extends Component {
  render () {
    return (
      <div className="message-input">
        <Textarea
          className="input"
          onChange={this.props.onChange}
          onSubmit={this.props.onSubmit} />
      </div>
    )
  }
}
