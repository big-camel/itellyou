import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { history } from 'umi';
import styles from './index.less';

const { Search } = Input;
function TopSearch({ defaultValue, type }) {
    const [word, setWord] = useState(defaultValue || '');
    const onSearch = value => {
        if (value.trim() === '') return history.push('/');
        history.push(`/search?q=${value}${type ? `&t=${type}` : ''}`);
    };

    useEffect(() => {
        setWord(defaultValue);
    }, [defaultValue]);

    return (
        <div className={styles['top-search']}>
            <Search
                className={styles['input']}
                placeholder="搜索"
                value={word}
                onChange={e => setWord(e.target.value)}
                onSearch={onSearch}
            />
        </div>
    );
}
export default TopSearch;
