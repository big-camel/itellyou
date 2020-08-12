import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Select } from 'antd';
import Loading from '@/components/Loading';
import styles from './index.less';

export default ({ value, onChange }) => {
    onChange = onChange || function() {};

    const dispatch = useDispatch();

    const dataSource = useSelector(state => state.softwareGroup.list);

    useEffect(() => {
        dispatch({
            type: 'softwareGroup/list',
            payload:{}
        });
    }, [dispatch]);

    const renderGroup = () => {
        if(!dataSource || !dataSource.data) return <Loading />
        return (
            <Select
            onChange={event => onChange(parseInt(event.target.value))}
            value={value}
            >
                {dataSource.data.map(({ id , name }) => (
                    <Select.Option key={id} value={id}>
                        {name}
                    </Select.Option>
                ))}
            </Select>
        );
    };

    return renderGroup();
};
