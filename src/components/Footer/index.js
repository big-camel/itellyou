import React from 'react';
import { Space } from 'antd';
import { useSelector } from 'umi';
import Container from '../Container';
import styles from './index.less';

export default () => {
    const settings = useSelector(state => state.settings);
    const { title, site, links } = settings || {};
    const { copyright, icp_text, company_name } = site || {};

    return (
        <div className={styles['footer']}>
            <Container>
                <Space className={styles['copyright']} direction="vertical" size="small">
                    <Space>
                        {copyright}
                        {title}
                    </Space>
                    <Space>
                        {icp_text}
                        {company_name ? `${company_name}版权所有` : ''}
                    </Space>
                </Space>
                <div className={styles['links']}>
                    <Space>
                        {(links || []).map(({ text, link, target }, index) => (
                            <a key={index} target={target ? `${target}` : ''} href={link}>
                                {text}
                            </a>
                        ))}
                    </Space>
                </div>
            </Container>
        </div>
    );
};
