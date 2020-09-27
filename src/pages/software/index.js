import React, { useContext } from 'react';
import { useDispatch, useSelector, Helmet, useIntl, Link } from 'umi';
import { Card, Space } from 'antd';
import { RouteContext } from '@/context';
import { GoogleSquare } from '@/components/AdSense';
import Container, { Layout, Sider } from '@/components/Container';
import List from '@/components/List';
import { getPageQuery } from '@/utils';
import styles from './index.less';

const fetchGroupList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'softwareGroup/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

const fetchList = (dispatch, offset, limit, groupId, parmas) => {
    return dispatch({
        type: 'software/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            group_id: groupId,
            ...parmas,
        },
    });
};

const SoftwareIndex = ({ location: { query } }) => {
    let group = query.group;

    const intl = useIntl();
    const loadingEffect = useSelector((state) => state.loading);
    const loading = loadingEffect.effects['software/list'];
    const dispatch = useDispatch();
    const dataSource = useSelector((state) => (state.software ? state.software.list : null));
    const groupDataSource = useSelector((state) =>
        state.softwareGroup ? state.softwareGroup.list : null,
    );
    const settings = useSelector((state) => state.settings);

    let menuData = [];
    if (groupDataSource) {
        if (!group) group = groupDataSource.data[0].id;
        menuData = groupDataSource.data.map(({ id, name }) => {
            return { key: id, title: name, to: `/download?group=${id}` };
        });
    }

    const renderItem = ({ id, name, logo }) => {
        return (
            <List.Item key={id}>
                <Card className={styles['item-card']} hoverable>
                    {logo && (
                        <div>
                            <a href={`/download/${id}`} target="_blank">
                                <img src={logo} alt={name} width="100%" />
                            </a>
                        </div>
                    )}
                    {!logo && (
                        <h4 className={styles.title}>
                            <a href={`/download/${id}`} target="_blank">
                                {name}
                            </a>
                        </h4>
                    )}
                </Card>
            </List.Item>
        );
    };

    const { isMobile } = useContext(RouteContext);

    const renderList = () => {
        return (
            <List
                grid={isMobile ? { gutter: 8, column: 2 } : { gutter: 16, column: 3 }}
                loading={loading}
                dataSource={dataSource ? dataSource.data : []}
                renderItem={renderItem}
            />
        );
    };

    const render = () => {
        if (isMobile) {
            return (
                <Layout>
                    <Space direction="vertical" size="middle">
                        <Sider dataSource={menuData} activeKey={(group || '').toString()} />
                        {renderList()}
                    </Space>
                </Layout>
            );
        }
        return (
            <Layout spans={6}>
                <Space direction="vertical" size="middle">
                    <Sider dataSource={menuData} activeKey={(group || '').toString()} />
                    <GoogleSquare />
                </Space>
                {renderList()}
            </Layout>
        );
    };

    return (
        <>
            <Helmet>
                <title>{`${intl.formatMessage({ id: 'download.page.index' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({
                        id: 'keywords',
                    })},软件下载,Windows下载,itellyou下载,系统下载,win10下载,windows10 iso,win10 iso`}
                />
                <meta
                    name="description"
                    content={`itellyou系统下载列表win10,win7,win8,Linux,macOs,Chromiumos,微软原版系统iso文件下载${intl.formatMessage(
                        { id: 'description' },
                    )}`}
                />
            </Helmet>
            <Container>{render()}</Container>
        </>
    );
};

SoftwareIndex.getInitialProps = async ({ isServer, store, params, history }) => {
    const { dispatch, getState } = store;
    const groupList = await fetchGroupList(dispatch, 0, 1000, params);
    let groupId;
    if (groupList.result && groupList.data.total > 0) {
        groupId = groupList.data.data[0].id;
    }
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const group = query ? query.group : null;
    await fetchList(dispatch, 0, 10000, group || groupId, params);

    if (isServer) return getState();
};
export default SoftwareIndex;
