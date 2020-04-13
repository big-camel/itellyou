import React from 'react';
import Tag from '@/components/Tag';
import List from '@/components/List';

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

    const renderItem = ({ id, name }) => {
        return (
            <List.Item key={id}>
                <Tag id={id} title={name} onClose={onClose} />
            </List.Item>
        );
    };

    const renderTags = () => {
        return (
            <React.Fragment>
                {values.length > 0 && (
                    <List
                        grid={{ gutter: 8 }}
                        dataSource={values}
                        renderItem={renderItem}
                        split={false}
                    />
                )}
                <Tag.Select
                    values={values}
                    onChange={onSelectChange}
                    placeholder="搜索标签"
                    {...props}
                />
            </React.Fragment>
        );
    };

    return renderTags();
};
