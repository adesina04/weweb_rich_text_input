<template>
    <button
        type="button"
        class="toolbar-button"
        :class="{
            'is-active': isActive,
            'is-disabled': disabled,
        }"
        :disabled="disabled"
        :title="tooltip"
        @click="handleClick"
    >
        <div v-if="iconType === 'lucide'" class="toolbar-button__icon" v-html="iconHTML"></div>
        <TableIcon v-else-if="iconType === 'table-icon'" :icon="icon" />
        <span v-else class="toolbar-button__icon">{{ icon }}</span>
        <span v-if="label && showLabel" class="toolbar-button__label">{{ label }}</span>
    </button>
</template>

<script>
import TableIcon from '../../icons/table-icon.vue';

export default {
    name: 'ToolbarButton',
    components: {
        TableIcon,
    },
    props: {
        icon: {
            type: String,
            required: true,
        },
        iconType: {
            type: String,
            default: 'lucide',
            validator: value => ['lucide', 'table-icon', 'text'].includes(value),
        },
        label: {
            type: String,
            default: '',
        },
        tooltip: {
            type: String,
            default: '',
        },
        showLabel: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['click'],
    data() {
        return {
            iconHTML: '',
        };
    },
    watch: {
        icon: {
            immediate: true,
            handler() {
                this.loadIcon();
            },
        },
    },
    methods: {
        async loadIcon() {
            if (this.iconType !== 'lucide') return;

            try {
                const { getIcon } = wwLib.useIcons();
                this.iconHTML = await getIcon(this.icon);
            } catch (e) {
                console.warn(`Failed to load icon: ${this.icon}`, e);
                this.iconHTML = '';
            }
        },
        handleClick(event) {
            if (!this.disabled) {
                this.$emit('click', event);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.toolbar-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px;
    border: none;
    background: transparent;
    color: var(--toolbar-button-color, rgba(0, 0, 0, 0.7));
    border-radius: var(--toolbar-button-radius, 4px);
    cursor: pointer;
    transition: all var(--toolbar-transition, 150ms cubic-bezier(0.4, 0, 0.2, 1));
    position: relative;
    overflow: hidden;
    min-width: 32px;
    min-height: 32px;

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        flex-shrink: 0;

        :deep(svg) {
            width: 18px;
            height: 18px;
            display: block;
        }
    }

    &__label {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
    }

    &:hover:not(.is-disabled) {
        background: var(--menu-hover-bg, var(--toolbar-button-hover, rgba(0, 0, 0, 0.05)));

        .toolbar-button__icon :deep(svg) {
            color: var(--menu-hover-icon-color, currentColor);
        }
    }

    &.is-active {
        background: var(--toolbar-button-active-bg, rgba(59, 130, 246, 0.1));
        color: var(--toolbar-button-active-color, #3b82f6);

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 2px;
            background: currentColor;
            border-radius: 2px 2px 0 0;
        }
    }

    &.is-disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 2px solid var(--toolbar-button-focus, #3b82f6);
        outline-offset: 2px;
    }
}

// Dark theme support
:root[data-theme='dark'] .toolbar-button {
    --toolbar-button-color: rgba(255, 255, 255, 0.8);
    --toolbar-button-hover: rgba(255, 255, 255, 0.1);
    --toolbar-button-active-bg: rgba(59, 130, 246, 0.2);
    --toolbar-button-active-color: #60a5fa;
}
</style>
