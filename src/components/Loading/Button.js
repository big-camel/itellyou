import React from 'react'
import { Button } from 'antd'
import styles from './Button.less'

export default ({ text , loading , onClick , ...props }) => {
    text = text || "加载更多"
    onClick = onClick || function(){}
    return <Button 
    className={styles['default']}
    size="large"
    loading={loading} 
    onClick={onClick}
    {...props}
    >
    {
        text
    }
    </Button>
}