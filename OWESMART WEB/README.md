# OweSmart Website - Marketing & Landing Pages

The official marketing website for OweSmart - Smart Debt Coaching & Financial Wellness App.

## 🌐 Overview

This is the **public-facing marketing website** for OweSmart, designed to educate visitors about the debt management platform, showcase features, and drive app registrations.

## 📄 Pages

### 1. **index.html** - Homepage
The main landing page introducing OweSmart
- Hero section with compelling headline
- Feature highlights
- Call-to-action buttons
- Value proposition
- Social proof / testimonials

### 2. **about.html** - About Us
Company story and mission
- Our mission and vision
- Why we built OweSmart
- Team information
- Company values

### 3. **whyus.html** - Why Choose OweSmart
Competitive advantages and unique selling points
- What makes OweSmart different
- Comparison with traditional debt management
- Key benefits and advantages
- Success stories

### 4. **principles.html** - Our Principles
Core principles and methodology
- Debt management philosophy
- Financial wellness approach
- Gamification strategy
- Educational content

### 5. **contact.html** - Contact Us
Contact information and inquiry form
- Contact form
- Email and phone
- Business address
- Social media links
- Support hours

### 6. **download.html** - Get the App
App download and registration
- Direct link to app (http://localhost:3000)
- QR codes (if mobile apps available)
- System requirements
- Registration process
- Quick start guide

### 7. **login.html** - Login Portal
User login redirect
- Redirects to app login page
- "Sign in to your account" messaging
- Link to main app
- Forgot password link

### 8. **signup.html** - Sign Up Portal
User registration redirect
- Redirects to app registration page
- "Create your account" messaging
- Link to main app
- Benefits reminder

## 🎨 Design & Styling

### Technologies
- **HTML5** - Semantic markup
- **CSS3** - Custom styling (`style.css`)
- **JavaScript** - Interactive features (`script.js`)
- **Responsive Design** - Mobile-first approach

### Theme
- **Primary Color**: Blue (#0066CC or similar)
- **Secondary Color**: Teal/Cyan
- **Background**: White/Light Gray
- **Text**: Dark Gray/Black
- **Accent**: Success Green, Warning Yellow

### Features
- Clean, modern design
- Mobile responsive layout
- Smooth scrolling
- Navigation menu
- Call-to-action buttons
- Contact forms
- Image galleries

## 📂 File Structure

```
OWESMART WEB/
├── index.html           # Homepage
├── about.html           # About us
├── whyus.html          # Why choose us
├── principles.html     # Our principles
├── contact.html        # Contact page
├── download.html       # App download
├── login.html          # Login redirect
├── signup.html         # Signup redirect
├── style.css           # Main stylesheet
├── script.js           # JavaScript functionality
├── built.txt           # Build notes
├── plan.txt            # Planning document
└── IMAGES/             # Image assets
    ├── logo.png
    ├── hero-image.jpg
    ├── feature-*.png
    └── ...
```

## 🚀 Getting Started

### Viewing Locally

1. **Open in Browser**
   Simply double-click any HTML file to open in your default browser

2. **Using a Local Server** (Recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   ```
   Then visit: http://localhost:8000

3. **Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

### Navigation Structure

```
Homepage (index.html)
  ├── About Us (about.html)
  ├── Why Us (whyus.html)
  ├── Principles (principles.html)
  ├── Contact (contact.html)
  ├── Download (download.html)
  ├── Login → App Login (login.html → http://localhost:3000/login)
  └── Sign Up → App Register (signup.html → http://localhost:3000/register)
```

## 🔗 Integration with Main App

### App Links
The website includes links to the main OweSmart application:

- **App URL**: `http://localhost:3000` (Development)
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`
- **Dashboard**: `http://localhost:3000/dashboard`

### Update for Production
When deploying to production, update all app URLs in:
- `download.html`
- `login.html`
- `signup.html`
- Navigation menu links
- Call-to-action buttons

Replace `http://localhost:3000` with your production URL (e.g., `https://app.owesmart.com`)

## 📋 Content Sections

### Homepage Features Section
Highlight key features:
- 📊 Unified Debt Dashboard
- 💳 FPX Payment Gateway
- 🎮 Gamification & Rewards
- 🤖 AI Financial Coach
- 📈 Credit Score Monitoring
- 🔔 Smart Reminders

### Pricing/Plans Section
Show subscription tiers:
- **OweSmart** - RM 19.90/month
- **OweSmarter** - RM 99/month
- **OweBigSmarts** - RM 299/month

### Call-to-Action (CTA)
Primary CTAs throughout the site:
- "Get Started Free"
- "Try OweSmart Now"
- "Download the App"
- "Start Your Journey"

## 🎯 Marketing Goals

### Primary Objectives
1. **Educate** visitors about debt management
2. **Convert** visitors to registered users
3. **Showcase** features and benefits
4. **Build trust** with testimonials and social proof
5. **Drive downloads** and registrations

### Key Metrics to Track
- Page views
- Time on site
- Bounce rate
- Registration conversions
- Download clicks
- Contact form submissions

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: 320px - 767px (Mobile)
Medium: 768px - 1023px (Tablet)
Large: 1024px+ (Desktop)
```

Ensure all pages are mobile-friendly with:
- Responsive navigation
- Touch-friendly buttons
- Readable text sizes
- Optimized images
- Fast loading times

## 🖼️ Image Guidelines

### Image Assets
Store in `/IMAGES/` folder:
- **Logo**: Transparent PNG, multiple sizes
- **Hero Images**: 1920x1080px, optimized
- **Feature Icons**: SVG or PNG, 256x256px
- **Screenshots**: Desktop and mobile views
- **Team Photos**: Square format, 400x400px

### Optimization
- Compress images for web
- Use appropriate formats (PNG, JPEG, SVG)
- Implement lazy loading
- Provide alt text for accessibility

## 🔧 Customization

### Update Branding
1. Replace logo in `/IMAGES/logo.png`
2. Update colors in `style.css`
3. Modify navigation menu items
4. Customize footer content

### Update Content
1. Edit HTML files directly
2. Update feature descriptions
3. Add/remove sections as needed
4. Modify pricing information

### Update Links
When moving to production:
```javascript
// In script.js or inline
const APP_URL = 'https://your-production-domain.com';
// Replace all localhost:3000 references
```

## 📊 SEO Optimization

### Meta Tags
Each page should include:
```html
<meta name="description" content="...">
<meta name="keywords" content="debt management, financial wellness, Malaysia">
<meta property="og:title" content="OweSmart - Smart Debt Coaching">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

### Best Practices
- Unique title tags for each page
- Descriptive meta descriptions
- Header tag hierarchy (H1, H2, H3)
- Internal linking
- Fast page load speed
- Mobile-friendly design
- SSL certificate (HTTPS)

## 🚀 Deployment

### Static Hosting Options
1. **Netlify** - Drag & drop deployment
2. **Vercel** - GitHub integration
3. **GitHub Pages** - Free hosting
4. **AWS S3** - Scalable storage
5. **Firebase Hosting** - Google integration

### Deployment Steps
1. Build/compile assets if needed
2. Upload files to hosting service
3. Configure custom domain
4. Set up SSL certificate
5. Update app URLs to production
6. Test all links and forms
7. Submit to search engines

## 📝 Forms & Interaction

### Contact Form
The `contact.html` page includes a contact form that should:
- Validate user input
- Send emails to support team
- Show success/error messages
- Implement CAPTCHA (optional)

**Backend Integration Needed:**
- Set up form submission handler
- Configure email service
- Add spam protection
- Store inquiries in database

### Newsletter Signup
Consider adding email capture:
- Footer newsletter form
- Popup/modal subscription
- Integration with email service (Mailchimp, SendGrid)

## 🔒 Security

### Best Practices
- Use HTTPS only
- Sanitize form inputs
- Implement CAPTCHA on forms
- Regular security updates
- Content Security Policy headers
- CORS configuration

## 📞 Support & Contact

### Website Support
For website-related issues:
- Email: web@owesmart.com
- Technical issues: support@owesmart.com

### App Support
For app-related issues:
- See main app README
- In-app support chat
- Email: help@owesmart.com

## 🎨 Future Enhancements

### Planned Features
- [ ] Blog/Article section
- [ ] Video tutorials
- [ ] Customer testimonials slider
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] FAQ section
- [ ] Success stories
- [ ] Debt calculator tool
- [ ] Financial literacy resources

## 📖 Additional Resources

- Main App README: `../OWESMART-ENT-1/README.md`
- FPX Integration Guide: `../OWESMART-ENT-1/DEBT_PAYMENT_GATEWAY_GUIDE.md`
- Project Summary: `../OWESMART-ENT-1/POC_COMPLETE_SUMMARY.md`

## 🤝 Contributing

This is part of the OweSmart ecosystem. For changes:
1. Update HTML/CSS/JS files
2. Test across browsers
3. Verify mobile responsiveness
4. Check all links work
5. Commit with clear messages

## 📄 License

MIT License - Same as main OweSmart application

## 👨‍💻 Team

**BFM3130 - IT Project Team**
- Marketing Website Component
- Year: 2025

---

**Visit the live website**: [http://localhost:8000](http://localhost:8000) (local)

**Try the app**: [http://localhost:3000](http://localhost:3000) (local)

---

*Part of the OweSmart ecosystem - Making debt management smarter* 💙
