import React from 'react'
import { Spin , Icon } from 'antd'
import styles from './index.less'

export default props => (
    <Spin 
    indicator={<Icon className={styles.icon} type="loading" />}
    tip={props.tip || "加载中..."}
    spinning={props.loading === undefined || props.loading === null ? true : props.loading}
    >{props.children}</Spin>
)
