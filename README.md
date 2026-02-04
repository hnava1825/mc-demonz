# M.C. Demonz Futbol Club Website

## Updates Made

### 1. **Team Photo Added**
- Large team photo (Fall 2025) now displays prominently on the home page
- Photo positioned between header and navigation tabs
- Styled with red border matching club colors
- Caption "FALL 2025" included below photo

### 2. **Improved About Section**
- Cleaner, more professional description
- Better flow and readability
- Bilingual content (English/Spanish)
- Highlights:
  - Club history since 2007
  - Head Coach Pepe Avalos
  - Age groups 7-14
  - Tournament participation (Independent Club Cup, Copa Peñasco)
  - Focus on technical skills, discipline, and sportsmanship

### 3. **Enhanced Contact Section**
- Added phone number: (928) 502-9934
- Added email: jptalent07@gmail.com
- Social media links with icons:
  - Facebook: https://www.facebook.com/MCDemonz/
  - Instagram: https://www.instagram.com/m.c.demonz
- Location information

## Files Included

1. **index.html** - Main website structure
2. **styles.css** - All styling including team photo section
3. **app.js** - JavaScript functionality (tabs, language switching)
4. **data.js** - Easy-to-update schedule data
5. **team-photo-fall2025.jpg** - Team photo image

## How to Update Weekly (Easy!)

### Update Game & Practice Schedule:
1. Open `data.js`
2. Edit the information in plain text:
   - Change dates, times, opponents
   - Add/remove games as needed
3. Save the file
4. Upload to your website

### Example - Adding a New Game:
```javascript
{
    team: "10U",
    opponent: "New Team Name",
    date: "Saturday, Feb 15",
    time: "9:00 AM",
    location: "Kennedy Park"
}
```

## Deployment Options

### Option 1: GitHub Pages (Recommended)
1. Create GitHub account
2. Create new repository
3. Upload all files
4. Enable GitHub Pages in settings
5. Edit `data.js` directly on GitHub for weekly updates

### Option 2: Traditional Web Hosting
1. Upload all files to your hosting service
2. Use FTP client or hosting panel
3. Update `data.js` weekly through hosting file manager

### Option 3: Netlify (Free & Easy)
1. Sign up at netlify.com
2. Drag & drop your folder
3. Automatic deployment
4. Update files through Netlify dashboard

## File Structure
```
website/
├── index.html              (Main page)
├── styles.css              (Styling)
├── app.js                  (Functionality)
├── data.js                 (⭐ Edit this weekly!)
└── team-photo-fall2025.jpg (Team photo)
```

## Contact Info Included
- **Phone**: (928) 502-9934
- **Email**: jptalent07@gmail.com
- **Facebook**: MCDemonz
- **Instagram**: @m.c.demonz

## Features
✅ Bilingual (English/Spanish)
✅ Team photo on home page
✅ Mobile responsive
✅ Easy weekly updates
✅ Social media integration
✅ Contact information
✅ Schedule management
✅ Team age groups
✅ Red & black color scheme

## Need Help?
The website is ready to deploy! All files work together and the team photo is properly integrated.
