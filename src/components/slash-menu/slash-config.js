/**
 * Slash Menu Configuration Registry
 * Defines all available slash commands with their properties
 */

export const SLASH_GROUPS = {
    blocks: { id: 'blocks', label: 'Basic blocks', order: 1 },
    headings: { id: 'headings', label: 'Headings', order: 2 },
    lists: { id: 'lists', label: 'Lists', order: 3 },
    advanced: { id: 'advanced', label: 'Advanced', order: 4 },
    media: { id: 'media', label: 'Media', order: 5 },
    layout: { id: 'layout', label: 'Layout', order: 6 },
};

export const SLASH_COMMANDS = {
    // Basic Blocks
    paragraph: {
        id: 'paragraph',
        label: 'Paragraph',
        description: 'Regular text paragraph',
        icon: '¶',
        iconBg: '#6366f1',
        keywords: ['p', 'paragraph', 'text'],
        action: editor => editor.chain().focus().setParagraph().run(),
        group: 'blocks',
        order: 1,
        defaultEnabled: true,
    },
    blockquote: {
        id: 'blockquote',
        label: 'Quote',
        description: 'Insert a blockquote',
        icon: '"',
        iconBg: '#8b5cf6',
        keywords: ['quote', 'blockquote', 'cite'],
        action: editor => editor.chain().focus().toggleBlockquote().run(),
        group: 'blocks',
        order: 2,
        defaultEnabled: true,
    },
    codeBlock: {
        id: 'codeBlock',
        label: 'Code Block',
        description: 'Insert code with syntax highlighting',
        icon: '{}',
        iconBg: '#0ea5e9',
        keywords: ['code', 'code block', 'syntax'],
        action: editor => editor.chain().focus().toggleCodeBlock().run(),
        group: 'blocks',
        order: 3,
        defaultEnabled: true,
    },

    // Headings
    heading1: {
        id: 'heading1',
        label: 'Heading 1',
        description: 'Big section heading',
        icon: 'H₁',
        iconBg: '#ef4444',
        keywords: ['h1', 'heading', 'title', 'heading 1'],
        action: editor => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        group: 'headings',
        order: 1,
        defaultEnabled: true,
    },
    heading2: {
        id: 'heading2',
        label: 'Heading 2',
        description: 'Medium section heading',
        icon: 'H₂',
        iconBg: '#f97316',
        keywords: ['h2', 'heading', 'subtitle', 'heading 2'],
        action: editor => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        group: 'headings',
        order: 2,
        defaultEnabled: true,
    },
    heading3: {
        id: 'heading3',
        label: 'Heading 3',
        description: 'Small section heading',
        icon: 'H₃',
        iconBg: '#f59e0b',
        keywords: ['h3', 'heading', 'subheading', 'heading 3'],
        action: editor => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        group: 'headings',
        order: 3,
        defaultEnabled: true,
    },
    heading4: {
        id: 'heading4',
        label: 'Heading 4',
        description: 'Tiny section heading',
        icon: 'H₄',
        iconBg: '#eab308',
        keywords: ['h4', 'heading', 'heading 4'],
        action: editor => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        group: 'headings',
        order: 4,
        defaultEnabled: false,
    },

    // Lists
    bulletList: {
        id: 'bulletList',
        label: 'Bullet List',
        description: 'Create an unordered list',
        icon: '•',
        iconBg: '#10b981',
        keywords: ['ul', 'bullet', 'list', 'unordered'],
        action: editor => editor.chain().focus().toggleBulletList().run(),
        group: 'lists',
        order: 1,
        defaultEnabled: true,
    },
    numberedList: {
        id: 'numberedList',
        label: 'Numbered List',
        description: 'Create an ordered list',
        icon: '1.',
        iconBg: '#14b8a6',
        keywords: ['ol', 'numbered', 'list', 'ordered'],
        action: editor => editor.chain().focus().toggleOrderedList().run(),
        group: 'lists',
        order: 2,
        defaultEnabled: true,
    },
    taskList: {
        id: 'taskList',
        label: 'Task List',
        description: 'Create a checklist',
        icon: '✓',
        iconBg: '#06b6d4',
        keywords: ['todo', 'task', 'checkbox', 'checklist'],
        action: editor => editor.chain().focus().toggleTaskList().run(),
        group: 'lists',
        order: 3,
        defaultEnabled: false,
    },

    // Advanced
    table: {
        id: 'table',
        label: 'Table',
        description: 'Insert a table',
        icon: '⊞',
        iconBg: '#6366f1',
        keywords: ['table', 'grid', 'spreadsheet'],
        action: editor => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        group: 'advanced',
        order: 1,
        defaultEnabled: false,
    },
    inlineMath: {
        id: 'inlineMath',
        label: 'Inline Math',
        description: 'Insert inline LaTeX equation',
        icon: 'ƒ',
        iconBg: '#8b5cf6',
        keywords: ['math', 'latex', 'equation', 'formula', 'inline'],
        action: editor => {
            // Use setTimeout to allow menu to close first
            setTimeout(() => {
                const latex = window.prompt('Enter LaTeX expression:');
                if (latex) {
                    // Insert inline math using the Mathematics extension
                    editor.chain().focus().insertContent(`$${latex}$`).run();
                }
            }, 100);
        },
        group: 'advanced',
        order: 2,
        defaultEnabled: false,
    },
    blockMath: {
        id: 'blockMath',
        label: 'Block Math',
        description: 'Insert block LaTeX equation',
        icon: 'Σ',
        iconBg: '#a855f7',
        keywords: ['math', 'latex', 'equation', 'formula', 'block'],
        action: editor => {
            // Use setTimeout to allow menu to close first
            setTimeout(() => {
                const latex = window.prompt('Enter LaTeX expression:');
                if (latex) {
                    // Insert block math using the Mathematics extension
                    editor.chain().focus().insertContent(`$$${latex}$$`).run();
                }
            }, 100);
        },
        group: 'advanced',
        order: 3,
        defaultEnabled: false,
    },

    // Media
    image: {
        id: 'image',
        label: 'Image',
        description: 'Upload or embed an image',
        icon: '🖼',
        iconBg: '#ec4899',
        keywords: ['image', 'picture', 'photo', 'img'],
        action: editor => {
            // Use setTimeout to allow menu to close first
            setTimeout(() => {
                const url = window.prompt('Image URL:');
                if (url) {
                    // Add alt text option
                    const alt = window.prompt('Image alt text (optional):', '');
                    editor.chain().focus().setImage({
                        src: url,
                        alt: alt || '',
                        title: alt || ''
                    }).run();
                }
            }, 100);
        },
        group: 'media',
        order: 1,
        defaultEnabled: false,
    },
    video: {
        id: 'video',
        label: 'YouTube',
        description: 'Embed a YouTube video',
        icon: '▶',
        iconBg: '#f43f5e',
        keywords: ['video', 'youtube', 'embed', 'media'],
        action: editor => {
            // Use setTimeout to allow menu to close first
            setTimeout(() => {
                const url = window.prompt('YouTube URL:');
                if (url) {
                    // Extract YouTube video ID
                    let videoId = null;

                    // Handle different YouTube URL formats
                    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                    const match = url.match(youtubeRegex);

                    if (match && match[1]) {
                        videoId = match[1];
                    }

                    if (videoId) {
                        // Use the YouTube extension to insert an embedded video
                        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        editor.chain().focus().setYoutubeVideo({ src: embedUrl }).run();
                    } else {
                        alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
                    }
                }
            }, 100);
        },
        group: 'media',
        order: 2,
        defaultEnabled: false,
    },

    // Layout
    divider: {
        id: 'divider',
        label: 'Divider',
        description: 'Insert a horizontal divider line',
        icon: '─',
        iconBg: '#64748b',
        keywords: ['divider', 'separator', 'line', 'hr', 'horizontal rule'],
        action: editor => editor.chain().focus().setHorizontalRule().run(),
        group: 'layout',
        order: 1,
        defaultEnabled: false,
    },
};

