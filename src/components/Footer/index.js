import React from 'react';
import Container from '../Container';
import styles from './index.less';
import { Space } from 'antd';

export default () => {
    return (
        <div className={styles['footer']}>
            <Container>
                <div className={styles['copyright']}>
                    <p>Copyright © 2020 ITELLYOU</p>
                    <Space>
                        <a target="_blank" href="http://drawing.itellyou.com">
                            文本绘图工具
                        </a>
                    </Space>
                    <p>蜀ICP备 17019166号 四川西维尔科技有限公司版权所有</p>
                </div>
            </Container>
        </div>
    );
};
