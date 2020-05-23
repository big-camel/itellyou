import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { message, Card } from 'antd';
import Loading from '@/components/Loading';
import Layout from '../components/Layout';
import UserAvatar from '@/components/AvatarCropper';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';

const { Avatar, Name, Gender, Description, Introduction, Address, Profession } = Form.createItem(
    formMap,
);

function Profile() {
    const [avatar, setAvatar] = useState();

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const me = useSelector(state => state.user.me);
    const detail = useSelector(state => (me ? state.user.detail[me.id] : null));
    const settings = useSelector(state => state.settings);
    const loadingEffect = useSelector(state => state.loading);
    const submiting = loadingEffect.effects['user/profile'];

    useEffect(() => {
        if (me) {
            dispatch({
                type: 'user/find',
                payload: {
                    id: me.id,
                },
            });
        }
    }, [dispatch, me]);

    useEffect(() => {
        if (detail) {
            setAvatar(detail.avatar || settings.defaultAvatar);
        }
    }, [detail]);

    if (!me || !detail) return <Loading />;

    const queryName = (_, name) => {
        return new Promise((resolve, reject) => {
            if (name === detail.name) {
                return resolve();
            }

            dispatch({
                type: 'user/queryName',
                payload: {
                    name,
                },
            }).then(({ result, message }) => {
                if (result) return resolve();
                reject(message);
            });
        });
    };

    const avatarChange = url => {
        setAvatar(url);
        form.setFieldsValue({ avatar: url });
    };

    const handleSubmit = values => {
        dispatch({
            type: 'user/profile',
            payload: values,
        }).then(res => {
            if (!res.result) {
                message.error(res.message);
            } else {
                message.success('更新成功!');
            }
        });
    };
    return (
        <Layout defaultKey="profile">
            <Card>
                <h2>个人信息</h2>
                <div>
                    <Form
                        form={form}
                        layout="vertical"
                        hideRequiredMark={true}
                        onSubmit={handleSubmit}
                        initialValues={{
                            ...detail,
                        }}
                    >
                        <Avatar
                            label="头像"
                            name="avatar"
                            extra={<UserAvatar url={avatar} onChange={avatarChange} />}
                        />
                        <Name
                            label="昵称"
                            name="name"
                            autoComplete="off"
                            asyncValidator={queryName}
                        />
                        <Gender label="性别" name="gender" />
                        <Description label="一句话介绍自己" name="description" autoComplete="off" />
                        <Profession label="行业" name="profession" />
                        <Address label="地址" name="address" />
                        <Introduction label="简介" name="introduction" autoComplete="off" />
                        <Submit loading={submiting}>{submiting ? '更新中...' : '更新信息'}</Submit>
                    </Form>
                </div>
            </Card>
        </Layout>
    );
}

Profile.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default Profile;
