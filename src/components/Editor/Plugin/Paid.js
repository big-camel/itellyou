const PLUGIN_NAME = 'paid';
export default {
    initialize: function () {
        // 创建命令
        this.command.add(PLUGIN_NAME, {
            execute: () => {
                this.change.insertSection(PLUGIN_NAME);
            },
        });
        // 快捷键
        const options = this.options[PLUGIN_NAME] || {
            hotkey: 'mod+shift+m',
        };

        if (!!options.hotkey) {
            this.hotkey.set(options.hotkey, PLUGIN_NAME);
        }
    },
};
