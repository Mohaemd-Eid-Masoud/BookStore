# Bookstore

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.2.

## 🚀 Features

- **Modern Angular 20** with standalone components
- **Server-Side Rendering (SSR)** for better SEO
- **Comprehensive SEO Implementation** with dynamic meta tags
- **Custom Favicons** and PWA support
- **Responsive Design** with Angular Material
- **Advanced Search** and filtering capabilities
- **Shopping Cart** functionality
- **Real-time Notifications**

## 🔍 SEO Implementation

This project includes comprehensive SEO best practices:

### Meta Tags & Open Graph
- Dynamic meta tags for each page
- Open Graph tags for social media sharing
- Twitter Card support
- Structured data (JSON-LD) for search engines
- Canonical URLs and proper robots.txt

### SEO Service
Use the `SEOService` in your components to set page-specific meta data:

```typescript
import { SEOService } from './services/seo.service';

export class MyComponent implements OnInit {
  constructor(private seoService: SEOService) {}

  ngOnInit() {
    // Set page-specific SEO data
    this.seoService.setMetaData({
      title: 'Custom Page Title | Bookstore',
      description: 'Custom page description for SEO',
      keywords: 'custom, keywords, here',
      image: 'https://your-domain.com/path/to/image.jpg'
    });
  }
}
```

### Predefined SEO Methods
```typescript
// Home page SEO
this.seoService.setHomePageSEO();

// Book detail page SEO
this.seoService.setBookPageSEO({
  title: 'Book Title',
  author: 'Author Name',
  description: 'Book description...',
  image: 'book-cover.jpg',
  isbn: '978-1234567890'
});

// Category page SEO
this.seoService.setCategoryPageSEO('Fiction', 'Browse our fiction books collection');
```

## 🎨 Favicons & Icons

The project includes custom favicons and icons:

### Files in `public/` directory:
- `favicon.ico` - Traditional favicon (16x16, 32x32)
- `favicon.svg` - Scalable SVG favicon
- `apple-touch-icon.svg` - Apple touch icon (180x180)
- `site.webmanifest` - Web app manifest for PWA
- `robots.txt` - Search engine instructions
- `sitemap.xml` - Site structure for search engines

### Converting SVG to ICO
To convert the SVG favicon to ICO format for better browser compatibility:

1. Use an online converter like [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Or use ImageMagick command:
```bash
convert favicon.svg -resize 32x32 favicon.ico
```

### Favicon HTML Setup
The favicons are automatically included in `src/index.html`:
```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.svg">
<link rel="manifest" href="site.webmanifest">
```

## 🏗️ Development

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### SEO in Development
The SEO service works in both development and production modes. Meta tags will be visible in the browser's page source and in search engine crawlers.

## 🧪 Testing

### Unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### SEO Testing
- Use browser developer tools to inspect meta tags
- Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validate structured data with [Schema Markup Validator](https://validator.schema.org/)

## 🎯 Custom Alerts & Confirmations

This project includes a comprehensive custom notification and confirmation system that replaces native browser alerts and confirm dialogs.

### Features

#### **Custom Notifications**
- **4 Types:** Success, Error, Warning, Info
- **Auto-dismiss:** Configurable timeout (4s for success, 6s for others)
- **Rich Content:** Title and message support
- **Smooth Animations:** Slide-in/out effects
- **Responsive Design:** Works on all screen sizes

#### **Custom Confirmation Modals**
- **Beautiful UI:** Modern modal design with backdrop blur
- **3 Types:** Danger (delete), Warning (actions), Info (general)
- **Customizable:** Configurable button text and styling
- **Promise-based:** Async/await support
- **Keyboard Accessible:** ESC to cancel, Enter to confirm

### Usage Examples

#### **Notifications**
```typescript
// Success notification
this.notificationService.success('Order Complete', 'Your purchase was successful!');

// Error notification
this.notificationService.error('Error', 'Something went wrong. Please try again.');

// Warning notification
this.notificationService.warning('Warning', 'Please review your information.');

// Info notification
this.notificationService.info('Information', 'Here is some important information.');
```

#### **Confirmations**
```typescript
// Simple confirmation
const result = await this.confirmationService.confirm({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Yes',
  cancelText: 'No',
  type: 'warning'
});

if (result.confirmed) {
  // User confirmed
}

// Delete confirmation (pre-configured)
const deleteResult = await this.confirmationService.confirmDelete('My Document');
if (deleteResult.confirmed) {
  // Delete the item
}

// Custom action confirmation
const actionResult = await this.confirmationService.confirmCustomAction(
  'Custom Action',
  'This will perform a custom operation.',
  'Proceed'
);
```

### Implementation

#### **Services**
- **NotificationService:** Handles all notifications
- **ConfirmationService:** Manages confirmation modals
- **ConfirmationModalComponent:** Global modal component

#### **Global Components**
- **NotificationComponent:** Displays notifications globally
- **ConfirmationModalComponent:** Shows confirmation dialogs globally

### Styling

#### **Notification Styles**
- **Success:** Green gradient with checkmark icon
- **Error:** Red gradient with error icon
- **Warning:** Orange gradient with warning icon
- **Info:** Blue gradient with info icon

#### **Modal Styles**
- **Backdrop blur** for modern look
- **Smooth animations** for open/close
- **Responsive design** for mobile compatibility
- **Type-based theming** (danger/warning/info colors)

## 📱 Progressive Web App (PWA) Support

The application includes PWA (Progressive Web App) support:

- **Web App Manifest** - Defines app appearance and behavior
- **Service Worker** - For offline functionality (can be added)
- **Responsive Icons** - For different device types
- **Theme Colors** - Consistent branding

## 🔧 Configuration

### SEO Configuration
Update the following in `src/index.html`:
- Change `your-bookstore-domain.com` to your actual domain
- Update social media handles (@yourbookstore)
- Modify business information in structured data

### Favicon Customization
1. Replace `public/favicon.svg` with your custom design
2. Update colors in the SVG to match your brand
3. Regenerate different sizes if needed

## 📊 Performance

The SEO implementation includes:
- **Preconnect tags** for faster resource loading
- **Proper image optimization** with Open Graph images
- **Canonical URLs** to prevent duplicate content issues
- **Robots.txt** for search engine guidance

## 🌐 Deployment

When deploying to production:

1. **Update domain references** in all SEO meta tags
2. **Test with search engines** using fetch as Google
3. **Submit sitemap** to Google Search Console and Bing Webmaster Tools
4. **Verify social media cards** work correctly

## 📚 Additional Resources

- [Angular SEO Guide](https://angular.io/guide/seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
