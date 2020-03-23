import React from 'react'
import { Spin , Icon } from 'antd'
import LoadingButton from './Button'
import styles from './index.less'

export default ({ tip , loading , children }) => (
    <Spin 
    indicator={<Icon className={styles.icon} type="loading" />}
    tip={tip || "加载中..."}
    spinning={loading === undefined || loading === null ? true : loading}
    >{children}</Spin>
)

export {
    LoadingButton
}