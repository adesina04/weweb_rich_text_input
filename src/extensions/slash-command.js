/**
 * Slash Command Extension for TipTap
 * Enables "/" menu for quick block insertion
 */

import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                startOfLine: false,
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

/**
 * Create slash command suggestion configuration
 * @param {Object} options - Configuration options
 * @param {Function} options.getCommands - Function to get available commands
 * @param {Function} options.onRender - Function to render the menu
 * @returns {Object} - Suggestion configuration
 */
export function createSlashSuggestion({ getCommands, onRender }) {
    return {
        items: ({ query }) => {
            const commands = getCommands();

            if (!query || query === '/') {
                return commands;
            }

            const searchTerm = query.toLowerCase().replace('/', '');

            return commands.filter(command => {
                const labelMatch = command.label.toLowerCase().includes(searchTerm);
                const descMatch = command.description.toLowerCase().includes(searchTerm);
                const keywordMatch = command.keywords?.some(keyword =>
                    keyword.toLowerCase().includes(searchTerm)
                );

                return labelMatch || descMatch || keywordMatch;
            });
        },

        render: () => {
            let component;
            let popup;

            return {
                onStart: props => {
                    if (!props.items.length) {
                        return;
                    }

                    const renderResult = onRender({
                        props,
                        onSelect: (command) => {
                            if (command && command.action) {
                                // Execute the command action
                                command.action(props.editor);

                                // Delete the "/" trigger
                                props.editor
                                    .chain()
                                    .focus()
                                    .deleteRange(props.range)
                                    .run();
                            }
                        },
                        onCancel: () => {
                            if (popup && popup[0]) {
                                popup[0].hide();
                            }
                        },
                    });

                    component = renderResult.component;
                    popup = renderResult.popup;
                },

                onUpdate: props => {
                    if (!props.items.length) {
                        if (popup && popup[0]) {
                            popup[0].hide();
                        }
                        return;
                    }

                    if (component && component.updateProps) {
                        component.updateProps(props);
                    }

                    if (popup && popup[0]) {
                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect,
                        });
                    }
                },

                onKeyDown: props => {
                    if (props.event.key === 'Escape') {
                        if (popup && popup[0]) {
                            popup[0].hide();
                        }
                        return true;
                    }

                    if (!component || !component.ref) {
                        return false;
                    }

                    // Forward keyboard events to the menu component
                    if (props.event.key === 'ArrowDown' ||
                        props.event.key === 'ArrowUp' ||
                        props.event.key === 'Enter') {
                        // The component will handle these via window event listeners
                        return false;
                    }

                    return false;
                },

                onExit: () => {
                    if (popup && popup[0]) {
                        popup[0].destroy();
                    }
                    if (component && component.destroy) {
                        component.destroy();
                    }
                },
            };
        },

        command: ({ editor, range, props }) => {
            if (props && props.action) {
                props.action(editor);
                editor.chain().focus().deleteRange(range).run();
            }
        },
    };
}
