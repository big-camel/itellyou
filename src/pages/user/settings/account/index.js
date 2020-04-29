import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'umi';
import Layout from '../components/Layout';
import Loading from '@/components/Loading';
import Mobile from './components/Mobile';
import Email from './components/Email';
import Password from './components/Password';
import Path from './components/Path';
import Third from './components/Third';
import styles from './index.less';

function Account() {
    const [loading, setLoading] = useState(true);
    const [mobileVisible, setMobileVisible] = useState(false);
    const [emailVisible, setEmailVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [pathVisible, setPathVisible] = useState(false);

    //const [ loginVisible , setLoginVisible ] = useState(false)

    const dispatch = useDispatch();
    const me = useSelector(state => state.user.me);

    useEffect(() => {
        dispatch({
            type: 'user/fetchAccount',
        }).then(() => {
            setLoading(false);
        });
    }, [dispatch]);

    if (!me || loading) return <Loading />;

    const { mobile, email, is_set_pwd, path } = me;
    return (
        <Layout defaultKey="account">
            <Card title="账户管理" className={styles['settings-form']}>
                <Card className={styles['form-item']}>
                    <Card.Meta title="手机号码" description={<span>{mobile || '未设置'}</span>} />
                    <a onClick={() => setMobileVisible(true)}>{mobile ? '更改' : '设置'}</a>
                </Card>
                <Card className={styles['form-item']}>
                    <Card.Meta title="邮箱" description={<span>{email || '未设置'}</span>} />
                    <a onClick={() => setEmailVisible(true)}>{email ? '更改' : '设置'}</a>
                </Card>
                <Card>
                    <Card.Meta
                        title="登录密码"
                        description={
                            <span>{is_set_pwd ? '已设置，可通过密码登录' : '未设置'}</span>
                        }
                    />
                    <a onClick={() => setPasswordVisible(true)}>{is_set_pwd ? '更改' : '设置'}</a>
                </Card>
                <Card>
                    <Card.Meta
                        title="个人路径"
                        description={
                            <span>{path ? `https://www.itellyou.com/${path}` : '未设置'}</span>
                        }
                    />
                    <a onClick={() => setPathVisible(true)}>{path ? '更改' : '设置'}</a>
                </Card>

                {mobileVisible && (
                    <Mobile visible={mobileVisible} onClose={() => setMobileVisible(false)} />
                )}
                {emailVisible && (
                    <Email visible={emailVisible} onClose={() => setEmailVisible(false)} />
                )}
                {passwordVisible && (
                    <Password visible={passwordVisible} onClose={() => setPasswordVisible(false)} />
                )}
                {pathVisible && (
                    <Path
                        defaultValue={path}
                        visible={pathVisible}
                        onClose={() => setPathVisible(false)}
                    />
                )}
                <Third />
            </Card>
        </Layout>
    );
}

export default Account;
