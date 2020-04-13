import React from 'react';
import './index.less';
import { Card } from 'antd';
export default ({ children }) => {
    return (
        <div className="card-table-wrapper">
            <Card>{children}</Card>
        </div>
    );
};
