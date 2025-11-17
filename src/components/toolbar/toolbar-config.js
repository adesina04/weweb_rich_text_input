/**
 * Toolbar Configuration Registry
 * Defines all available toolbar items with their properties
 */

export const TOOLBAR_GROUPS = {
    formatting: { id: 'formatting', label: 'Text Formatting', order: 1 },
    alignment: { id: 'alignment', label: 'Alignment', order: 2 },
    lists: { id: 'lists', label: 'Lists', order: 3 },
    blocks: { id: 'blocks', label: 'Blocks', order: 4 },
    insert: { id: 'insert', label: 'Insert', order: 5 },
    table: { id: 'table', label: 'Table', order: 6 },
    history: { id: 'history', label: 'History', order: 7 },
};

export const TOOLBAR_ITEMS = {
    // Text Formatting Group
    bold: {
        id: 'bold',
        label: 'Bold',
        icon: 'lucide/bold',
        action: 'toggleBold',
        shortcut: 'Mod-B',
        group: 'formatting',
        order: 1,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('bold'),
    },
    italic: {
        id: 'italic',
        label: 'Italic',
        icon: 'lucide/italic',
        action: 'toggleItalic',
        shortcut: 'Mod-I',
        group: 'formatting',
        order: 2,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('italic'),
    },
    underline: {
        id: 'underline',
        label: 'Underline',
        icon: 'lucide/underline',
        action: 'toggleUnderline',
        shortcut: 'Mod-U',
        group: 'formatting',
        order: 3,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('underline'),
    },
    strike: {
        id: 'strike',
        label: 'Strikethrough',
        icon: 'lucide/strikethrough',
        action: 'toggleStrike',
        shortcut: 'Mod-Shift-X',
        group: 'formatting',
        order: 4,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('strike'),
    },
    textColor: {
        id: 'textColor',
        label: 'Text Color',
        icon: 'lucide/palette',
        type: 'color-picker',
        group: 'formatting',
        order: 5,
        defaultEnabled: true,
    },

    // Alignment Group
    alignLeft: {
        id: 'alignLeft',
        label: 'Align Left',
        icon: 'lucide/align-left',
        action: 'setTextAlign',
        actionArgs: ['left'],
        group: 'alignment',
        order: 1,
        defaultEnabled: false,
        activeCheck: editor => editor.isActive({ textAlign: 'left' }),
    },
    alignCenter: {
        id: 'alignCenter',
        label: 'Align Center',
        icon: 'lucide/align-center',
        action: 'setTextAlign',
        actionArgs: ['center'],
        group: 'alignment',
        order: 2,
        defaultEnabled: false,
        activeCheck: editor => editor.isActive({ textAlign: 'center' }),
    },
    alignRight: {
        id: 'alignRight',
        label: 'Align Right',
        icon: 'lucide/align-right',
        action: 'setTextAlign',
        actionArgs: ['right'],
        group: 'alignment',
        order: 3,
        defaultEnabled: false,
        activeCheck: editor => editor.isActive({ textAlign: 'right' }),
    },
    alignJustify: {
        id: 'alignJustify',
        label: 'Justify',
        icon: 'lucide/align-justify',
        action: 'setTextAlign',
        actionArgs: ['justify'],
        group: 'alignment',
        order: 4,
        defaultEnabled: false,
        activeCheck: editor => editor.isActive({ textAlign: 'justify' }),
    },

    // Lists Group
    bulletList: {
        id: 'bulletList',
        label: 'Bullet List',
        icon: 'lucide/list',
        action: 'toggleBulletList',
        shortcut: 'Mod-Shift-8',
        group: 'lists',
        order: 1,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('bulletList'),
    },
    orderedList: {
        id: 'orderedList',
        label: 'Numbered List',
        icon: 'lucide/list-ordered',
        action: 'toggleOrderedList',
        shortcut: 'Mod-Shift-7',
        group: 'lists',
        order: 2,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('orderedList'),
    },
    taskList: {
        id: 'taskList',
        label: 'Task List',
        icon: 'lucide/list-checks',
        action: 'toggleTaskList',
        group: 'lists',
        order: 3,
        defaultEnabled: false,
        activeCheck: editor => editor.isActive('taskList'),
    },

    // Blocks Group
    blockquote: {
        id: 'blockquote',
        label: 'Quote',
        icon: 'lucide/quote',
        action: 'toggleBlockquote',
        shortcut: 'Mod-Shift-B',
        group: 'blocks',
        order: 1,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('blockquote'),
    },
    codeBlock: {
        id: 'codeBlock',
        label: 'Code Block',
        icon: 'lucide/code',
        action: 'toggleCodeBlock',
        shortcut: 'Mod-Alt-C',
        group: 'blocks',
        order: 2,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('codeBlock'),
    },

    // Insert Group
    link: {
        id: 'link',
        label: 'Link',
        icon: 'lucide/link',
        action: 'setLink',
        shortcut: 'Mod-K',
        group: 'insert',
        order: 1,
        defaultEnabled: true,
        activeCheck: editor => editor.isActive('link'),
    },
    image: {
        id: 'image',
        label: 'Image',
        icon: 'lucide/image',
        action: 'setImage',
        group: 'insert',
        order: 2,
        defaultEnabled: false,
    },
    inlineMath: {
        id: 'inlineMath',
        label: 'Inline Math',
        icon: 'lucide/square-function',
        action: 'insertInlineMath',
        group: 'insert',
        order: 3,
        defaultEnabled: false,
    },
    blockMath: {
        id: 'blockMath',
        label: 'Block Math',
        icon: 'lucide/sigma',
        action: 'insertBlockMath',
        group: 'insert',
        order: 4,
        defaultEnabled: false,
    },

    // Table Group
    insertTable: {
        id: 'insertTable',
        label: 'Insert Table',
        icon: 'table-insert',
        type: 'table-icon',
        action: 'insertTable',
        group: 'table',
        order: 1,
        defaultEnabled: false,
    },

    // History Group
    undo: {
        id: 'undo',
        label: 'Undo',
        icon: 'lucide/undo',
        action: 'undo',
        shortcut: 'Mod-Z',
        group: 'history',
        order: 1,
        defaultEnabled: true,
    },
    redo: {
        id: 'redo',
        label: 'Redo',
        icon: 'lucide/redo',
        action: 'redo',
        shortcut: 'Mod-Shift-Z',
        group: 'history',
        order: 2,
        defaultEnabled: true,
    },
};

