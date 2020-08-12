import React, { useState } from 'react';
import { useDispatch } from 'umi';
import { Modal, Tabs, Collapse, Table, Space, Switch } from 'antd';
import Time from '@/utils/time';
import styles from './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

export default ({ softwareId, releases, visible, onVisibleChange }) => {
    onVisibleChange = onVisibleChange || function () {};

    const [recommendLoading, setRecommendLoading] = useState({});
    const dispatch = useDispatch();

    const setRecommend = (id, checked) => {
        setRecommendLoading((value) => {
            return { ...value, [id]: true };
        });
        dispatch({
            type: 'softwareFile/recommend',
            payload: {
                softwareId,
                fileId: id,
                recommend: checked ? 1 : 0,
            },
        }).then(() => {
            setRecommendLoading((value) => {
                return { ...value, [id]: false };
            });
        });
    };

    const renderColumns = () => [
        {
            title: '文件名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '发布时间',
            dataIndex: 'publish_date',
            key: 'publish_date',
            width: 90,
            render: (text) => {
                return Time.format(text, { tpl: 'YYYY-MM-DD' });
            },
        },
        {
            title: '操作',
            key: 'action',
            width: 90,
            render: (_, { id, is_recommend }) => {
                return (
                    <Space>
                        <Switch
                            size="small"
                            loading={recommendLoading[id]}
                            checkedChildren="已推荐"
                            unCheckedChildren="未推荐"
                            checked={is_recommend}
                            onChange={(checked) => setRecommend(id, checked)}
                        />
                    </Space>
                );
            },
        },
    ];

    const renderReleases = () => {
        if (!releases || releases.length === 0) return <Empty />;
        return (
            <Tabs className={styles['software-release']} defaultActiveKey="-1">
                {releases.map(({ id, name, updaters }) => {
                    return (
                        <TabPane key={id} tab={name}>
                            <Collapse
                                className={styles['software-updater']}
                                ghost
                                accordion
                                defaultActiveKey={
                                    updaters && updaters.length > 0 ? updaters[0].id : 0
                                }
                            >
                                {updaters.map(({ id, name, files }) => {
                                    return (
                                        <Panel key={id} header={name}>
                                            <Table
                                                rowKey="id"
                                                dataSource={files}
                                                columns={renderColumns()}
                                                size="small"
                                                pagination={false}
                                                bordered
                                            />
                                        </Panel>
                                    );
                                })}
                            </Collapse>
                        </TabPane>
                    );
                })}
            </Tabs>
        );
    };

    return (
        <Modal
            title="版本管理"
            width={600}
            visible={visible}
            onCancel={() => onVisibleChange(false)}
            footer={null}
            destroyOnClose={true}
        >
            {renderReleases()}
        </Modal>
    );
};
