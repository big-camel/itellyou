import React from 'react'
import Link from 'umi/link'
import classNames from 'classnames'
import GlobalLayout from '@/components/GlobalLayout'
import Container from '@/components/Container'
import logo from '@/assets/logo.svg'
import styles from './PassportLayout.less'

class UserLayout extends React.PureComponent {
    render(){
        const { children , ...props} = this.props
        const layout = (
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Link to="/">
                            <img alt="logo" src={logo} />
                        </Link>
                    </div>
                    <div className={styles.title}>ITELLYOU 我告诉你</div>
                </div>
                {children}
            </div>
        )

        return(
            <GlobalLayout {...props}>
                <div className={classNames("main-wrapper",styles.wrapper)}>
                    <Container >{ layout }</Container>
                </div>
            </GlobalLayout>
        )
    }
}

export default UserLayout;