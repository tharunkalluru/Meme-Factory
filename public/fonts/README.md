# Fonts Directory

This directory contains the Impact font used for meme text rendering.

## Required Font

- **Font Name:** Impact
- **File Name:** `Impact.ttf`
- **Purpose:** Classic meme text styling (white text with black outline)

## Installation

### Mac

```bash
cp /System/Library/Fonts/Supplemental/Impact.ttf .
```

### Windows

```powershell
Copy-Item "C:\Windows\Fonts\Impact.ttf" -Destination "."
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install ttf-mscorefonts-installer
cp /usr/share/fonts/truetype/msttcorefonts/Impact.ttf .
```

## Alternative Fonts

If Impact isn't available, you can use these alternatives:

1. **Anton** - [Google Fonts](https://fonts.google.com/specimen/Anton)
2. **Oswald** - [Google Fonts](https://fonts.google.com/specimen/Oswald)
3. **Arial Black** - Available on most systems

Download and rename to `Impact.ttf` in this directory.

## Verification

To verify the font is installed correctly:

```bash
# Check if file exists
ls Impact.ttf

# Check file size (should be ~200-400KB)
du -h Impact.ttf
```

## Font License

Impact is a commercial font included with Windows and macOS. If you're using this project commercially, ensure you have the appropriate license or use a free alternative.

Free alternatives:
- Anton (SIL Open Font License)
- Oswald (SIL Open Font License)

## Troubleshooting

### Font not rendering correctly?

1. Verify file exists: `ls Impact.ttf`
2. Check file permissions: `chmod 644 Impact.ttf`
3. Restart development server
4. Clear browser cache

### Still having issues?

The app will fall back to system fonts (Arial Black, sans-serif) if Impact isn't found, but the styling won't be as authentic.

---

**Note:** This directory is required for the app to function. Do not delete it.

