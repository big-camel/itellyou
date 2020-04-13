import React from 'react';
import nodeHtmldiff from 'node-htmldiff';
import { Modal } from 'antd';
import TextViewer from '../Viewer';
import HistoryViewer from './Viewer';
import styles from './index.less';
import Tag from '@/components/Tag';

class History extends React.PureComponent {
    renderVersion(version) {
        return (
            <TextViewer
                key={'version-'.concat(version.id)}
                id={'version-'.concat(version.id)}
                content={version.content}
            />
        );
    }

    renderExtra(version) {
        const { extra } = this.props;
        return extra && typeof extra === 'function' ? extra(version) : extra;
    }

    /**
     * 渲染 diff
     *
     * @param {string} current 当前内容
     * @param {string} base 历史内容
     */
    renderDiff(current, base) {
        if (current === base) {
            return <span>同上个版本内容一致</span>;
        }

        const result = nodeHtmldiff(
            base,
            current,
            styles['html-diff'],
            null,
            'iframe,video,em,strong,del',
        );
        return (
            <div
                className={styles['doc-diff']}
                dangerouslySetInnerHTML={{
                    __html: result,
                }}
            />
        );
    }

    render() {
        const { id, onReverted, onCancel } = this.props;

        return (
            <Modal
                className={styles['doc-history-modal']}
                width={1080}
                style={{
                    top: 56,
                }}
                title={null}
                footer={null}
                visible={true}
                closable={false}
                onCancel={onCancel}
            >
                <HistoryViewer
                    id={id}
                    onReverted={onReverted}
                    onCancel={onCancel}
                    renderVersion={version => (
                        <React.Fragment>
                            {this.renderExtra(version)}
                            {this.renderVersion(version)}
                        </React.Fragment>
                    )}
                    renderDiff={this.renderDiff}
                />
            </Modal>
        );
    }
}
export default History;
