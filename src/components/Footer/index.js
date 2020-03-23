import React from 'react'
import Container from '../Container'
import styles from './index.less'

export default () => {

    return (
        <div className={styles['footer']}>
            <Container>
                <div className={styles['copyright']}>
                    <p>Copyright © 2020 ITELLYOU</p>
                    <p>蜀ICP备 17019166号 四川西维尔科技有限公司版权所有</p> 
                </div>
            </Container>
        </div>
    )
}