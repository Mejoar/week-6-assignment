// Debug utilities for the Bug Tracker application

// Debug levels
const DEBUG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Enable/disable debugging based on environment
const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

/**
 * Enhanced console logging with styling and grouping
 */
class DebugLogger {
  constructor() {
    this.styles = {
      error: 'color: #dc3545; font-weight: bold;',
      warn: 'color: #ffc107; font-weight: bold;',
      info: 'color: #007bff; font-weight: bold;',
      debug: 'color: #28a745; font-weight: bold;',
      api: 'color: #17a2b8; font-weight: bold;',
      component: 'color: #6610f2; font-weight: bold;',
      state: 'color: #fd7e14; font-weight: bold;'
    };
  }

  log(level, message, data = null) {
    if (!DEBUG_ENABLED) return;

    const timestamp = new Date().toISOString();
    const style = this.styles[level] || this.styles.debug;
    
    console.log(`%c[${timestamp}] [${level.toUpperCase()}] ${message}`, style);
    
    if (data) {
      console.log('Data:', data);
    }
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  api(message, data) {
    this.log('api', message, data);
  }

  component(message, data) {
    this.log('component', message, data);
  }

  state(message, data) {
    this.log('state', message, data);
  }

  // Group logging for related operations
  group(label, callback) {
    if (!DEBUG_ENABLED) return;
    
    console.group(`🔍 ${label}`);
    callback();
    console.groupEnd();
  }

  // Table logging for arrays and objects
  table(label, data) {
    if (!DEBUG_ENABLED) return;
    
    console.log(`📊 ${label}`);
    console.table(data);
  }

  // Performance timing
  time(label) {
    if (!DEBUG_ENABLED) return;
    console.time(`⏱️ ${label}`);
  }

  timeEnd(label) {
    if (!DEBUG_ENABLED) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  // Stack trace
  trace(message) {
    if (!DEBUG_ENABLED) return;
    console.trace(`🔍 ${message}`);
  }
}

/**
 * Network request debugging
 */
export const debugNetworkRequest = (config) => {
  if (!DEBUG_ENABLED) return;
  
  console.group('🌐 Network Request');
  console.log('Method:', config.method?.toUpperCase());
  console.log('URL:', config.url);
  console.log('Headers:', config.headers);
  console.log('Data:', config.data);
  console.groupEnd();
};

export const debugNetworkResponse = (response) => {
  if (!DEBUG_ENABLED) return;
  
  console.group('✅ Network Response');
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  console.log('Data:', response.data);
  console.groupEnd();
};

export const debugNetworkError = (error) => {
  if (!DEBUG_ENABLED) return;
  
  console.group('❌ Network Error');
  console.error('Error:', error.message);
  console.error('Config:', error.config);
  console.error('Response:', error.response);
  console.groupEnd();
};

/**
 * Component lifecycle debugging
 */
export const debugComponentLifecycle = (componentName, lifecycle, props, state) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`⚛️ ${componentName} - ${lifecycle}`);
  console.log('Props:', props);
  console.log('State:', state);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

/**
 * State change debugging
 */
export const debugStateChange = (componentName, previousState, newState) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`🔄 ${componentName} - State Change`);
  console.log('Previous:', previousState);
  console.log('New:', newState);
  console.log('Diff:', findObjectDifferences(previousState, newState));
  console.groupEnd();
};

/**
 * Form validation debugging
 */
export const debugFormValidation = (formName, formData, errors) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`📝 ${formName} - Validation`);
  console.log('Form Data:', formData);
  console.log('Errors:', errors);
  console.log('Is Valid:', Object.keys(errors).length === 0);
  console.groupEnd();
};

/**
 * API call debugging
 */
export const debugApiCall = (operation, data, result) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`🔧 API Call - ${operation}`);
  console.log('Input:', data);
  console.log('Result:', result);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Error debugging
 */
export const debugError = (error, context = {}) => {
  if (!DEBUG_ENABLED) return;
  
  console.group('🚨 Error Details');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('Context:', context);
  console.error('Time:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Performance debugging
 */
export const debugPerformance = (operation, duration, details = {}) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`⚡ Performance - ${operation}`);
  console.log('Duration:', `${duration}ms`);
  console.log('Details:', details);
  console.groupEnd();
};

/**
 * Utility function to find differences between objects
 */
const findObjectDifferences = (obj1, obj2) => {
  const differences = {};
  
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      differences[key] = {
        old: obj1[key],
        new: obj2[key]
      };
    }
  }
  
  for (const key in obj2) {
    if (!(key in obj1)) {
      differences[key] = {
        old: undefined,
        new: obj2[key]
      };
    }
  }
  
  return differences;
};

// Create and export default logger instance
export const debugLogger = new DebugLogger();

// Export debug levels for external use
export { DEBUG_LEVELS, DEBUG_ENABLED };

// Utility to safely stringify objects for debugging
export const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '[Circular Reference or Non-serializable Object]';
  }
};

// Browser debugging helpers
export const debugBrowser = {
  // Add custom styles to elements for debugging
  highlightElement: (selector, color = 'red') => {
    if (!DEBUG_ENABLED) return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.outline = `2px solid ${color}`;
      el.style.outlineOffset = '2px';
    });
  },
  
  // Log element properties
  inspectElement: (selector) => {
    if (!DEBUG_ENABLED) return;
    
    const element = document.querySelector(selector);
    if (element) {
      console.log('Element:', element);
      console.log('Styles:', window.getComputedStyle(element));
      console.log('Attributes:', element.attributes);
      console.log('Properties:', element);
    }
  },
  
  // Log viewport information
  logViewport: () => {
    if (!DEBUG_ENABLED) return;
    
    console.log('Viewport:', {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent
    });
  }
};
