import { Empty } from 'antd';
import React from 'react';

const KnowLedge = () => {
    return (
        <Empty
            style={{ margin: '60px 0' }}
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
                height: 60,
            }}
            description={
                <span>
                    <p>
                        🚀您可以出售课程，文章，漫画，创意作品，软件，电子书，音乐，游戏，咨询等服务轻松获得收入
                    </p>
                    <p>🚧正在施工中，敬请期待~</p>
                </span>
            }
        />
    );
};
KnowLedge.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default KnowLedge;
