import React, { useState } from 'react'
import { Input } from 'antd'
import { router } from 'umi'
import styles from './index.less'

const { Search } = Input
function TopSearch({ defaultValue , type }){
    const [ word , setWord ] = useState(defaultValue || "")
    const onSearch = value => {
        if(value.trim() === "") return
        router.push("/search?q=" + value + "&t=" + type)
    }
    
    return (
        <div className={styles["top-search"]}>
            <Search 
            placeholder="搜索问题或关键字"
            value={word}
            onChange={e => setWord(e.target.value)}
            onSearch={onSearch}
            style={{ width: 200 }}
            />
        </div>
    )
}
export default TopSearch