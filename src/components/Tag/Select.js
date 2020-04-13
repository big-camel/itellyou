import React, { useState } from 'react';
import { Select, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import omit from 'omit.js';
import Create from './Create';

export default ({ placeholder, values, create = 'create', onChange, onSelect, ...props }) => {
    const [value, setValue] = useState('');
    const [createVisible, setCreateVisible] = useState(false);
    const [createValue, setCreateValue] = useState('');

    const dispatch = useDispatch();
    const tag = useSelector(state => state.tag);
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['tag/search'] || props.loading;
    const dataSource = tag.search || [];

    const clearData = () => {
        dispatch({
            type: 'tag/setSearch',
            payload: [],
        });
    };

    const onSearch = val => {
        val = val.trim();
        setValue(val);
        if (val === '') {
            if (loading) {
                setTimeout(() => {
                    clearData();
                }, 200);
            } else {
                clearData();
            }
            return;
        }
        dispatch({
            type: 'tag/search',
            payload: {
                w: val,
                create,
            },
        });
    };

    const onSelectChange = ({ key, label }) => {
        if (create && key === create) {
            return;
        }
        if (onChange) onChange({ id: parseInt(key), name: label });
    };

    const onSelectSelect = value => {
        if (create && value.key === create) {
            setCreateVisible(true);
            setCreateValue(value.name);
        } else if (onSelect) {
            onSelect(value);
        }
        clearData();
    };

    const onCreateCallback = res => {
        setCreateVisible(false);
        setCreateValue('');
        if (res && res.result) message.success('创建成功');
    };

    const renderOption = ({ id, name }) => {
        const option = { key: id, label: name };
        if (create && id === create) {
            return (
                <Select.Option {...option}>
                    创建标签 <strong>{name}</strong>
                </Select.Option>
            );
        } else if (value) {
            let prefix = null;
            if (value !== '' && name.indexOf(value) > -1) {
                prefix = value;
                name = name.substring(value.length);
            }
            return (
                <Select.Option {...option}>
                    {prefix ? <strong>{prefix}</strong> : null}
                    {name}
                </Select.Option>
            );
        }
    };
    props = omit(props, ['loading', 'value']);

    return (
        <React.Fragment>
            <Select
                value={[]}
                loading={loading}
                showSearch={true}
                optionLabelProp="label"
                placeholder={placeholder}
                labelInValue={true}
                filterOption={false}
                notFoundContent={null}
                onSearch={onSearch}
                onChange={onSelectChange}
                onSelect={(_, option) => {
                    onSelectSelect({ key: option.key, name: option.label });
                }}
                onBlur={() => clearData()}
                style={{ width: '100%' }}
                {...props}
            >
                {dataSource && dataSource.map(data => renderOption(data))}
            </Select>
            {create && (
                <Modal
                    title="创建标签"
                    visible={createVisible}
                    onCancel={onCreateCallback}
                    destroyOnClose={true}
                    footer={null}
                    width={800}
                >
                    <Create defaultName={createValue} onCallback={onCreateCallback} />
                </Modal>
            )}
        </React.Fragment>
    );
};
