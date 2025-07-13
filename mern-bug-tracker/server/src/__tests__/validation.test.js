const { 
  validateEmail, 
  validateBugTitle, 
  validateBugDescription, 
  validateSeverity, 
  validateStatus, 
  validatePriority, 
  validateReporter, 
  validateBugData, 
  sanitizeInput 
} = require('../utils/validation');

// Sample invalid inputs for testing
const invalidEmails = ['', 'invalidemail', 'user@com', 'user@.com', 'user@site.'];
const validEmails = ['user@example.com', 'contact@sub.domain.com', 'person123@site.co.uk'];

// Helper to mock console for silent testing
const silentConsole = () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
});

// Test suite for validation logic
console.silent = silentConsole(); // Silence actual console output during tests

// Email validation tests
describe('Email Validation', () => {
  test('validates correct email formats', () => {
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  test('invalidates incorrect email formats', () => {
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});

// Title validation tests
describe('Bug Title Validation', () => {
  test('validates a proper title', () => {
    expect(validateBugTitle('Valid Bug Title')).toEqual({ isValid: true, value: 'Valid Bug Title' });
  });

  test('invalidates an empty title', () => {
    expect(validateBugTitle('')).toEqual({ isValid: false, error: 'Title is required and must be a string' });
  });

  test('invalidates a short title', () => {
    expect(validateBugTitle('ab')).toEqual({ isValid: false, error: 'Title must be at least 3 characters long' });
  });

  test('invalidates a long title', () => {
    const longTitle = 'a'.repeat(101);
    expect(validateBugTitle(longTitle)).toEqual({ isValid: false, error: 'Title cannot exceed 100 characters' });
  });
});

// Description validation tests
describe('Bug Description Validation', () => {
  test('validates a proper description', () => {
    expect(validateBugDescription('This is a valid description with sufficient length.')).toEqual({ isValid: true, value: 'This is a valid description with sufficient length.' });
  });

  test('invalidates an empty description', () => {
    expect(validateBugDescription('')).toEqual({ isValid: false, error: 'Description is required and must be a string' });
  });

  test('invalidates a short description', () => {
    expect(validateBugDescription('Too short')).toEqual({ isValid: false, error: 'Description must be at least 10 characters long' });
  });

  test('invalidates a long description', () => {
    const longDescription = 'a'.repeat(1001);
    expect(validateBugDescription(longDescription)).toEqual({ isValid: false, error: 'Description cannot exceed 1000 characters' });
  });
});

// Severity validation tests
describe('Severity Validation', () => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  const invalidSeverities = ['', 'urgent', 'extreme', 123];

  test('validates correct severities', () => {
    validSeverities.forEach(severity => {
      expect(validateSeverity(severity)).toEqual({ isValid: true, value: severity });
    });
  });

  test('invalidates incorrect severities', () => {
    invalidSeverities.forEach(severity => {
      expect(validateSeverity(severity)).toEqual({ isValid: false, error: 'Severity must be one of: low, medium, high, critical' });
    });
  });
});

// Status validation tests
describe('Status Validation', () => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  const invalidStatuses = ['', 'completed', 'done', 'starting'];

  test('validates correct statuses', () => {
    validStatuses.forEach(status => {
      expect(validateStatus(status)).toEqual({ isValid: true, value: status });
    });
  });

  test('invalidates incorrect statuses', () => {
    invalidStatuses.forEach(status => {
      expect(validateStatus(status)).toEqual({ isValid: false, error: 'Status must be one of: open, in-progress, resolved, closed' });
    });
  });
});

// Priority validation tests
describe('Priority Validation', () => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const invalidPriorities = ['', 'critical', 5, null];

  test('validates correct priorities', () => {
    validPriorities.forEach(priority => {
      expect(validatePriority(priority)).toEqual({ isValid: true, value: priority });
    });
  });

  test('invalidates incorrect priorities', () => {
    invalidPriorities.forEach(priority => {
      expect(validatePriority(priority)).toEqual({ isValid: false, error: 'Priority must be one of: low, medium, high, urgent' });
    });
  });
});

// Reporter validation tests
describe('Reporter Validation', () => {
  test('validates correct reporter names', () => {
    expect(validateReporter('John Doe')).toEqual({ isValid: true, value: 'John Doe' });
  });

  test('invalidates incorrect reporter names', () => {
    expect(validateReporter('')).toEqual({ isValid: false, error: 'Reporter is required and must be a string' });
    expect(validateReporter('A')).toEqual({ isValid: false, error: 'Reporter name must be at least 2 characters long' });
    expect(validateReporter('A'.repeat(51))).toEqual({ isValid: false, error: 'Reporter name cannot exceed 50 characters' });
  });
});

// Bug data validation tests
describe('Bug Data Validation', () => {
  const validBugData = {
    title: 'Valid Title',
    description: 'This is a valid description.',
    reporter: 'Valid Reporter',
    severity: 'medium',
    status: 'open',
    priority: 'medium'
  };

  const invalidBugData = {
    title: '',
    description: 'short',
    reporter: '',
    severity: 'extreme',
    status: 'done'
  };

  test('validates correct bug data', () => {
    expect(validateBugData(validBugData)).toEqual({ isValid: true, errors: [] });
  });

  test('invalidates incorrect bug data', () => {
    const validation = validateBugData(invalidBugData);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

// Sanitize input tests
describe('Sanitize Input', () => {
  test('removes dangerous characters and scripts', () => {
    const dangerousInput = '<script>alert("Hack!")</script>Click here!';
    const sanitizedOutput = 'alert("Hack!")Click here!';
    expect(sanitizeInput(dangerousInput)).toBe(sanitizedOutput);
  });

  test('trims whitespace', () => {
    const input = '  Hello World  ';
    const output = 'Hello World';
    expect(sanitizeInput(input)).toBe(output);
  });
});
