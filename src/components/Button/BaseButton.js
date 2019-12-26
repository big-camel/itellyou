import React from 'react'
import { Button } from 'antd'
import classnames from 'classnames'
import styles from './index.less'

function BaseButton({ children , active , ...props }){

    return <Button type="ghost" className={classnames(styles["button"],{[styles["active"]]:active})} {...props}>
            {children}
        </Button>
}
export default BaseButton