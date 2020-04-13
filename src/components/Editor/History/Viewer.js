import React from 'react';
import classnames from 'classnames';
import { connect } from 'umi';
import { List, Tag, Switch, Radio, Button } from 'antd';
import Timer from '@/components/Timer';
import styles from './index.less';
import Loading from '@/components/Loading';

class Viewer extends React.PureComponent {
    state = {
        // 是否加载版本列表
        loading: true,
        filter: 'all',
        // all 全部，published 已发布
        versions: [],
        // 保存 ID 以实现先切换后加载
        currentVersionId: null,
        // 当前展示的视图 content - 正文，diff - 差异
        currentView: 'content',
        reverting: false,
    };

    constructor() {
        super();
        /**
         * 版本缓存，结构为 version_id => { version: '当前版本内容', diff: '与上一个版本的 diff'}
         * 1345 => {
         *   version: {} // 结构和 model.DocVersion 相同
         *   diff: {
         *     current: '当前版本'
         *     target: 'diff'
         *   }
         * }
         */

        this.cache = {};
    }

    componentDidMount() {
        const { dispatch, id } = this.props;
        dispatch({
            type: 'version/list',
            payload: {
                id,
            },
        }).then(res => {
            this.setState({
                loading: false,
                versions: res.data,
            });
            // 展示最新的版本
            if (res.data && res.data.length > 0) {
                this.showVersion(res.data[0].id);
            }
        });
    }

    switchView = key => {
        if (key === 'diff') {
            const current = this.state.currentVersionId;
            const versions = this.state.versions;
            const index = this.state.versions.findIndex(item => {
                return item.id === current;
            });

            let base = null;
            if (index !== versions.length - 1) {
                base = versions[index + 1].id;
            }

            this.showDiff(current, base);
            return;
        }

        this.setState({
            currentView: key,
        });
    };

    renderVersionListItem = item => {
        if (this.state.filter === 'published' && !item.published) {
            return null;
        }

        return (
            <List.Item
                className={classnames(
                    styles.version,
                    item.id === this.state.currentVersionId ? styles.current : null,
                )}
            >
                <div
                    className={styles['version-meta']}
                    onClick={() => {
                        this.showVersion(item.id);
                    }}
                >
                    <div className={styles['version-name']}>
                        <Timer time={item.created_time} />
                        {item.published === true && <Tag>已发布</Tag>}
                    </div>
                    {item.author && (
                        <div className={styles['version-editor']}>{item.author.name}</div>
                    )}
                </div>
            </List.Item>
        );
    };

    // 是否最新版本
    isLatest = versionId => {
        const versions = this.state.versions;
        return versions.length > 0 && versions[0].id === versionId;
    };

    // 是否第一个版本
    isFirst = versionId => {
        const versions = this.state.versions;
        return versions.length > 0 && versions[versions.length - 1].id === versionId;
    };

    canRevert = () => {
        const { currentVersionId, versions } = this.state;
        if (versions.length === 0) return false;

        const { id } = this.props;
        if (!id) return true;
        // 只能恢复非当前版本
        return currentVersionId && !this.isLatest(currentVersionId);
    };

    /**
     * 展示特定版本
     *
     * @param {number} versionId 文档版本 ID
     */
    showVersion = version_id => {
        // 已经加载过，直接展示
        if (this.cache[version_id]) {
            this.setState({
                currentVersionId: version_id,
                currentView: 'content',
            });
            return;
        }
        // 获取数据并展示
        const { dispatch, id } = this.props;
        dispatch({
            type: 'version/find',
            payload: {
                version_id,
                id,
            },
        }).then(res => {
            if (!res.result) return;
            // 缓存数据
            this.cache[version_id] = {
                version: res.data,
                diff: null,
            };
            // 更新视图
            this.setState({
                currentVersionId: version_id,
                currentView: 'content',
            });
        });
    };

