import React from 'react';
import { DeleteButton } from '@/components/Button';
import { Modal } from 'antd';
import { useDispatch } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default ({ id, title, callback, ...props }) => {
    const dispatch = useDispatch();

    const onDelete = () => {
        Modal.confirm({
            title: `确定删除 ${title || ''}?`,
            okText: '确定',
            cancelText: '取消',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise(resolve => {
                    dispatch({
                        type: 'article/delete',
                        payload: {
                            id,
                        },
                    }).then(res => {
                        resolve();
                        if (callback) callback(res);
                    });
                });
            },
            onCancel() {},
        });
    };

    return <DeleteButton {...props} onClick={onDelete} />;
};
