import React from 'react'
import Link from 'umi/link'
import TopSearch from '@/components/Header/Search'
import styles from './index.less'

export default ({ location }) => {
    const query  = location ? location.query || {} : {}
    return (
        <nav className={styles["nav"]}>
            <Link to="/">首页</Link>
            <Link to="/question">问答</Link>
            <Link to="/article">文章</Link>
            <Link to="/column">专栏</Link>
            <Link to="/tag">标签</Link>
            <TopSearch defaultValue={query.q || ""} type={query.t || ""} />
        </nav>
    )
}