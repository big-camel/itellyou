import React from 'react';
import UserAuthor from '../Author';
import './index.less';
import { Space } from 'antd';
export default ({ actors = [], count, useBrand = true, ...props }) => {
    return (
        <Space className="user-actors" {...props}>
            <div className="user-actors-authors">
                {actors.map((user, index) => {
                    return (
                        <div className="user-actors-item" key={index}>
                            <UserAuthor brand={useBrand} info={user} model="name" size="small" />
                            {index !== actors.length - 1 ? '、' : ''}
                        </div>
                    );
                })}
            </div>
            {count && count > actors.length && <span>{` 等${count}人`}</span>}
        </Space>
    );
};
