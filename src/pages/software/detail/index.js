import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useSelector, Helmet, Redirect, useDispatch, Link } from 'umi';
import {
    Card,
    Space,
    Descriptions,
    Tabs,
    message,
    Empty,
    Collapse,
    Table,
    Tooltip,
    Popover,
} from 'antd';
import copyToClipboard from 'copy-to-clipboard';
import filesize from 'filesize';
import { RouteContext } from '@/context';
import { RewardButton } from '@/components/Reward';
import Container, { Layout } from '@/components/Container';
import Loading from '@/components/Loading';
import Editor from '@/components/Editor';
import { GoogleHorizontal } from '@/components/AdSense';
import { CommentButton, EditButton, ReportButton } from '@/components/Button';
import { Vote, Comment } from './components/Action';
import Timer from '@/components/Timer';
import Time from '@/utils/time';
import Tag from '@/components/Tag';
import styles from './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const SoftwareDetail = ({ match: { params } }) => {
    const id = parseInt(params.id || 0);
    const [contentData, setContentData] = useState({});
    const rewardData = useSelector((state) => state.softwareReward.list);
    const { detail, response_status } = useSelector((state) => state.software);
    const settings = useSelector((state) => state.settings);
    const { isMobile } = useContext(RouteContext);
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['software/find'];
    const [commentVisible, setCommentVisible] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'software/view',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    if (typeof response_status === 'number' && response_status > 200) return <Redirect to="/404" />;

    if (!detail || loading) return <Loading />;
    const {
        name,
        attributes,
        description,
        releases,
        custom_description,
        logo,
        content,
        html,
        author,
        column,
        use_author,
        comment_count,
        allow_edit,
        created_time,
        updated_time,
        version,
        draft_version,
        view,
        tags,
    } = detail;
    const onContentReady = (view, config) => {
        setContentData({
            view,
            config,
        });
    };

    const renderContent = () => {
        return (
            <div className={styles['content']}>
                {
                    <Editor.Viewer
                        key={id}
                        content={content}
                        html={html}
                        genAnchor={true}
                        onLoad={onContentReady}
                    />
                }
                <p className={styles['footer']}>
                    <Link className={styles['time']} to={`/software/${id}`}>
                        {updated_time === null || version === 1 ? '发布于' : '更新于'}
                        <Timer
                            time={
                                updated_time === null || version === 1 ? created_time : updated_time
                            }
                        />
                    </Link>
                    {allow_edit && (
                        <EditButton
                            className={styles['edit']}
                            type="link"
                            href={`/software/${id}/edit`}
                        >
                            编辑{draft_version > version ? '（有未发布的草稿）' : ''}
                        </EditButton>
                    )}
                </p>
            </div>
        );
    };

    const getAttributes = (key) => {
        switch (key) {
            case 'vendor':
                return '发行厂商';
            case 'publishDate':
                return '发行时间';
            case 'lastUpdatedDate':
                return '最近更新';
            case 'lastUpdatedVersion':
                return '最新版本';
            case 'website':
                return '厂商官网';
        }
    };

    const renderAttributes = () => {
        if (!attributes && attributes.length === 0) return;
        return (
            <div className={styles['software-attributes']}>
                <Descriptions column={1} size="small" bordered>
                    {attributes.map(({ id, name, value }) => (
                        <Descriptions.Item key={id} label={getAttributes(name)}>
                            {name === 'website' ? (
                                <a target="_blank" href={value}>
                                    {value}
                                </a>
                            ) : (
                                value
                            )}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    const copy = (text) => {
        if (copyToClipboard(text)) message.success('复制成功');
        else message.success('复制失败');
    };

    const renderColumns = () => [
        {
            title: '文件名',
            dataIndex: 'title',
            key: 'title',
            render: (_, { title, name, size, md5, sha1, sha256 }) => {
                return (
                    <Popover
                        placement="bottom"
                        content={
                            <>
                                {name && (
                                    <span>
                                        <strong>文件：</strong>
                                        {name}
                                        <br />
                                    </span>
                                )}
                                {size && (
                                    <span>
                                        <strong>大小：</strong>
                                        {filesize(size)}
                                        <br />
                                    </span>
                                )}
                                {md5 && (
                                    <span>
                                        <strong>MD5：</strong>
                                        {md5}
                                        <br />
                                    </span>
                                )}
                                {sha1 && (
                                    <span>
                                        <strong>SHA1：</strong>
                                        {sha1}
                                        <br />
                                    </span>
                                )}
                                {sha256 && (
                                    <span>
                                        <strong>SHA256：</strong>
                                        {sha256}
                                        <br />
                                    </span>
                                )}
                            </>
                        }
                    >
                        {title}
                    </Popover>
                );
            },
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
            title: 'ED2K',
            dataIndex: 'ed2k',
            key: 'ed2k',
            width: 60,
            render: (_, { name, ed2k, size }) => {
                if (!ed2k) return '无';
                const url = `ed2k://|file|${name}|${size}|${ed2k}|/`;
                return (
                    <Tooltip title={url}>
                        <a onClick={() => copy(url)}>复制</a>
                    </Tooltip>
                );
            },
        },
        {
            title: 'BT',
            key: 'magnet',
            width: 60,
            dataIndex: 'magnet',
            render: (_, { name, magnet, size }) => {
                if (!magnet) return '无';
                const url = `magnet:?xt=urn:btih:${magnet}&dn=${name}&xl=${size}`;
                return (
                    <Tooltip title={url}>
                        <a onClick={() => copy(url)}>复制</a>
                    </Tooltip>
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

    const recommendFiles = [];
    if (releases) {
        releases.forEach(({ updaters }) => {
            updaters.forEach(({ files }) => {
                files.forEach((file) => {
                    if (file.is_recommend) recommendFiles.push(file);
                });
            });
        });
    }

    const keywords = tags.map((tag) => tag.name) || [];
    keywords.push('itellyou');

    return (
        <>
            <Helmet>
                <title>{`${name} - 下载 - ${settings.title}`}</title>
                <meta name="author" content={author.name} />
                <meta name="keywords" content={keywords.join(',')} />
                <meta name="description" content={description} />
            </Helmet>
            <Container>
                <Layout>
                    <Space direction="vertical" size="large">
                        <div className={styles['software-view']}>
                            <Card>
                                <div className={styles['header']}>
                                    <h2 className={styles['title']}>
                                        <Link
                                            to={`/software/${id}`}
                                            dangerouslySetInnerHTML={{ __html: name }}
                                        />
                                    </h2>
                                    <Space className={styles['tags']}>
                                        {tags &&
                                            tags.map(({ id, name }) => (
                                                <Tag
                                                    key={id}
                                                    id={id}
                                                    href={`/tag/${id}`}
                                                    title={name}
                                                />
                                            ))}
                                        <span className={styles['view']}>{view}次浏览</span>
                                    </Space>
                                </div>
                                {renderAttributes()}
                                <GoogleHorizontal />
                                <div className={styles['body']}>{renderContent()}</div>
                                {recommendFiles.length > 0 && (
                                    <div className={styles['software-recommend']}>
                                        <h2 className={styles['title']}>推荐版本</h2>
                                        <Table
                                            rowKey="id"
                                            dataSource={recommendFiles}
                                            columns={renderColumns()}
                                            size="small"
                                            pagination={false}
                                            bordered
                                        />
                                    </div>
                                )}

                                <h2 className={styles['title']}>所有版本</h2>
                                {renderReleases()}
                                <RewardButton
                                    author={author}
                                    dataType="software"
                                    dataKey={id}
                                    dataSource={rewardData}
                                />
                                <Space size="large">
                                    <Vote id={id} {...detail} />
                                    <CommentButton
                                        onClick={() => setCommentVisible(!commentVisible)}
                                    >
                                        {comment_count === 0
                                            ? '添加评论'
                                            : `${comment_count} 条评论`}
                                    </CommentButton>
                                    {!isMobile && !use_author && (
                                        <ReportButton id={id} type="software" />
                                    )}
                                </Space>
                                <div>{commentVisible && <Comment id={id} />}</div>
                            </Card>
                        </div>
                        <GoogleHorizontal />
                    </Space>
                    <React.Fragment>
                        <Editor.Outline
                            {...contentData}
                            style={{ width: (1056 * 29.16666667) / 100 - 22 }}
                        />
                    </React.Fragment>
                </Layout>
            </Container>
        </>
    );
};
SoftwareDetail.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;

    const state = getState();
    const { software } = state;
    if (software && typeof software.response_status === 'number' && software.response_status > 200)
        return state;

    const id = parseInt(match.params.id || 0);
    const response = await dispatch({
        type: 'software/find',
        payload: {
            id,
            ...params,
        },
    });

    if (!response || !response.result) return getState();
    if (isServer) {
        await dispatch({
            type: 'softwareComment/root',
            payload: {
                softwareId: id,
                offset: 0,
                limit: 20,
                ...params,
            },
        });
    }

    await dispatch({
        type: 'softwareReward/list',
        payload: {
            id,
            append: false,
            limit: 99999,
            ...params,
        },
    });
    if (isServer) return getState();
};
export default SoftwareDetail;
