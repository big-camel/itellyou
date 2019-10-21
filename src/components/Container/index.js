import React from 'react'
import classnames from 'classnames'

export default props => {
    const { children } = props
    const mode = props.mode || {}
    const containerCls = classnames({
        'layout-container': true,
        'layout-container-wider': mode.wider,
        'layout-container-middle': mode.middle,
        'layout-container-full': mode.full,
        clearfix: true
    })
    return <div className={containerCls}>{children}</div>
}