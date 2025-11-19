<template>
    <div class="modular-toolbar" :style="toolbarStyles">
        <div class="modular-toolbar__content">
            <!-- Text Type Dropdown (if enabled) -->
            <select
                v-if="showTextType"
                v-model="currentTextType"
                class="modular-toolbar__text-type"
                :disabled="!isEditable"
            >
                <option v-for="option in textTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <!-- Toolbar Groups -->
            <ToolbarGroup
                v-for="(group, index) in toolbarGroups"
                :key="group.id"
                :items="group.items"
                :editor="editor"
                :is-editable="isEditable"
                :is-last-group="index === toolbarGroups.length - 1"
                @action="handleAction"
            />

            <!-- Color Picker (special handling) -->
            <div v-if="hasColorPicker" class="modular-toolbar__color-wrapper">
                <label class="toolbar-button" :title="'Text color'">
                    <div class="toolbar-button__icon" v-html="colorIconHTML"></div>
                    <input
                        type="color"
                        :value="currentColor"
                        @input="handleColorChange"
                        :disabled="!isEditable"
                        class="modular-toolbar__color-input"
                    />
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import ToolbarGroup from './ToolbarGroup.vue';
import { getGroupedToolbarItems, TOOLBAR_ITEMS } from './toolbar-config.js';

const TAGS_MAP = {
    p: 0,
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
};

export default {
    name: 'ModularToolbar',
    components: {
        ToolbarGroup,
    },
    props: {
        editor: {
            type: Object,
            required: true,
        },
        config: {
            type: Object,
            default: () => ({}),
        },
        isEditable: {
            type: Boolean,
            default: true,
        },
        showTextType: {
            type: Boolean,
            default: true,
        },
        menuColor: {
            type: String,
            default: '#000000ad',
        },
        menuBackgroundColor: {
            type: String,
            default: '#fafafa',
        },
        menuPosition: {
            type: String,
            default: 'left',
        },
        menuHoverBg: {
            type: String,
            default: '#eee',
        },
        menuHoverIconColor: {
            type: String,
            default: '#000000',
        },
    },
    emits: ['action'],
    data() {
        return {
            colorIconHTML: '',
        };
    },
    computed: {
        toolbarGroups() {
            const groups = getGroupedToolbarItems(this.config);
            // Filter out textColor and special items from groups
            return groups.map(group => ({
                ...group,
                items: group.items.filter(item => item.id !== 'textColor'),
            }));
        },
        hasColorPicker() {
            const colorItem = TOOLBAR_ITEMS.textColor;
            const configKey = 'toolbar_textColor';
            return (
                this.config[configKey] !== false && (this.config[configKey] === true || colorItem.defaultEnabled)
            );
        },
        currentColor() {
            if (!this.editor) return '#000000';
            return this.editor.getAttributes('textStyle')?.color || '#000000';
        },
        currentTextType: {
            get() {
                if (!this.editor) return 0;
                const option = this.textTypeOptions.find(opt => opt.active);
                return option ? option.value : 0;
            },
            set(value) {
                if (value === 0) {
                    this.editor.chain().focus().setParagraph().run();
                } else {
                    this.editor.chain().focus().toggleHeading({ level: Number(value) }).run();
                }
            },
        },
        textTypeOptions() {
            if (!this.editor) return [];
            return [
                { label: 'Paragraph', value: 0, active: this.editor.isActive('paragraph') },
                { label: 'Heading 1', value: 1, active: this.editor.isActive('heading', { level: 1 }) },
                { label: 'Heading 2', value: 2, active: this.editor.isActive('heading', { level: 2 }) },
                { label: 'Heading 3', value: 3, active: this.editor.isActive('heading', { level: 3 }) },
                { label: 'Heading 4', value: 4, active: this.editor.isActive('heading', { level: 4 }) },
                { label: 'Heading 5', value: 5, active: this.editor.isActive('heading', { level: 5 }) },
                { label: 'Heading 6', value: 6, active: this.editor.isActive('heading', { level: 6 }) },
            ];
        },
        toolbarStyles() {
            const justifyMap = {
                left: 'flex-start',
                center: 'center',
                right: 'flex-end',
            };
            return {
                '--menu-color': this.menuColor,
                '--toolbar-bg': this.menuBackgroundColor,
                '--menu-hover-bg': this.menuHoverBg || '#eee',
                '--menu-hover-icon-color': this.menuHoverIconColor || '#000000',
                'justify-content': justifyMap[this.menuPosition] || 'flex-start',
            };
        },
    },
    mounted() {
        this.loadColorIcon();
    },
    methods: {
        async loadColorIcon() {
            try {
                const { getIcon } = wwLib.useIcons();
                this.colorIconHTML = await getIcon('lucide/palette');
            } catch (e) {
                console.warn('Failed to load color icon', e);
            }
        },
        handleAction({ action, args, item }) {
            this.$emit('action', { action, args, item });
        },
        handleColorChange(event) {
            const color = event.target.value;
            this.editor.chain().focus().setColor(color).run();
            this.$emit('action', { action: 'setColor', args: [color] });
        },
    },
};
</script>

<style lang="scss" scoped>
.modular-toolbar {
    --menu-color: #000000ad;
    display: flex;
    align-items: center;
    background: var(--toolbar-bg, #fafafa);
    border: 1px solid var(--toolbar-border, #e5e7eb);
    border-radius: var(--toolbar-radius, 8px);
    padding: 6px 8px;
    gap: 4px;
    overflow-x: auto;
    min-height: 48px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--toolbar-scrollbar, rgba(0, 0, 0, 0.2));
        border-radius: 3px;

        &:hover {
            background: var(--toolbar-scrollbar-hover, rgba(0, 0, 0, 0.3));
        }
    }

    &__content {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: nowrap;
        width: 100%;
    }

    &__text-type {
        padding: 6px 10px;
        border: 1px solid var(--toolbar-border, #e5e7eb);
        border-radius: 6px;
        background: var(--toolbar-select-bg, white);
        color: var(--menu-color);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        appearance: none;
        outline: none;
        transition: all 150ms;
        min-width: 120px;
        margin-right: 4px;

        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;

        &:hover:not(:disabled) {
            background-color: var(--toolbar-select-hover, #f9fafb);
        }

        &:focus {
            border-color: var(--toolbar-focus, #3b82f6);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &__color-wrapper {
        display: inline-flex;
        position: relative;
    }

    &__color-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
    }

    .toolbar-button {
        cursor: pointer;
        position: relative;

        &:hover {
            input[type='color'] {
                cursor: pointer;
            }
        }

        input[type='color'] {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
        }
    }
}

// Dark theme support
:root[data-theme='dark'] .modular-toolbar {
    --toolbar-bg: #262626;
    --toolbar-border: #404040;
    --toolbar-select-bg: #1a1a1a;
    --toolbar-select-hover: #333333;
    --toolbar-scrollbar: rgba(255, 255, 255, 0.2);
    --toolbar-scrollbar-hover: rgba(255, 255, 255, 0.3);

    &__text-type {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    }
}

// Responsive adjustments
@media (max-width: 768px) {
    .modular-toolbar {
        overflow-x: auto;
        flex-wrap: nowrap;

        &__content {
            flex-wrap: nowrap;
        }
    }
}
</style>
