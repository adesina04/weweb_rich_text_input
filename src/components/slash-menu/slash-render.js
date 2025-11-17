/**
 * Slash Menu Render Helper
 * Creates and manages the slash menu popup using Tippy.js
 */

import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';
import SlashMenuList from './SlashMenuList.vue';

/**
 * Render slash menu with Tippy.js (compatible with TipTap suggestion)
 * @param {Object} options - Render options
 * @param {Function} options.onSelect - Callback when command is selected
 * @param {Function} options.onCancel - Callback when menu is cancelled
 * @param {Function} options.getDarkMode - Function to get current dark mode state
 * @returns {Object} - Render functions for TipTap suggestion
 */
export function renderSlashMenu({ onSelect, onCancel, getDarkMode = () => false }) {
    let component;
    let popup;
    let isDestroyed = false;

    return {
        onStart: props => {
            isDestroyed = false;
            console.log('[Slash Render] onStart called', {
                itemsCount: props.items?.length,
                query: props.query,
                hasClientRect: !!props.clientRect,
                hasEditor: !!props.editor,
            });

            const executeHandler = (command) => {
                console.log('[Slash Render] Execute handler called', command?.label);

                if (isDestroyed) {
                    console.warn('[Slash Render] Already destroyed, ignoring execution');
                    return;
                }

                // Mark as destroyed immediately to prevent any further updates
                isDestroyed = true;

                // Destroy popup completely with all its internals
                if (popup && popup[0]) {
                    const tippyInstance = popup[0];

                    try {
                        // Disable all updates
                        tippyInstance.setProps({
                            onShow: () => false,
                            onMount: () => false,
                            onShown: () => false,
                            onHide: () => false,
                            onHidden: () => false,
                        });

                        // Hide first
                        tippyInstance.hide();

                        // Destroy after a tiny delay to ensure hide completes
                        setTimeout(() => {
                            try {
                                tippyInstance.destroy();
                            } catch (e) {
                                console.warn('[Slash Render] Error in delayed destroy:', e);
                            }
                        }, 0);
                    } catch (error) {
                        console.warn('[Slash Render] Error destroying popup:', error);
                    }

                    popup = null;
                }

                // Destroy component
                if (component) {
                    try {
                        component.destroy();
                    } catch (error) {
                        console.warn('[Slash Render] Error destroying component:', error);
                    }
                    component = null;
                }

                // Execute command after cleanup
                if (command && command.action) {
                    // Delete the slash trigger first
                    props.editor
                        .chain()
                        .focus()
                        .deleteRange(props.range)
                        .run();

                    // Then execute the command
                    command.action(props.editor);
                }
            };

            const cancelHandler = () => {
                console.log('[Slash Render] Cancel handler called');

                if (isDestroyed) return;

                if (popup && popup[0]) {
                    popup[0].hide();
                    popup[0].destroy();
                    popup = null;
                }

                isDestroyed = true;

                if (component) {
                    component.destroy();
                    component = null;
                }
            };

            component = new VueRenderer(SlashMenuList, {
                props: {
                    commands: props.items,
                    query: props.query,
                    onExecute: executeHandler,
                    onCancel: cancelHandler,
                    darkMode: getDarkMode(),
                },
                editor: props.editor,
            });

            console.log('[Slash Render] VueRenderer created', {
                hasComponent: !!component,
                hasElement: !!component?.element,
                hasRef: !!component?.ref,
            });

            if (!props.clientRect) {
                console.warn('[Slash Render] No clientRect provided, skipping popup creation');
                return;
            }

            try {
                // Get the document body - handle both WeWeb and standard environments
                const getAppendTarget = () => {
                    if (typeof wwLib !== 'undefined' && wwLib.getFrontDocument) {
                        return wwLib.getFrontDocument().body;
                    }
                    return document.body;
                };

                // Create a safe getReferenceClientRect function that won't throw
                const safeGetClientRect = () => {
                    try {
                        const rect = props.clientRect ? props.clientRect() : null;
                        if (rect && rect.left !== undefined) {
                            return rect;
                        }
                    } catch (e) {
                        console.warn('[Slash Render] Error getting clientRect:', e);
                    }
                    // Return a default rect if we can't get the real one
                    return {
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                    };
                };

                popup = tippy(document.body, {
                    getReferenceClientRect: safeGetClientRect,
                    appendTo: getAppendTarget,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    theme: 'slash-menu',
                    maxWidth: 'none',
                    offset: [0, 8],
                    zIndex: 9999,
                });

                console.log('[Slash Render] Tippy popup created', {
                    hasPopup: !!popup,
                    isArray: Array.isArray(popup),
                    popupCount: popup?.length,
                });
            } catch (error) {
                console.error('[Slash Menu] Failed to create popup:', error);
            }
        },

        onUpdate: props => {
            // Immediately return if destroyed - don't do anything
            if (isDestroyed) {
                return;
            }

            // Double check popup still exists
            if (!popup || !popup[0]) {
                return;
            }

            // Double check component still exists
            if (!component) {
                return;
            }

            try {
                component.updateProps({
                    commands: props.items,
                    query: props.query,
                    darkMode: getDarkMode(),
                });
            } catch (error) {
                console.warn('[Slash Render] Error updating component:', error);
                return;
            }

            if (!props.clientRect) {
                return;
            }

            try {
                // Don't even attempt to update position if destroyed
                if (isDestroyed || !popup || !popup[0]) {
                    return;
                }

                // Create safe function that returns null instead of throwing
                const safeGetClientRect = () => {
                    if (isDestroyed) return null;

                    try {
                        const rect = props.clientRect ? props.clientRect() : null;
                        if (rect && rect.left !== undefined) {
                            return rect;
                        }
                    } catch (e) {
                        // Silently fail - just return null
                        return null;
                    }
                    return null;
                };

                const newRect = safeGetClientRect();
                if (newRect && !isDestroyed && popup && popup[0]) {
                    popup[0].setProps({
                        getReferenceClientRect: () => newRect,
                    });
                }
            } catch (error) {
                // Silently catch all errors in update
            }
        },

        onKeyDown: props => {
            if (isDestroyed) return false;

            if (props.event.key === 'Escape') {
                if (popup && popup[0]) {
                    popup[0].hide();
                    popup[0].destroy();
                    popup = null;
                }
                isDestroyed = true;
                if (component) {
                    component.destroy();
                    component = null;
                }
                return true;
            }

            // Let the component handle arrow keys and enter
            return false;
        },

        onExit: () => {
            console.log('[Slash Render] onExit called');

            if (isDestroyed) {
                console.log('[Slash Render] Already destroyed in onExit');
                return;
            }

            isDestroyed = true;

            if (popup && popup[0]) {
                try {
                    popup[0].destroy();
                } catch (error) {
                    console.warn('[Slash Render] Error destroying popup:', error);
                }
                popup = null;
            }

            if (component) {
                try {
                    component.destroy();
                } catch (error) {
                    console.warn('[Slash Render] Error destroying component:', error);
                }
                component = null;
            }
        },
    };
}
