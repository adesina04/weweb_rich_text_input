<template>
    <div
        class="slash-menu-item"
        :class="{
            'is-selected': isSelected,
        }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
    >
        <div class="slash-menu-item__icon" :style="{ background: command.iconBg || '#6366f1' }">
            {{ command.icon }}
        </div>
        <div class="slash-menu-item__content">
            <div class="slash-menu-item__title">{{ command.label }}</div>
            <div class="slash-menu-item__description">{{ command.description }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SlashMenuItem',
    props: {
        command: {
            type: Object,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        index: {
            type: Number,
            required: true,
        },
    },
    emits: ['select', 'execute'],
    methods: {
        handleClick() {
            this.$emit('execute', this.command);
        },
        handleMouseEnter() {
            this.$emit('select', this.index);
        },
    },
};
</script>

<style lang="scss" scoped>
.slash-menu-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background var(--slash-transition, 150ms cubic-bezier(0.4, 0, 0.2, 1));
    user-select: none;

    &:hover,
    &.is-selected {
        background: var(--slash-item-hover, rgba(0, 0, 0, 0.05));
    }

    &__icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 600;
        color: white;
        background: #6366f1;
    }

    &__content {
        flex: 1;
        min-width: 0;
        padding-top: 2px;
    }

    &__title {
        font-size: 14px;
        font-weight: 500;
        color: var(--slash-item-title, #1a1a1a);
        margin-bottom: 2px;
        line-height: 1.4;
    }

    &__description {
        font-size: 13px;
        color: var(--slash-item-description, #6b7280);
        line-height: 1.4;
    }
}
</style>
