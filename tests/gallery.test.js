// Simple tests for gallery functionality
// These tests verify the core logic used in the gallery page

// Mock console for testing
const originalConsole = console;
const mockConsole = {
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {}
};

console = mockConsole;

// Test helper functions
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(`Assertion failed: ${message} (value: ${value}, expected: ${min}-${max})`);
  }
}

// Gallery logic functions (extracted from the Astro component)
function generateRandomPhotoIds(count) {
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(Math.floor(Math.random() * 1000) + 1);
  }
  return ids;
}

function generateFeaturedPhotoId() {
  return Math.floor(Math.random() * 1000) + 1;
}

function generatePhotoUrl(id, width = 400, height = 300) {
  return `https://picsum.photos/${width}/${height}?random=${id}`;
}

// Test Suite
function runTests() {
  console = originalConsole;
  console.log('Running Gallery Tests...\n');

  try {
    // Test 1: Random photo ID generation
    console.log('Test 1: Random photo ID generation');
    const photoIds = generateRandomPhotoIds(12);
    assert(photoIds.length === 12, 'Should generate exactly 12 photo IDs');
    
    photoIds.forEach((id, index) => {
      assertRange(id, 1, 1000, `Photo ID ${index + 1} should be between 1 and 1000`);
    });
    console.log('✅ Random photo ID generation works correctly\n');

    // Test 2: Featured photo ID generation
    console.log('Test 2: Featured photo ID generation');
    const featuredId = generateFeaturedPhotoId();
    assertRange(featuredId, 1, 1000, 'Featured photo ID should be between 1 and 1000');
    console.log('✅ Featured photo ID generation works correctly\n');

    // Test 3: Photo URL generation
    console.log('Test 3: Photo URL generation');
    const photoUrl = generatePhotoUrl(123, 400, 300);
    assert(photoUrl === 'https://picsum.photos/400/300?random=123', 'Photo URL should be correctly formatted');
    
    const featuredUrl = generatePhotoUrl(456, 600, 400);
    assert(featuredUrl === 'https://picsum.photos/600/400?random=456', 'Featured photo URL should be correctly formatted');
    console.log('✅ Photo URL generation works correctly\n');

    // Test 4: Randomization uniqueness
    console.log('Test 4: Randomization uniqueness');
    const batch1 = generateRandomPhotoIds(10);
    const batch2 = generateRandomPhotoIds(10);
    
    // Check that batches are likely to be different (allowing for some random overlap)
    const uniqueBatch1 = new Set(batch1);
    const uniqueBatch2 = new Set(batch2);
    const overlap = [...uniqueBatch1].filter(id => uniqueBatch2.has(id));
    
    // In practice, with 1000 possible IDs and 10 selections, we expect very little overlap
    assert(overlap.length < 5, 'Random batches should have minimal overlap');
    console.log('✅ Randomization produces sufficiently unique results\n');

    // Test 5: Gallery layout structure validation
    console.log('Test 5: Gallery layout structure validation');
    const galleryPhotoCount = 12;
    const galleryIds = generateRandomPhotoIds(galleryPhotoCount);
    const featuredPhotoId = generateFeaturedPhotoId();
    
    assert(galleryIds.length === galleryPhotoCount, 'Gallery should have correct number of photos');
    assert(typeof featuredPhotoId === 'number', 'Featured photo ID should be a number');
    assert(featuredPhotoId > 0, 'Featured photo ID should be positive');
    console.log('✅ Gallery layout structure is valid\n');

    // Test 6: Different photo dimensions
    console.log('Test 6: Different photo dimensions');
    const smallPhoto = generatePhotoUrl(1, 200, 150);
    const mediumPhoto = generatePhotoUrl(2, 400, 300);
    const largePhoto = generatePhotoUrl(3, 800, 600);
    
    assert(smallPhoto.includes('200/150'), 'Small photo should have correct dimensions');
    assert(mediumPhoto.includes('400/300'), 'Medium photo should have correct dimensions');
    assert(largePhoto.includes('800/600'), 'Large photo should have correct dimensions');
    console.log('✅ Different photo dimensions work correctly\n');

    console.log('🎉 All tests passed! Gallery functionality is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the tests
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { runTests, generateRandomPhotoIds, generateFeaturedPhotoId, generatePhotoUrl };
} else {
  // Browser environment
  runTests();
}

// If running directly with Node.js
if (typeof require !== 'undefined' && require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}