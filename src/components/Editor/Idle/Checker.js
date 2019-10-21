import React from 'react'
import Idle from './Idle'
// 允许发呆的时间长度（单位：秒）
const IDLE_TIME = 60
class Checker extends React.Component {
    state = {
        interval: this.props.interval || IDLE_TIME,
        idle: new Idle()
    }

    componentDidMount() {
        const { interval , idle } = this.state
        const { onIdle ,  onActive, onLeave } = this.props
        idle.setInterval(interval).onIdle(onIdle)
        .onActive(onActive)
        .onBlur(onLeave)
    }

    componentWillUnmount() {
        if(this.idle)
            this.idle.destroy()
    }

    render() {
        return null
    }
}

export default Checker