import React from 'react'

import Container from '@/components/Container'
import Logo from './Logo'
import Navigation from './Navigation'
import User from './User'
import styles from './index.less'

function Header(props){
    return (
        <header className={styles["header"]}>
            <Container>
                <React.Fragment>
                    <Logo />
                    <Navigation {...props}/>
                    <User {...props} />
                </React.Fragment>
            </Container>
        </header>
    )
    
}
export default Header