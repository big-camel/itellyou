import React from 'react';
import { Tooltip } from 'antd';
import GithubIcon from './GithubIcon';
import styles from './index.less';

export default () => {
    return (
        <Tooltip title="Github登陆">
            <a className={styles['third-link']} href="/api/oauth/github?action=login">
                <GithubIcon />
            </a>
        </Tooltip>
    );
};
