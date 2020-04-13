import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Radio, Button } from 'antd';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';

export default ({ value, onChange }) => {
    onChange = onChange || function() {};

    const dispatch = useDispatch();

    const me = useSelector(state => state.user.me);

    const dataSource = useSelector(state => state.column.list);

    useEffect(() => {
        if (me) {
            dispatch({
                type: 'column/list',
                payload: {
                    member_id: me.id,
                },
            });
        }
    }, [dispatch, me]);

    if (!me) return null;

    const renderColumn = () => {
        let columns = [{ id: 0, name: '个人文章' }];
        if (dataSource && dataSource.data) columns = columns.concat(dataSource.data);

        return (
            <div>
                <Radio.Group
                    className={styles['column']}
                    onChange={event => onChange(parseInt(event.target.value))}
                    value={value}
                >
                    {columns.map(column => (
                        <Radio key={column.id} value={column.id}>
                            {column.name}
                        </Radio>
                    ))}
                </Radio.Group>
                <div>
                    <Button
                        href="/column/apply"
                        target="_blank"
                        icon={<PlusOutlined />}
                        type="link"
                    >
                        申请专栏
                    </Button>
                </div>
            </div>
        );
    };

    return renderColumn();
};
