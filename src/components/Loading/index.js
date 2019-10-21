import React from 'react'
import { Spin , Icon } from 'antd'
import styles from './index.less'

export default props => (
  <div className={styles.loading}>
    <Spin 
    indicator={<Icon className={styles.icon} type="loading" />}
    tip={props.tip || "加载中..."}
    />
  </div>
);
