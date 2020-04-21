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
                    <p>蜀ICP备 17019166号 四川西维尔科技有限公司版权所有</p>
                </div>
                <div className={styles['links']}>
                    <Space>
                        <a target="_blank" href="https://drawing.itellyou.com">
                            文本绘图工具
                        </a>
                        <a target="_blank" href="https://www.guowenfu.com">
                            趣善帮
                        </a>
                        <a target="_blank" href="http://apptravel.cn">
                            AT搜索
                        </a>
                    </Space>
                </div>
            </Container>
        </div>
    );
};
