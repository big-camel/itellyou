import React from 'react'
import logo from '@/assets/logo.svg'
import styles from './index.less'

export default () => {
    return (
        <div className={styles["logo"]}>
            <a href="/"><img src={logo} alt="" /></a>
        </div>
    )
}