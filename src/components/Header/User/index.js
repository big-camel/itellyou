import React from 'react'
import styles from './index.less'
import Link from 'umi/link'
import UserMenu from './UserMenu'
import ActionMenu from './ActionMenu'
import Notifications from './Notifications'
import { useSelector } from 'dva'

export default () => {
    const me = useSelector(state => state.user.me)
    return (
        <div className={styles['user']}>
            {
                me ? (
                    <div className={styles["action"]}>
                        <div className={styles["item"]}>
                            <ActionMenu />
                        </div>
                        <div className={styles["item"]}>
                            <Notifications />
                        </div>
                        <div className={styles["item"]}>
                            <UserMenu { ...me } />
                        </div>
                    </div>
                )
                : (
                    <div>
                        <Link to="/login">登录</Link>
                        <Link to="/register">注册</Link>
                    </div>
                )
            }
            </div>
    )
}