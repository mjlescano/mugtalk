import React from 'react/addons'
import Component from './component'

const CSSTransitionGroup = React.addons.CSSTransitionGroup

export default class Alert extends Component {
  render () {
    return (
      <CSSTransitionGroup transitionName='fade-in' transitionAppear={true}>
        <div className='alert'><h1>{this.props.message}</h1></div>
      </CSSTransitionGroup>
    )
  }
}
