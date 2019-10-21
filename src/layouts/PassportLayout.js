import React from 'react'
import Link from 'umi/link'
import DocumentTitle from 'react-document-title'
import logo from '@/assets/logo.svg'
import styles from './PassportLayout.less'

class UserLayout extends React.PureComponent {
    render(){
        const { children } = this.props
        const layout = (
            <div className={styles.container}>
                <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                    <Link to="/">
                        <img alt="logo" className={styles.logo} src={logo} />
                    </Link>
                    </div>
                    <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
                </div>
                {children}
                </div>
            </div>
        )

        return(
            <DocumentTitle title='I TELL YOU'>
                {layout}
            </DocumentTitle>
        )
    }
}

export default UserLayout;