    /**
     *
     * @param {number}current 版本1 ID
     * @param {number}current 版本2 ID
     */
    revert(version_id) {
        const { dispatch, id, onReverted } = this.props;
        this.setState({
            reverting: true,
        });
        dispatch({
            type: 'doc/revert',
            payload: {
                version_id,
                id,
            },
        }).then(res => {
            this.setState({
                reverting: false,
            });
            if (onReverted) {
                onReverted(res);
            }
        });
    }

    // 切换展示视图
    renderContent() {
        const currentVersionId = this.state.currentVersionId;
        if (!currentVersionId) return null;
        const version = this.cache[currentVersionId].version; // const { user } = this.state.versions.find(item => item.id === currentVersionId);

        return <React.Fragment>{this.props.renderVersion(version)}</React.Fragment>;
    }

    // 渲染 diff
    renderDiff() {
        if (!this.state.currentVersionId) return null;
        const diff = this.cache[this.state.currentVersionId].diff;
        if (!diff) return null;
        return <div>{this.props.renderDiff(diff.current, diff.target)}</div>;
    }
    // 渲染文档版本基本信息

    showDiff = (current, base) => {
        // 已经加载过，直接展示
        if (this.cache[current].diff) {
            this.setState({
                currentView: 'diff',
            });
            return;
        }

        const onDataReady = data => {
            // 缓存数据
            this.cache[current].diff = {
                current: data.current || '',
                target: data.target || '',
            };
            // 更新视图
            this.setState({
                currentView: 'diff',
            });
        };
        // 第一个版本，用当前内容版本内容处理
        if (this.isFirst(current)) {
            onDataReady({
                current: this.cache[current].version.html,
                target: '',
            });
            return;
        }
        // 获取数据并展示
        const { dispatch, id } = this.props;
        dispatch({
            type: 'version/diff',
            payload: {
                id,
                str: ''.concat(current, '...').concat(base || ''),
            },
        }).then(res => {
            if (!res.result) return;
            onDataReady(res.data);
        });
    };

    render() {
        let versions = this.state.versions;
        if (this.state.loading) {
            return <Loading />;
        }

        if (!versions || versions.length === 0) {
            return <div>暂无历史版本</div>;
        }

        if (this.state.filter === 'published') {
            versions = versions.filter(item => {
                return item.published === true;
            });
        }

        return (
            <div className={styles['doc-history']}>
                <div className={styles['doc-history-nav']}>
                    <div className={styles['title']}>历史版本</div>
                    <div className={styles['version-filter']}>
                        仅显示已发布版本
                        <Switch
                            className={styles['action']}
                            size="small"
                            defaultChecked={false}
                            onChange={checked => {
                                this.setState({
                                    filter: checked ? 'published' : 'all',
                                });
                            }}
                        />
                    </div>
                    <List
                        className={styles['version-list']}
                        bordered={false}
                        dataSource={versions}
                        renderItem={this.renderVersionListItem}
                    />
                </div>
                <div className={styles['doc-history-body']}>
                    <div className={styles['version-viewer-content']}>
                        {this.state.currentView === 'content' && this.renderContent()}
                        {this.state.currentView === 'diff' && this.renderDiff()}
                    </div>
                    <div className={styles['version-viewer-footer']}>
                        <Radio.Group
                            onChange={e => {
                                this.switchView(e.target.value);
                            }}
                            value={this.state.currentView}
                        >
                            <Radio value="content">全文</Radio>
                            <Radio value="diff">与上个版本的差异</Radio>
                        </Radio.Group>
                        <div className={styles['actions']}>
                            <Button onClick={this.props.onCancel}>取消</Button>
                            <Button
                                type="primary"
                                loading={this.state.reverting}
                                onClick={() => {
                                    this.revert(this.state.currentVersionId);
                                }}
                                disabled={!this.canRevert()}
                            >
                                恢复此版本
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({}) => ({}))(Viewer);
