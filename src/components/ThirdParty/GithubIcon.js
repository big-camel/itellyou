import React from 'react';
import classNames from 'classnames';
import { GithubOutlined } from '@ant-design/icons';
import styles from './index.less';

export default () => {
    return <GithubOutlined className={classNames(styles['third-icon'], styles['github'])} />;
};
