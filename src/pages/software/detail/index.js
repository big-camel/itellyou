import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useSelector, Helmet, Redirect, useDispatch, Link } from 'umi';
import { Space, Descriptions, Tabs, message, Empty, Collapse, Table, Tooltip, Popover } from 'antd';
import copyToClipboard from 'copy-to-clipboard';
import filesize from 'filesize';
import QueueAnim from 'rc-queue-anim';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { RouteContext } from '@/context';
import { RewardButton } from '@/components/Button';
import Loading from '@/components/Loading';
import Editor from '@/components/Editor';
import { GoogleDefault } from '@/components/AdSense';
import { CommentButton, EditButton, ReportButton, ShareButton } from '@/components/Button';
import { HeaderContainer, HeaderLogo } from '@/components/Header';
import Timer from '@/components/Timer';
import Time from '@/utils/time';
import Tag from '@/components/Tag';
import { getScrollTop, scrollToElement } from '@/utils';
import Footer from '@/components/Footer';
import { Vote, Comment } from './components/Action';
import styles from './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const SoftwareDetail = ({ match: { params } }) => {
    const id = parseInt(params.id || 0);
    const [scrollVisible, setScrollVisible] = useState(false);
    const [viewMode, setViewMode] = useState('');
    const commentViewRef = useRef();
    const [contentData, setContentData] = useState({});
    const rewardData = useSelector((state) => state.softwareReward.list);
    const { detail, response_status } = useSelector((state) => state.software);
    const settings = useSelector((state) => state.settings);
    const { isMobile } = useContext(RouteContext);
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['software/find'];

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'software/view',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    const handleScroll = useCallback(() => {
        const min = 80;
        const top = getScrollTop();
        setScrollVisible(top > min);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    if (response_status && response_status.id === id && response_status.code > 200)
        return <Redirect to="/404" />;

    if (!detail || loading) return <Loading />;

    const {
        name,
        attributes,
        description,
        releases,
        content,
        html,
        author,
        use_author,
        comment_count,
        allow_edit,
        created_time,
        updated_time,
        version,
        draft_version,
        view_count,
        tags,
    } = detail;

    const onContentReady = (view, config) => {
        setContentData({
            view,
            config,
        });
        const hasOutline = (config || {}).outline && config.outline.length > 0;

        setViewMode(hasOutline ? 'middle' : '');

        if (window.location.hash) {
            const scrollId = window.location.hash.substr(1);
            scrollToElement(document.getElementById(scrollId));
        }
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
            width: 105,
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
            <HeaderContainer
                isMobile={isMobile}
                mode={scrollVisible ? viewMode : ''}
                className={styles['header-top']}
                after={
                    <Space size="large">
                        <EditButton type="primary" href="/article/new">
                            写文章
                        </EditButton>
                    </Space>
                }
            >
                <HeaderLogo />
            </HeaderContainer>
            <div className={styles['main-wrapper']}>
                <div className={styles['main-body']}>
                    <div className={styles['software-view']}>
                        <Space direction="vertical" size="middle">
                            <div className={styles['header']}>
                                <h2 className={styles['title']}>
                                    <Link
                                        to={`/software/${id}`}
                                        dangerouslySetInnerHTML={{ __html: name }}
                                    />
                                </h2>
                            </div>
                            {renderAttributes()}
                            <GoogleDefault type="rectangle" />
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
                            <div>
                                <h2 className={styles['title']}>所有版本</h2>
                                {renderReleases()}
                            </div>
                            <div className={styles['body']}>{renderContent()}</div>
                            <RewardButton
                                author={author}
                                dataType="software"
                                dataKey={id}
                                dataSource={rewardData}
                            />
                            <Space className={styles['footer']}>
                                <span className={styles['view']}>阅读 {view_count} , </span>
                                <Link className={styles['time']} to={`/download/${id}`}>
                                    {updated_time === null || version === 1 ? '发布于 ' : '更新于 '}
                                    <Timer
                                        time={
                                            updated_time === null || version === 1
                                                ? created_time
                                                : updated_time
                                        }
                                    />
                                </Link>
                                {allow_edit && (
                                    <EditButton
                                        className={styles['edit']}
                                        type="link"
                                        href={`/software/${id}/edit`}
                                        size="small"
                                    >
                                        编辑{draft_version > version ? '（有未发布的草稿）' : ''}
                                    </EditButton>
                                )}
                            </Space>
                            <Space className={styles['tags']}>
                                {tags &&
                                    tags.map(({ id, name }) => (
                                        <Tag key={id} id={id} href={`/tag/${id}`} title={name} />
                                    ))}
                            </Space>
                            <Space size="middle">
                                <Vote id={id} {...detail} />
                                <CommentButton
                                    onClick={() => scrollToElement(commentViewRef.current)}
                                >
                                    {comment_count === 0 ? '添加评论' : `${comment_count} 条评论`}
                                </CommentButton>
                                {!isMobile && !use_author && (
                                    <ReportButton id={id} type="software" />
                                )}
                            </Space>
                            <GoogleDefault type="rectangle" />
                            <div ref={commentViewRef}>
                                <Comment id={id} />
                            </div>
                        </Space>
                    </div>
                </div>
                {!isMobile && (
                    <QueueAnim animConfig={[{ opacity: [1, 0] }]} className={styles['side']}>
                        {scrollVisible ? (
                            <Space key="side" size="large" direction="vertical">
                                <div className={styles['like-action']}>
                                    <Vote
                                        id={id}
                                        {...detail}
                                        allow_oppose={false}
                                        text={
                                            detail.use_support
                                                ? `已点赞 ${detail.support_count}`
                                                : `点赞 ${detail.support_count}`
                                        }
                                        icon={
                                            detail.use_support ? <LikeFilled /> : <LikeOutlined />
                                        }
                                        loading={false}
                                    />
                                </div>
                                <RewardButton block simple author={detail.author}>
                                    打赏
                                </RewardButton>
                                <CommentButton
                                    block
                                    onClick={() => scrollToElement(commentViewRef.current)}
                                >
                                    {comment_count === 0 ? '评论' : `${comment_count} 评论`}
                                </CommentButton>
                                <ShareButton block>分享</ShareButton>
                            </Space>
                        ) : null}
                    </QueueAnim>
                )}
                {!isMobile && (
                    <QueueAnim animConfig={[{ opacity: [1, 0] }]} className={styles['outline']}>
                        {scrollVisible ? (
                            <Editor.Outline
                                key="outline"
                                className={styles['outline-view']}
                                {...contentData}
                            />
                        ) : null}
                    </QueueAnim>
                )}
                <Footer />
            </div>
        </>
    );
};
SoftwareDetail.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;
    const id = parseInt(match.params.id || 0);
    const state = getState();
    const { software } = state;
    if (
        software &&
        software.response_status &&
        software.response_status.id === id &&
        software.response_status.code > 200
    )
        return state;

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
