import React, { useState } from 'react';
import { history, useDispatch } from 'umi';
import { message, Card } from 'antd';
import AvatarCropper from '@/components/AvatarCropper';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';
import styles from './index.less';

const { Avatar, Name, Desc, Path } = Form.createItem(formMap);

const Setting = detail => {
    const [avatar, setAvatar] = useState(detail.avatar);
    const [submiting, setSubmiting] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const avatarChange = url => {
        setAvatar(url);
        form.setFieldsValue({ avatar: url });
    };

    const queryName = (_, name) => {
        return new Promise((resolve, reject) => {
            if (name === detail.name) {
                return resolve();
            }

            dispatch({
                type: 'column/queryName',
                payload: {
                    name,
                },
            }).then(({ result, message }) => {
                if (result) return resolve();
                reject(message);
            });
        });
    };

    const findPath = (_, path) => {
        return new Promise((resolve, reject) => {
            if (path === detail.path) {
                return resolve();
            }

            dispatch({
                type: 'path/find',
                payload: {
                    path,
                    reducer: false,
                },
            }).then(({ result }) => {
                if (result) return reject('不可用的路径或已被使用');
                resolve();
            });
        });
    };

    const handleSubmit = values => {
        const data = {};
        for (let key in values) {
            if (values[key] !== undefined && values[key] !== detail[key]) {
                data[key] = values[key];
            }
        }
        if (Object.keys(data).length === 0) return;
        setSubmiting(true);
        dispatch({
            type: 'column/setting',
            payload: { ...data, id: detail.id },
        }).then(res => {
            setSubmiting(false);
            if (res.result === true) {
                history.push(`/${res.data.path}`);
            } else if (res.result === false) {
                message.error(res.message);
            }
        });
    };

    return (
        <Card>
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
                    name="avatar"
                    extra={<AvatarCropper url={avatar} onChange={avatarChange} />}
                />
                <Name label="名称" name="name" autoComplete="off" asyncValidator={queryName} />
                <Path
                    label="路径"
                    name="path"
                    autoComplete="off"
                    placeholder={detail.path}
                    asyncValidator={findPath}
                />
                <Desc label="简介" name="description" autoComplete="off" />
                <Submit loading={submiting}>{submiting ? '提交中...' : '提交'}</Submit>
            </Form>
        </Card>
    );
};

export default Setting;
