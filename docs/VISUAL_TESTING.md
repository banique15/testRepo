# Visual Testing Documentation

This document explains the simplified visual testing setup for the Nebulous Nebula project.

## Overview

The visual testing workflow provides basic browser-based testing using Puppeteer to ensure:
- All pages load successfully
- Basic page functionality works
- No critical errors occur

## How It Works

### Trigger Points
- **Pull Request Events** - Runs when PR is created or updated
- **Manual Trigger** - Can be run manually from GitHub Actions tab

### What Gets Tested
The workflow tests these pages:
- Home (`/`)
- About (`/about`) 
- Gallery (`/gallery`)
- Contact (`/contact`)
- FAQ (`/faq`)

### Test Process
1. **Build** - Builds your Astro site
2. **Start Server** - Runs preview server
3. **Test Pages** - Loads each page with Puppeteer
4. **Check Results** - Verifies pages load without errors
5. **Report** - Posts results to PR comment

## Test Results

### What's Checked
- **Page Loading** - HTTP status codes
- **Page Titles** - Ensures pages have titles
- **Basic Functionality** - Pages render without crashes

### Results Display
Results are posted as PR comments:

```markdown
## 📸 Visual Test Results

**Summary:** 5/5 pages loaded successfully

- ✅ **Home** (/)
  - Title: "Nebulous Nebula"
- ✅ **About** (/about)
  - Title: "About - Nebulous Nebula"
- ✅ **Gallery** (/gallery)
  - Title: "Gallery - Nebulous Nebula"
- ✅ **Contact** (/contact)
  - Title: "Contact - Nebulous Nebula"
- ✅ **FAQ** (/faq)
  - Title: "FAQ - Nebulous Nebula"

---
*Visual testing completed*
```

## Benefits

### Simple & Reliable
- **Minimal dependencies** - Only Puppeteer
- **Fast execution** - Basic checks only
- **Clear results** - Easy to understand output
- **No file I/O** - Everything in memory

### Automatic Integration
- **PR Comments** - Results appear directly in PRs
- **Status Checks** - Pass/fail status for merging
- **Error Detection** - Catches broken pages early

## Workflow Configuration

### Manual Trigger
You can run visual tests manually:
1. Go to GitHub Actions tab
2. Select "Visual Web Testing"
3. Click "Run workflow"

### Customization
To modify which pages are tested, edit the `pages` array in the workflow:

```javascript
const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  // Add more pages here
];
```

## Troubleshooting

### Common Issues
- **Server not ready** - Increase sleep time in workflow
- **Page load timeout** - Check for slow-loading content
- **Missing pages** - Verify page paths exist

### Debug Information
Check workflow logs for detailed error messages and page load information.

## Future Enhancements

This simplified approach can be extended with:
- Screenshot comparison
- Performance metrics
- Accessibility checks
- Cross-browser testing
- Mobile viewport testing

The current implementation focuses on reliability and simplicity while providing essential visual testing capabilities.