import React from 'react'
import NavLink from '@/components/NavLink'
import styles from './index.less'

class UserMenu extends React.PureComponent {

    render(){
        return (
            <div className={styles.nav}>
                <NavLink href="/user" activeClassName={styles.active}>Base</NavLink>
                <span className={styles.split}></span>
                <NavLink href="/user/questions" activeClassName={styles.active}>我的提问</NavLink>
                <NavLink href="/user/answers" activeClassName={styles.active}>我的回答</NavLink>
                <NavLink href="/user/articles" activeClassName={styles.active}>我的文章</NavLink>
                <NavLink href="/user/draft" activeClassName={styles.active}>草稿箱</NavLink>
            </div>
        )
    }
}

export default UserMenu