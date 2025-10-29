# 📸 How to Upload Your App Logo

## Where to Place Your Logo

### Primary Logo Location:
📁 **`client/public/logo.png`**

Simply place your logo image file named `logo.png` in the `client/public/` folder.

### Current Public Folder Path:
```
c:\Users\Andrew\Downloads\OWESMART-ENT-1\OWESMART-ENT-1\client\public\
```

## Supported Image Formats
- ✅ PNG (recommended for transparency)
- ✅ JPG/JPEG
- ✅ SVG (scalable, recommended for logos)
- ✅ WEBP

## Logo Specifications

### Recommended Sizes:
- **Square format:** 512x512px or 256x256px
- **Transparent background** (PNG format)
- **File size:** Under 200KB for optimal loading

### Where Your Logo Appears:
1. **Login Page** - Center top (64x64px display)
2. **Global Navigation** - Top-left corner (28x28px display)
3. **All pages** (except landing page)

## Step-by-Step Instructions

### Option 1: Simple Rename (Recommended)
1. Navigate to: `client/public/`
2. Delete or rename the existing `logo.png` (if any)
3. Copy your logo image there
4. Rename it to `logo.png`
5. Refresh your browser (Ctrl+F5 for hard refresh)

### Option 2: Keep Original Filename
If you want to use a different name like `my-brand-logo.png`:

1. Place your logo in `client/public/`
2. Update these files:
   - `client/src/components/GlobalLogo.js` - line 17: change `src="/logo.png"`
   - `client/src/pages/Login.js` - line 48: change `src="/logo.png"`

## Current Image in Public Folder
You currently have: `OIP.webp`

You can:
- Rename it to `logo.png`, OR
- Replace it with your own logo file

## Testing Your Logo
After adding your logo:
1. Open http://localhost:3000/login
2. Press `Ctrl+Shift+R` to hard refresh
3. You should see your logo at the top center

## Fallback Behavior
If the logo image is not found, the app will show a default icon (compass/target symbol) instead.

## Need Help?
- Make sure the file name is exactly `logo.png` (case-sensitive on some systems)
- Check that the file is directly in `public/` folder, not in a subfolder
- Clear browser cache if logo doesn't update
