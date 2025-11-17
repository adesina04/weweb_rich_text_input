<template>
    <div v-if="visibleItems.length > 0" class="toolbar-group">
        <ToolbarButton
            v-for="item in visibleItems"
            :key="item.key"
            :icon="item.icon"
            :icon-type="item.type || 'lucide'"
            :label="item.label"
            :tooltip="getTooltip(item)"
            :is-active="getIsActive(item)"
            :disabled="!isEditable"
            @click="handleItemClick(item)"
        />
        <div v-if="!isLastGroup" class="toolbar-group__separator"></div>
    </div>
</template>

<script>
import ToolbarButton from './ToolbarButton.vue';

export default {
    name: 'ToolbarGroup',
    components: {
        ToolbarButton,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        editor: {
            type: Object,
            required: true,
        },
        isEditable: {
            type: Boolean,
            default: true,
        },
        isLastGroup: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['action'],
    computed: {
        visibleItems() {
            return this.items.filter(item => item !== null && item !== undefined);
        },
    },
    methods: {
        getTooltip(item) {
            let tooltip = item.label;
            if (item.shortcut) {
                const shortcut = item.shortcut.replace('Mod', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
                tooltip += ` (${shortcut})`;
            }
            return tooltip;
        },
        getIsActive(item) {
            if (!this.editor || !item.activeCheck) {
                return false;
            }
            try {
                return item.activeCheck(this.editor);
            } catch (e) {
                return false;
            }
        },
        handleItemClick(item) {
            this.$emit('action', {
                action: item.action,
                args: item.actionArgs || [],
                item,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.toolbar-group {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    position: relative;

    &__separator {
        width: 1px;
        height: 24px;
        background: var(--toolbar-separator-color, rgba(0, 0, 0, 0.1));
        margin: 0 6px;
        flex-shrink: 0;
    }
}

// Dark theme support
:root[data-theme='dark'] .toolbar-group {
    &__separator {
        background: var(--toolbar-separator-color, rgba(255, 255, 255, 0.1));
    }
}
</style>