/**
 * Get slash commands filtered by configuration
 * @param {Object} config - Configuration object with enabled/disabled commands
 * @returns {Array} - Array of enabled slash commands
 */
export function getEnabledSlashCommands(config = {}) {
    return Object.entries(SLASH_COMMANDS)
        .filter(([key, command]) => {
            const configKey = `slash_${key}`;
            return config[configKey] !== false && (config[configKey] === true || command.defaultEnabled);
        })
        .map(([key, command]) => ({ ...command, key }))
        .sort((a, b) => {
            if (a.group !== b.group) {
                const groupA = SLASH_GROUPS[a.group];
                const groupB = SLASH_GROUPS[b.group];
                return (groupA?.order || 0) - (groupB?.order || 0);
            }
            return a.order - b.order;
        });
}

/**
 * Get slash commands grouped by their group
 * @param {Object} config - Configuration object with enabled/disabled commands
 * @returns {Object} - Object with groups as keys and commands as values
 */
export function getGroupedSlashCommands(config = {}) {
    const enabledCommands = getEnabledSlashCommands(config);
    const grouped = {};

    enabledCommands.forEach(command => {
        if (!grouped[command.group]) {
            grouped[command.group] = {
                ...SLASH_GROUPS[command.group],
                commands: [],
            };
        }
        grouped[command.group].commands.push(command);
    });

    return Object.values(grouped).sort((a, b) => a.order - b.order);
}

/**
 * Filter slash commands by search query
 * @param {Array} commands - Array of slash commands
 * @param {String} query - Search query
 * @returns {Array} - Filtered commands
 */
export function filterSlashCommands(commands, query) {
    if (!query || query === '/') {
        return commands;
    }

    const searchTerm = query.toLowerCase().replace('/', '');

    return commands.filter(command => {
        const labelMatch = command.label.toLowerCase().includes(searchTerm);
        const descMatch = command.description.toLowerCase().includes(searchTerm);
        const keywordMatch = command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));

        return labelMatch || descMatch || keywordMatch;
    });
}

/**
 * Get suggestion items for slash command
 * Used by the TipTap suggestion extension
 * @param {String} query - Current query string
 * @param {Object} config - Configuration object
 * @returns {Array} - Filtered and sorted commands
 */
export function getSlashSuggestions({ query, config = {} }) {
    const enabled = getEnabledSlashCommands(config);
    return filterSlashCommands(enabled, query);
}
