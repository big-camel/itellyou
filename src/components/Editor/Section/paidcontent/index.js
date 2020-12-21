import SectionBase from '@itellyou/itellyou-editor/library/section/base';
import Engine from '@itellyou/itellyou-engine';
import './index.less';

const template = (locale) => {
    return '\n    <div class="itellyou-paidcontent">\n      '.concat('\n    </div>\n  ');
};

class PaidSection extends SectionBase {
    constructor(engine, contentView) {
        super();
        this.section = Engine.section;
        this.engine = engine;
        this.contentView = contentView;
    }
    /**
     * Section 工具栏
     */
    embedToolbar() {
        const { options } = this.engine || this.contentView || {};
        const config = options['paid-content'] || {};
        const embed = [
            {
                type: 'dnd',
            },
            {
                type: 'copy',
            },
            {
                type: 'separator',
            },
            {
                type: 'delete',
            },
        ];
        if (Array.isArray(config.embed)) {
            return config.embed;
        } else if (typeof config.embed === 'object') {
            const embedArray = [];
            embed.forEach((item) => {
                if (config.embed[item.type] !== false) {
                    embedArray.push(item);
                }
            });
            return embedArray;
        } else {
            return embed;
        }
    }

    activate() {
        if (this.engine) this.engine.toolbar.disable(true);
    }

    unactivate() {
        if (this.engine) this.engine.toolbar.disable(false);
    }

    renderView() {}

    renderEditor() {
        this.subEngine = Engine.create(this.editorContainer, {
            plugins: [
                'bold',
                'italic',
                'fontcolor',
                'fontsize',
                'strikethrough',
                'underline',
                'backcolor',
                'removeformat',
                'code',
                'file',
                'label',
                'list',
                'link',
                'image',
                'tasklist',
                'indent',
                'emoji',
            ],
            lang: this.engine.options.lang,
            //image: imageOptions,
            emoji: this.engine.options.emoji,
            onBeforeRenderImage: this.engine.options.onBeforeRenderImage,
            file: this.engine.options.file,
        });
    }

    render(_, value) {
        value = value || {
            id: 0,
            title: '',
        };
        this.paidContentContainer = Engine.$(
            '<div class="itellyou-paidcontent"><div class="sub-editor"><div class="sub-editor-content"></div></div></div>',
        );
        this.subEditorContainer = this.paidContentContainer.find('.sub-editor');
        this.editorContainer = this.subEditorContainer.find('.sub-editor-content');
        console.log(this.subEditorContainer, this.editorContainer);
        this.container.append(this.paidContentContainer);
        this.subEditorContainer
            .on('mousedown', (e) => e.stopPropagation())
            .on('dragstart', (e) => {
                return e.stopPropagation();
            })
            .on('contextmenu', (e) => {
                return e.preventDefault();
            })
            .on('select', (e) => {
                return e.preventDefault();
            });
        this.renderEditor();
    }
}
PaidSection.type = 'block';
PaidSection.uid = true;
export default PaidSection;