/**
 * Get toolbar items filtered by configuration
 * @param {Object} config - Configuration object with enabled/disabled items
 * @returns {Array} - Array of enabled toolbar items
 */
export function getEnabledToolbarItems(config = {}) {
    return Object.entries(TOOLBAR_ITEMS)
        .filter(([key, item]) => {
            const configKey = `toolbar_${key}`;
            return config[configKey] !== false && (config[configKey] === true || item.defaultEnabled);
        })
        .map(([key, item]) => ({ ...item, key }))
        .sort((a, b) => {
            if (a.group !== b.group) {
                const groupA = TOOLBAR_GROUPS[a.group];
                const groupB = TOOLBAR_GROUPS[b.group];
                return (groupA?.order || 0) - (groupB?.order || 0);
            }
            return a.order - b.order;
        });
}

/**
 * Get toolbar items grouped by their group
 * @param {Object} config - Configuration object with enabled/disabled items
 * @returns {Object} - Object with groups as keys and items as values
 */
export function getGroupedToolbarItems(config = {}) {
    const enabledItems = getEnabledToolbarItems(config);
    const grouped = {};

    enabledItems.forEach(item => {
        if (!grouped[item.group]) {
            grouped[item.group] = {
                ...TOOLBAR_GROUPS[item.group],
                items: [],
            };
        }
        grouped[item.group].items.push(item);
    });

    return Object.values(grouped).sort((a, b) => a.order - b.order);
}

/**
 * Map old parameter names to new toolbar item keys
 * For backward compatibility with existing configurations
 */
export const LEGACY_PARAMETER_MAP = {
    parameterBold: 'toolbar_bold',
    parameterItalic: 'toolbar_italic',
    parameterUnderline: 'toolbar_underline',
    parameterStrike: 'toolbar_strike',
    parameterTextColor: 'toolbar_textColor',
    parameterAlignLeft: 'toolbar_alignLeft',
    parameterAlignCenter: 'toolbar_alignCenter',
    parameterAlignRight: 'toolbar_alignRight',
    parameterAlignJustify: 'toolbar_alignJustify',
    parameterBulletList: 'toolbar_bulletList',
    parameterOrderedList: 'toolbar_orderedList',
    parameterTaskList: 'toolbar_taskList',
    parameterTable: 'toolbar_insertTable',
    parameterLink: 'toolbar_link',
    parameterImage: 'toolbar_image',
    parameterCodeBlock: 'toolbar_codeBlock',
    parameterQuote: 'toolbar_blockquote',
    parameterInlineMath: 'toolbar_inlineMath',
    parameterBlockMath: 'toolbar_blockMath',
    parameterUndo: 'toolbar_undo',
    parameterRedo: 'toolbar_redo',
};

/**
 * Convert legacy configuration to new format
 * @param {Object} content - Component content configuration
 * @returns {Object} - New format configuration
 */
export function convertLegacyConfig(content) {
    const newConfig = {};
    Object.entries(LEGACY_PARAMETER_MAP).forEach(([oldKey, newKey]) => {
        if (content[oldKey] !== undefined) {
            newConfig[newKey] = content[oldKey];
        }
    });
    return newConfig;
}
