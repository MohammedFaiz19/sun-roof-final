# Image Management Guide for Sunroof Cafe

## Overview
This guide explains how to manage images for your restaurant website. All images are stored in a public folder for easy access and replacement.

## Image Location
All menu and asset images are stored in:
```
/public/assets/images/
```

This folder is:
- ✅ Publicly accessible
- ✅ Part of the deployed build
- ✅ Easy to update via FTP or hosting control panel

## File Naming Rules

### ✅ Good Filenames
- `chicken_burger.jpg`
- `pasta_alfredo.jpg`
- `hero_image_1.jpg`
- `menu_cover_starters.jpg`

### ❌ Bad Filenames
- `Chicken Burger!.jpg` (spaces and special characters)
- `PASTA ALFREDO.JPG` (uppercase)
- `menu-item#1.jpg` (special characters)

### Rules
1. **Lowercase only**: Use lowercase letters (a-z)
2. **Alphanumeric**: Use only letters, numbers, underscores (_), hyphens (-), and periods (.)
3. **No spaces**: Replace spaces with underscores
4. **Descriptive**: Use clear, meaningful names

## Image Format Guidelines

### Recommended Formats
- **JPEG (.jpg)**: For photos (menu items, restaurant photos)
- **PNG (.png)**: For logos or images with transparency
- **WEBP (.webp)**: For best compression (modern browsers)

### Image Size Recommendations
- **Menu item images**: 800x600px (4:3 ratio)
- **Hero/banner images**: 1920x1080px (16:9 ratio)
- **Category covers**: 1200x800px
- **Thumbnails**: 400x300px

### File Size
- Keep individual images under 500KB
- Optimize images before upload (use tools like TinyPNG.com)

## How to Add/Replace Images

### Method 1: Via Hosting Control Panel
1. Log into your hosting provider (e.g., cPanel, Plesk)
2. Navigate to File Manager
3. Go to: `public_html/assets/images/` (or similar path)
4. Upload your image or replace existing file with same name
5. Ensure proper permissions (644 for files)

### Method 2: Via FTP
1. Connect via FTP client (FileZilla, Cyberduck)
   - Host: Your server address
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (or 22 for SFTP)
2. Navigate to `/public/assets/images/`
3. Upload or replace files
4. Set file permissions to 644

### Method 3: Via Admin Panel (Recommended)
1. Log into your website admin panel
2. Go to Menu Manager
3. Use the Image Upload Preview feature:
   - Select your image file
   - Preview appears automatically
   - See normalized filename
   - Click "Upload to Public Assets"
4. Image is automatically placed in correct folder

## Database Image References

Images are referenced in the database using **root-relative URLs**:

### ✅ Correct Format
```
/assets/images/chicken_burger.jpg
```

### ❌ Incorrect Format
```
http://yourdomain.com/assets/images/chicken_burger.jpg
src/assets/food/chicken-burger.jpg
```

### Updating Database References
When you add a new image, update the menu item in the database:

```sql
UPDATE menu_items 
SET generated_image_url = '/assets/images/your_new_image.jpg'
WHERE name = 'Menu Item Name';
```

Or use the admin panel to manage menu items and images.

## Fallback/Placeholder Image

If an image fails to load (404 error), the system automatically shows:
```
/assets/images/placeholder.jpg
```

**To customize the placeholder:**
1. Create your placeholder image
2. Name it `placeholder.jpg`
3. Upload to `/public/assets/images/`
4. Replace the existing placeholder

## Troubleshooting

### Images Not Showing
1. **Check filename**: Ensure it matches database reference exactly
2. **Check path**: Verify image is in `/public/assets/images/`
3. **Check permissions**: Files should be 644, folders 755
4. **Clear cache**: Clear browser and server cache
5. **Check HTTPS**: Ensure not mixing HTTP/HTTPS

### Mixed Content Warnings
- Ensure all image URLs use HTTPS: `https://yourdomain.com/assets/images/image.jpg`
- Or use root-relative paths: `/assets/images/image.jpg` (recommended)

### Images Too Large
- Compress images before upload
- Recommended max: 500KB per image
- Use image optimization tools

### Wrong MIME Types
Ensure your server is configured to serve:
- `.jpg` → `image/jpeg`
- `.png` → `image/png`
- `.webp` → `image/webp`

Most hosting providers configure this automatically.

## Quick Reference Commands

### Check Image Exists (via SSH)
```bash
ls -la public/assets/images/chicken_burger.jpg
```

### Set Correct Permissions
```bash
chmod 644 public/assets/images/*.jpg
chmod 755 public/assets/images/
```

### Find All Images
```bash
find public/assets/images/ -type f -name "*.jpg"
```

## Best Practices

1. ✅ Always preview images before uploading to production
2. ✅ Keep original high-res backups elsewhere
3. ✅ Use consistent naming conventions
4. ✅ Optimize images for web before upload
5. ✅ Test images on mobile devices
6. ✅ Keep a spreadsheet mapping menu items to filenames
7. ✅ Back up your images folder regularly

## Support Checklist

When reporting image issues, provide:
- [ ] Image filename
- [ ] Database field value (generated_image_url)
- [ ] Browser console errors (F12 → Console)
- [ ] Network tab status code (F12 → Network)
- [ ] Screenshot of the issue

## Contact

For technical support with image management:
- Check browser console for errors (F12)
- Verify file paths and permissions
- Contact your hosting provider for server-side issues
