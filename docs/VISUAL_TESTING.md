# Visual Testing Documentation

This document explains the visual testing setup for the Nebulous Nebula project, including how it integrates with the existing Claude code review workflow.

## Overview

The visual testing workflow provides comprehensive browser-based testing using Puppeteer and Lighthouse to ensure:
- Visual consistency across different browsers and viewports
- Performance optimization
- Accessibility compliance
- SEO best practices
- Layout stability and responsiveness

## Workflow Integration

### Current Workflow Chain
```
PR Created/Updated → Claude Code Review → Issue Creator → GitHub Issues
                  ↘ Visual Testing ↗
```

### Trigger Points
1. **Pull Request Events** - Runs parallel to Claude code review
2. **After Code Review** - Triggered when Claude review completes successfully
3. **Manual Dispatch** - For on-demand testing with custom parameters
4. **Scheduled** - Automated regression testing (weekdays at 2 AM UTC)

## Test Coverage

### Smart Page Detection
Visual testing automatically detects which pages to test based on **PR changes**:

**Changed Page Files:**
- Tests only pages that were modified in the PR
- Automatically discovers pages from `src/pages/*.astro`, `*.md`, `*.mdx`
- Converts file paths to URL paths (e.g., `src/pages/about.astro` → `/about`)

**Component Changes:**
- When components or layouts change, tests key pages that likely use them
- Always includes home page as it's most likely to be affected

**Fallback Testing:**
- If no relevant changes detected, tests common pages (Home, About, Gallery)
- Manual triggers and scheduled runs test all discovered pages

**Smart Skipping:**
- Automatically skips visual testing if no relevant files changed
- Posts PR comment explaining why testing was skipped
- Saves CI resources and reduces noise

### Browser Matrix
- **Chromium** - Primary testing browser
- **Firefox** - Cross-browser compatibility
- **WebKit** - Safari compatibility (optional)

### Viewport Testing
- **Mobile** - 375x667 (iPhone SE)
- **Tablet** - 768x1024 (iPad)
- **Desktop** - 1920x1080 (Full HD)

## Visual Checks Performed

### Core Checks
1. **Page Loading** - HTTP status and response validation
2. **Page Title** - Ensures proper SEO titles
3. **Viewport Meta Tag** - Responsive design compliance
4. **Navigation Elements** - Main navigation presence
5. **Image Alt Text** - Accessibility compliance
6. **Console Errors** - JavaScript error detection
7. **Layout Stability** - Cumulative Layout Shift (CLS) measurement

### Page-Specific Checks
- **Gallery Page** - Image loading and grid layout
- **Contact Page** - Form element validation
- **Performance Metrics** - JS heap usage, layout counts

### Performance Metrics
- **JavaScript Heap Usage** - Memory consumption tracking
- **Layout Count** - DOM layout recalculations
- **Style Recalculations** - CSS performance impact
- **Cumulative Layout Shift** - Visual stability score

## Lighthouse Integration

### Audit Categories
- **Performance** - Warning threshold: 80/100
- **Accessibility** - Error threshold: 90/100
- **Best Practices** - Warning threshold: 80/100
- **SEO** - Warning threshold: 80/100
- **PWA** - Disabled (not applicable)

### Configuration
The Lighthouse configuration is defined in [`.lighthouserc.json`](../.lighthouserc.json) and includes:
- Multiple URL testing
- Desktop preset configuration
- Chrome flags for CI environment
- Assertion thresholds for each category

## Test Results and Reporting

### Artifacts Generated
1. **Screenshots** - Full-page captures for each test
2. **JSON Reports** - Detailed test results and metrics
3. **HTML Reports** - Visual dashboard with test summaries
4. **Lighthouse Reports** - Performance and quality audits

### GitHub Integration
- **PR Comments** - Automated test result summaries
- **Issue Creation** - Critical failures generate tracking issues
- **Status Checks** - Pass/fail status for PR merging
- **Artifact Storage** - 30-day retention of test results

## Running Tests Locally

### Prerequisites
```bash
npm install
```

### Available Commands
```bash
# Run existing unit tests
npm test

# Build and preview (for manual testing)
npm run build
npm run preview
```

### Visual Testing
Visual testing is **workflow-only** and runs automatically in GitHub Actions. This approach ensures:
- **Universal Compatibility** - Works with any project structure (CommonJS, ES modules, etc.)
- **No Local Dependencies** - Doesn't pollute your project with testing packages
- **Consistent Environment** - Same testing environment across all projects
- **Zero Configuration** - No setup required in individual projects

The visual testing dependencies are installed globally in the GitHub Actions runner and use CommonJS syntax for maximum compatibility.

## Workflow Configuration

### Manual Trigger Options
When manually triggering the workflow, you can specify:
- **Test Environment** - preview, development, staging
- **Browser** - chromium, firefox, webkit
- **Viewport** - mobile, tablet, desktop, all

### Environment Variables
- `NODE_VERSION` - Node.js version (default: 18)
- `ASTRO_TELEMETRY_DISABLED` - Disables Astro telemetry
- `VIEWPORT_WIDTH/HEIGHT` - Custom viewport dimensions
- `BROWSER_TYPE` - Browser selection for tests

## Integration with Existing Workflows

### Claude Code Review Integration
The visual testing workflow is designed to complement the existing Claude code review:

1. **Parallel Execution** - Visual tests run alongside code review
2. **Shared Context** - Both workflows analyze the same PR changes
3. **Issue Correlation** - Visual failures can reference code review findings
4. **Combined Reporting** - Results are aggregated in PR comments

### Issue Creation Workflow
Visual test failures integrate with the existing issue creation system:
- Uses same labeling system (`automated-review`, `severity:high`)
- Links to source PR for traceability
- Follows same issue template structure
- Respects issue creation limits to avoid spam

## Troubleshooting

### Common Issues
1. **Server Startup Timeout** - Increase `startServerReadyTimeout` in Lighthouse config
2. **Browser Launch Failures** - Check Chrome flags in CI environment
3. **Screenshot Differences** - Font rendering variations between environments
4. **Memory Issues** - Adjust heap size limits for large pages

### Debug Mode
Enable debug output by setting environment variables:
```bash
DEBUG=puppeteer:* npm run test:visual
```

### CI/CD Considerations
- Tests run in headless mode with optimized flags
- Artifacts are automatically uploaded and retained
- Failed tests don't block PR merging but create tracking issues
- Scheduled tests provide regression detection

## Future Enhancements

### Planned Features
1. **Visual Regression Testing** - Screenshot comparison with baselines
2. **Cross-Device Testing** - Extended device matrix
3. **A11y Testing** - Enhanced accessibility validation
4. **Performance Budgets** - Stricter performance thresholds
5. **Custom Test Scenarios** - User journey testing

### Integration Opportunities
1. **Deployment Hooks** - Post-deployment validation
2. **Monitoring Integration** - Real-time performance tracking
3. **Analytics Correlation** - User experience metrics
4. **Security Scanning** - OWASP compliance checks

## Contributing

When adding new pages or features:
1. Update the `TEST_PAGES` array in the visual testing script
2. Add page-specific checks if needed
3. Update this documentation
4. Test locally before submitting PR

For workflow modifications:
1. Test changes in a fork first
2. Update environment variables documentation
3. Ensure backward compatibility
4. Update integration points with existing workflows