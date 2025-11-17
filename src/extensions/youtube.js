/**
 * YouTube Extension for TipTap
 * Allows embedding YouTube videos as iframes
 */

import { Node, mergeAttributes } from '@tiptap/core';

export const YouTube = Node.create({
    name: 'youtube',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: 640,
            },
            height: {
                default: 480,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-youtube-video] iframe',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { 'data-youtube-video': '' },
            [
                'iframe',
                mergeAttributes(HTMLAttributes, {
                    frameborder: '0',
                    allowfullscreen: 'true',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                }),
            ],
        ];
    },

    addCommands() {
        return {
            setYoutubeVideo:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },
});
