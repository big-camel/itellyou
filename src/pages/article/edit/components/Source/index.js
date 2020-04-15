import React from 'react';
import { Radio, Button, Input } from 'antd';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';

export default ({ value: { type, data }, onChange }) => {
    const renderData = () => {
        return (
            <div>
                <Input
                    value={data}
                    onChange={event => onChange({ type, data: event.target.value })}
                />
            </div>
        );
    };

    return (
        <div>
            <Radio.Group
                className={styles['source']}
                onChange={event => onChange({ type: event.target.value, data })}
                value={type}
                defaultValue={type}
            >
                <Radio key="original" value="original">
                    原创
                </Radio>
                <Radio key="reproduced" value="reproduced">
                    转载
                </Radio>
                {type == 'reproduced' && renderData()}
                <Radio key="translation" value="translation">
                    翻译
                </Radio>
                {type == 'translation' && renderData()}
            </Radio.Group>
            <div>
                <Button href="/column/apply" target="_blank" icon={<PlusOutlined />} type="link">
                    申请专栏
                </Button>
            </div>
        </div>
    );
};
