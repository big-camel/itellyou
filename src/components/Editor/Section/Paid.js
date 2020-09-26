import SectionBase from '@itellyou/itellyou-editor/library/section/base';
import Engine from '@itellyou/itellyou-engine';

class PaidSection extends SectionBase {
    constructor(engine, contentView) {
        super();
        this.section = Engine.section;
        this.engine = engine;
        this.contentView = contentView;
    }

    render(container, value) {
        value = value || {};
        // 初始化 section 节点
        container.append(Engine.$('<div>test</div>'));
    }
}
PaidSection.type = 'block';
export default PaidSection;
