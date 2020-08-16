import React, { useContext, useState } from 'react';
import { Card, Space } from 'antd';
import { Helmet, useIntl, useSelector } from 'umi';
import { RouteContext } from '@/context';
import List from '@/components/List';
import { GoogleSquare } from '@/components/AdSense';
import Container, { Layout, Sider } from '@/components/Container';

const { Meta } = Card;

const menu = [
    {
        key: 'all',
        title: '全部',
    },
    {
        key: 'ecs',
        title: '云服务器',
    },
    {
        key: 'db',
        title: '云数据库',
    },
    {
        key: 'cdn',
        title: 'CDN',
    },
    {
        key: 'site',
        title: '网站建设',
    },
];

const data = [
    {
        type: 'ecs',
        target: 'aliyun',
        link: 'https://www.aliyun.com/activity/daily/cloud?userCode=qs6djuqi',
        image:
            'https://cdn-image.itellyou.com/yun/aliyun/ecs/%E6%A0%A1%E5%8F%8B%E5%B9%B3%E5%8F%B01180-310.jpg',
        title: (
            <h2>
                阿里云ECS云服务器,<strong>1核2G,最低价96.90元/年</strong>
            </h2>
        ),
    },
    {
        type: 'ecs',
        target: 'tencent',
        link: 'https://url.cn/YjTHINGh',
        image: 'https://cdn-image.itellyou.com/yun/tencent/ecs/1040.100.jpg',
        title: (
            <h2>
                腾讯云云服务器,<strong>1核2G,首年99元/年</strong>
            </h2>
        ),
    },
    {
        type: 'db',
        target: 'aliyun',
        link: 'https://www.aliyun.com/database/dbfirstbuy?userCode=qs6djuqi',
        image:
            'https://cdn-image.itellyou.com/yun/aliyun/db/QQ%E6%88%AA%E5%9B%BE20200816144038.png',
        title: (
            <h2>
                阿里云MySQL数据库低至1折起<strong>首年54元</strong>，首次续费享7折
            </h2>
        ),
    },
    {
        type: 'db',
        target: 'tencent',
        link:
            'https://cloud.tencent.com/act/cps/redirect?redirect=1003&cps_key=849a1f99f43c5699bb1d7c11d831de32&from=console',
        image: 'https://cdn-image.itellyou.com/yun/tencent/db/950x90.jpg',
        title: (
            <h2>
                腾讯云数据库性能卓越稳定可靠，MySql<strong>仅12元/月</strong>
            </h2>
        ),
    },
    {
        type: 'cdn',
        target: 'aliyun',
        link: 'https://yqh.aliyun.com/live/cdncarnival?userCode=qs6djuqi',
        image: 'https://cdn-image.itellyou.com/yun/aliyun/cdn/1560-480.jpg',
        title: (
            <h2>
                阿里云CDN，爆款产品低至5.5折,新客户专享流量包<strong>49.90元/年</strong>
            </h2>
        ),
    },
    {
        type: 'site',
        target: 'aliyun',
        link: 'https://ac.aliyun.com/application/webdesign/sumei?userCode=qs6djuqi',
        image: 'https://cdn-image.itellyou.com/yun/aliyun/site/1000x500.jpg',
        title: (
            <h2>
                阿里云建站，定制建站设计师1对1服务专业省心，<strong>首单低至500元</strong>
            </h2>
        ),
    },
];

const Yun = () => {
    const intl = useIntl();
    const [type, setType] = useState('all');
    const settings = useSelector((state) => state.settings);
    const renderItem = ({ type, target, link, image, title }) => {
        return (
            <List.Item key={`${type}_${target}`}>
                <a target="_blank" href={link}>
                    <Card hoverable cover={<img src={image} />}>
                        <Meta title={title} />
                    </Card>
                </a>
            </List.Item>
        );
    };

    const { isMobile } = useContext(RouteContext);
    const dataSource = data.filter((item) => item.type === type || type === 'all');
    const renderList = () => {
        return (
            <>
                <Card>
                    <Card.Meta
                        title={
                            <h2>
                                购买
                                <a href="https://www.aliyun.com/minisite/goods?userCode=qs6djuqi">
                                    阿里云
                                </a>
                                、
                                <a href="https://cloud.tencent.com/act/cps/redirect?redirect=1062&cps_key=849a1f99f43c5699bb1d7c11d831de32&from=console">
                                    腾讯云
                                </a>
                                云服务返利优惠
                            </h2>
                        }
                        description={
                            '本站已与阿里云、腾讯云建立推广合作关系，提供阿里云、腾讯云最大力度优惠活动，在优惠活动基础上，点击下方所需要的产品链接购买后发送购买信息到 service@itellyou.com，本站合作利润部分将返回给您。'
                        }
                    />
                </Card>
                <List dataSource={dataSource} renderItem={renderItem} />
            </>
        );
    };

    const render = () => {
        if (isMobile) {
            return (
                <Layout>
                    <Space direction="vertical" size="middle">
                        <Sider
                            dataSource={menu}
                            activeKey={type}
                            onSelect={({ key }) => setType(key)}
                        />
                        {renderList()}
                    </Space>
                </Layout>
            );
        }
        return (
            <Layout spans={6}>
                <Space direction="vertical" size="middle">
                    <Sider
                        dataSource={menu}
                        activeKey={type}
                        onSelect={({ key }) => setType(key)}
                    />
                    <GoogleSquare />
                </Space>
                {renderList()}
            </Layout>
        );
    };

    return (
        <>
            <Helmet>
                <title>{`${intl.formatMessage({ id: 'yun.page.index' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({
                        id: 'keywords',
                    })},云服务器，云数据库，阿里云ECS服务器，腾讯云云服务器`}
                />
                <meta
                    name="description"
                    content={`阿里云ECS服务器、数据库，腾讯云云服务器、云数据库优惠返利、试用${intl.formatMessage(
                        { id: 'description' },
                    )}`}
                />
            </Helmet>
            <Container>{render()}</Container>
        </>
    );
};
Yun.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;
    if (isServer) return getState();
};
export default Yun;
