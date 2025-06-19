# Gallery Tests

This directory contains tests for the gallery page functionality.

## Running Tests

To run the gallery tests:

```bash
node tests/gallery.test.js
```

## Test Coverage

The tests verify:

1. **Random photo ID generation** - Ensures IDs are generated within the expected range (1-1000)
2. **Featured photo ID generation** - Validates featured photo ID logic
3. **Photo URL generation** - Checks correct Lorem Picsum URL formatting
4. **Randomization uniqueness** - Verifies that different batches of photos are sufficiently unique
5. **Gallery layout structure** - Validates the overall gallery structure
6. **Different photo dimensions** - Tests various image sizes work correctly

## Requirements Tested

- ✅ Photos displayed are different on each reload (randomization logic)
- ✅ Featured photo logic works correctly
- ✅ Layout structure is valid for responsive design

## Note

These tests focus on the core logic functions. For full end-to-end testing including visual layout and responsiveness, consider using tools like Playwright or Cypress for browser-based testing.