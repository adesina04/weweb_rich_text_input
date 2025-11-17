# Debugging Slash Commands

## Quick Checklist

### 1. Is the feature enabled?
In WeWeb editor settings, check:
- ✅ "Enable Slash Commands" toggle is ON
- ✅ At least one slash command is enabled (check individual toggles)

### 2. Check browser console (F12)
Type "/" in the editor and look for:
- Any error messages
- Console.log messages showing command detection

### 3. Test manually:
1. Click in the editor
2. Type "/" character
3. Menu should appear immediately

### 4. Verify configuration
Open browser console and run:
```javascript
// Check if slash menu is enabled
console.log('Slash menu enabled:', component.content.enableSlashMenu);

// Check enabled commands
console.log('Enabled commands:',
  Object.keys(component.content)
    .filter(k => k.startsWith('slash_'))
    .map(k => ({ key: k, enabled: component.content[k] }))
);
```

### 5. Common Issues

**Menu doesn't appear:**
- Check that `enableSlashMenu` is `true`
- Check that at least one `slash_*` property is `true`
- Check browser console for JavaScript errors
- Verify TipTap Suggestion extension is loaded

**Menu appears but no commands:**
- All slash commands might be disabled
- Enable at least: `slash_paragraph`, `slash_heading1`, `slash_bulletList`

**Commands don't execute:**
- Check browser console for errors
- Verify command actions are defined in slash-config.js

### 6. Manual Enable (Temporary Test)

If toggles don't work, manually enable in browser console:
```javascript
// Enable slash menu
component.content.enableSlashMenu = true;

// Enable specific commands
component.content.slash_paragraph = true;
component.content.slash_heading1 = true;
component.content.slash_heading2 = true;
component.content.slash_bulletList = true;
component.content.slash_numberedList = true;

// Reload editor (might be needed)
component.loadEditor();
```

### 7. Check Extension Loading

In browser console:
```javascript
// Check if editor has slash command extension
console.log('Extensions:', component.richEditor.extensionManager.extensions.map(e => e.name));

// Should include 'slashCommand' in the list
```

### 8. Debug Output

Add this to wwElement.vue temporarily (in loadEditor method, after extensions array):
```javascript
console.log('Slash menu enabled:', this.content.enableSlashMenu);
console.log('Enabled slash commands:', getEnabledSlashCommands(this.content));
```

This will show in console what commands are actually enabled.

### 9. Force Re-initialization

If configuration changes don't take effect:
1. Toggle "Enable Slash Commands" OFF
2. Save
3. Toggle "Enable Slash Commands" ON
4. Refresh the page
5. Test again

### 10. Fallback: Check TipTap Version

The Suggestion extension might have version compatibility issues. Check:
```javascript
// In browser console
console.log('TipTap version:', component.richEditor.version);
```

Should be compatible with v2.8.0 (your current version).
