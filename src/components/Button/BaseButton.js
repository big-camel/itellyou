import React from 'react'
import { Button, Icon } from 'antd'
import classnames from 'classnames'
import styles from './index.less'

function BaseButton({ children , active , loading , icon , ...props }){
    const getIcon = () => {
        if(loading) return
        if(typeof icon === "string")
            return <Icon type={icon} theme="filled" />
        return icon;
    }
    return <Button type="ghost" className={classnames(styles["button"],{[styles["active"]]:active})} loading={loading} {...props}>
            { 
                getIcon()
            }
            {children}
        </Button>
}
export default BaseButton