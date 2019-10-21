import React from 'react'
import classnames from 'classnames'

export default props => {
    const { href , activeClassName , className , children } = props
    const pathname = window.location.pathname

    return <a
    href={href}
    className={classnames(className,pathname === href ? activeClassName : null)}
    >
        {children}
    </a>
}