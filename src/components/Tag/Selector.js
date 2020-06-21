import React from 'react';
import Tag from '@/components/Tag';
import { Space } from 'antd';
import styles from './Selector.less';

export default ({ values, onChange, ...props }) => {
    onChange = onChange || function() {};
    const onSelectChange = ({ id, name }) => {
        if (!values.find(tag => tag.id === id)) {
            onChange(
                values.concat({
                    id,
                    name,
                }),
            );
        }
    };

    const onClose = id => {
        const index = values.findIndex(tag => tag.id === id);
        if (index > -1) {
            values.splice(index, 1);
            onChange(values.concat());
        }
    };

    const renderTags = () => {
        console.log(values);
        return (
            <Space direction="vertical">
                {values && (
                    <Space className={styles['tag-selector']}>
                        {values.map(({ id, name }) => (
                            <Tag key={id} id={id} title={name} onClose={onClose} />
                        ))}
                    </Space>
                )}
                <Tag.Select
                    values={values}
                    onChange={onSelectChange}
                    placeholder="搜索标签"
                    {...props}
                />
            </Space>
        );
    };

    return renderTags();
};
