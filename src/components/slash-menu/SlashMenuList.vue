<template>
    <div v-if="filteredCommands.length > 0" class="slash-menu-list" :class="{ 'dark-mode': darkMode }">
        <div v-if="!hideFilter" class="slash-menu-list__filter">
            <input
                ref="filterInput"
                v-model="filterQuery"
                type="text"
                class="slash-menu-list__filter-input"
                placeholder="Filter..."
                @keydown="handleFilterKeydown"
            />
        </div>
        <div class="slash-menu-list__items" ref="itemsContainer">
            <template v-for="(group, groupIndex) in groupedCommands" :key="group.id">
                <div v-if="group.commands.length > 0" class="slash-menu-list__group">
                    <div class="slash-menu-list__group-label">{{ group.label }}</div>
                    <SlashMenuItem
                        v-for="(command, cmdIndex) in group.commands"
                        :key="command.key"
                        :command="command"
                        :is-selected="getFlatIndex(groupIndex, cmdIndex) === selectedIndex"
                        :index="getFlatIndex(groupIndex, cmdIndex)"
                        @select="selectCommand"
                        @execute="executeCommand"
                    />
                </div>
            </template>
        </div>
        <div v-if="filteredCommands.length === 0" class="slash-menu-list__empty">
            No commands found
        </div>
    </div>
</template>

<script>
import SlashMenuItem from './SlashMenuItem.vue';
import { getGroupedSlashCommands, filterSlashCommands } from './slash-config.js';

export default {
    name: 'SlashMenuList',
    components: {
        SlashMenuItem,
    },
    props: {
        commands: {
            type: Array,
            required: true,
        },
        query: {
            type: String,
            default: '',
        },
        hideFilter: {
            type: Boolean,
            default: false,
        },
        onExecute: {
            type: Function,
            default: null,
        },
        onCancel: {
            type: Function,
            default: null,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['execute', 'cancel'],
    data() {
        return {
            selectedIndex: 0,
            filterQuery: '',
        };
    },
    computed: {
        filteredCommands() {
            const searchQuery = this.filterQuery || this.query;
            return filterSlashCommands(this.commands, searchQuery);
        },
        groupedCommands() {
            const grouped = {};
            this.filteredCommands.forEach(command => {
                if (!grouped[command.group]) {
                    grouped[command.group] = {
                        id: command.group,
                        label: command.group.charAt(0).toUpperCase() + command.group.slice(1),
                        commands: [],
                    };
                }
                grouped[command.group].commands.push(command);
            });
            return Object.values(grouped);
        },
    },
    watch: {
        filteredCommands() {
            this.selectedIndex = 0;
        },
    },
    mounted() {
        this.setupKeyboardNavigation();
    },
    methods: {
        setupKeyboardNavigation() {
            this.keyHandler = event => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    this.selectNext();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    this.selectPrevious();
                } else if (event.key === 'Enter') {
                    event.preventDefault();
                    this.executeSelected();
                } else if (event.key === 'Escape') {
                    event.preventDefault();
                    if (this.onCancel) {
                        this.onCancel();
                    }
                    this.$emit('cancel');
                }
            };
            window.addEventListener('keydown', this.keyHandler);
        },
        getFlatIndex(groupIndex, commandIndex) {
            let flatIndex = 0;
            for (let i = 0; i < groupIndex; i++) {
                flatIndex += this.groupedCommands[i].commands.length;
            }
            return flatIndex + commandIndex;
        },
        selectCommand(index) {
            this.selectedIndex = index;
            this.scrollToSelected();
        },
        selectNext() {
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
            this.scrollToSelected();
        },
        selectPrevious() {
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.scrollToSelected();
        },
        executeSelected() {
            const command = this.filteredCommands[this.selectedIndex];
            if (command) {
                this.executeCommand(command);
            }
        },
        executeCommand(command) {
            if (this.onExecute) {
                this.onExecute(command);
            }
            this.$emit('execute', command);
        },
        scrollToSelected() {
            this.$nextTick(() => {
                const container = this.$refs.itemsContainer;
                if (!container) return;

                const items = container.querySelectorAll('.slash-menu-item');
                const selectedItem = items[this.selectedIndex];
                if (!selectedItem) return;

                const containerRect = container.getBoundingClientRect();
                const itemRect = selectedItem.getBoundingClientRect();

                if (itemRect.bottom > containerRect.bottom) {
                    selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else if (itemRect.top < containerRect.top) {
                    selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            });
        },
        handleFilterKeydown(event) {
            if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
                this.keyHandler(event);
            }
        },
    },
    beforeUnmount() {
        if (this.keyHandler) {
            window.removeEventListener('keydown', this.keyHandler);
        }
    },
};
</script>

<style lang="scss" scoped>
.slash-menu-list {
    background: var(--slash-menu-bg, #ffffff);
    border: 1px solid var(--slash-menu-border, rgba(0, 0, 0, 0.1));
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
    min-width: 320px;
    max-width: 400px;
    max-height: 450px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &__filter {
        padding: 12px;
        border-bottom: 1px solid var(--slash-menu-border, rgba(0, 0, 0, 0.1));
    }

    &__filter-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--slash-menu-border, rgba(0, 0, 0, 0.1));
        border-radius: 6px;
        font-size: 14px;
        background: var(--slash-input-bg, #f9fafb);
        color: var(--slash-input-color, #1a1a1a);
        outline: none;
        transition: all 150ms;

        &:focus {
            border-color: var(--slash-input-focus, #3b82f6);
            background: var(--slash-menu-bg, #ffffff);
        }

        &::placeholder {
            color: var(--slash-input-placeholder, #9ca3af);
        }
    }

    &__items {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--slash-scrollbar, rgba(0, 0, 0, 0.2));
            border-radius: 4px;

            &:hover {
                background: var(--slash-scrollbar-hover, rgba(0, 0, 0, 0.3));
            }
        }
    }

    &__group {
        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    &__group-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--slash-group-label, #6b7280);
        padding: 0 12px 6px;
        margin-bottom: 4px;
    }

    &__empty {
        padding: 32px 16px;
        text-align: center;
        color: var(--slash-empty-color, #9ca3af);
        font-size: 14px;
    }
}

// Dark theme support
.slash-menu-list.dark-mode {
    --slash-menu-bg: #1a1a1a;
    --slash-menu-border: rgba(255, 255, 255, 0.1);
    --slash-input-bg: #262626;
    --slash-input-color: #e5e7eb;
    --slash-input-placeholder: #6b7280;
    --slash-input-focus: #60a5fa;
    --slash-scrollbar: rgba(255, 255, 255, 0.2);
    --slash-scrollbar-hover: rgba(255, 255, 255, 0.3);
    --slash-group-label: #9ca3af;
    --slash-empty-color: #6b7280;

    :deep(.slash-menu-item) {
        &:hover,
        &.is-selected {
            background: rgba(255, 255, 255, 0.1);
        }

        .slash-menu-item__title {
            color: #e5e7eb;
        }

        .slash-menu-item__description {
            color: #9ca3af;
        }
    }
}
</style>
