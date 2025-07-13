/**
 * Server-side debugging utilities
 */

const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Enhanced server-side logger
 */
class ServerDebugLogger {
  constructor() {
    this.prefix = '[DEBUG]';
  }

  log(level, message, data = null) {
    if (!DEBUG_ENABLED) return;

    const timestamp = new Date().toISOString();
    const color = this.getColor(level);
    
    console.log(`${color}[${timestamp}] [${level.toUpperCase()}] ${message}${colors.reset}`);
    
    if (data) {
      console.log(`${color}Data:${colors.reset}`, data);
    }
  }

  getColor(level) {
    switch (level) {
      case 'error': return colors.red;
      case 'warn': return colors.yellow;
      case 'info': return colors.blue;
      case 'debug': return colors.green;
      case 'api': return colors.cyan;
      case 'db': return colors.magenta;
      default: return colors.white;
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

  db(message, data) {
    this.log('db', message, data);
  }

  // Request logging
  request(req, res, next) {
    if (!DEBUG_ENABLED) return next();

    const start = Date.now();
    
    console.log(`${colors.cyan}=== Incoming Request ===${colors.reset}`);
    console.log(`${colors.cyan}Method:${colors.reset} ${req.method}`);
    console.log(`${colors.cyan}URL:${colors.reset} ${req.originalUrl}`);
    console.log(`${colors.cyan}Headers:${colors.reset}`, req.headers);
    console.log(`${colors.cyan}Body:${colors.reset}`, req.body);
    console.log(`${colors.cyan}Query:${colors.reset}`, req.query);
    console.log(`${colors.cyan}Params:${colors.reset}`, req.params);
    
    // Log response
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - start;
      
      console.log(`${colors.green}=== Response ===${colors.reset}`);
      console.log(`${colors.green}Status:${colors.reset} ${res.statusCode}`);
      console.log(`${colors.green}Duration:${colors.reset} ${duration}ms`);
      console.log(`${colors.green}Body:${colors.reset}`, body);
      console.log(`${colors.cyan}=========================${colors.reset}`);
      
      return originalSend.call(this, body);
    };
    
    next();
  }

  // Database operation logging
  dbOperation(operation, collection, query, result) {
    if (!DEBUG_ENABLED) return;
    
    console.log(`${colors.magenta}=== Database Operation ===${colors.reset}`);
    console.log(`${colors.magenta}Operation:${colors.reset} ${operation}`);
    console.log(`${colors.magenta}Collection:${colors.reset} ${collection}`);
    console.log(`${colors.magenta}Query:${colors.reset}`, query);
    console.log(`${colors.magenta}Result:${colors.reset}`, result);
    console.log(`${colors.magenta}=========================${colors.reset}`);
  }

  // Performance timing
  time(label) {
    if (!DEBUG_ENABLED) return;
    console.time(`${colors.yellow}⏱️  ${label}${colors.reset}`);
  }

  timeEnd(label) {
    if (!DEBUG_ENABLED) return;
    console.timeEnd(`${colors.yellow}⏱️  ${label}${colors.reset}`);
  }
}

/**
 * Middleware for debugging HTTP requests
 */
const debugMiddleware = (req, res, next) => {
  if (!DEBUG_ENABLED) return next();

  const start = Date.now();
  const originalSend = res.send;

  console.log(`\n${colors.cyan}🔍 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}${colors.reset}`);
  console.log(`${colors.dim}Headers:${colors.reset}`, req.headers);
  console.log(`${colors.dim}Body:${colors.reset}`, req.body);
  console.log(`${colors.dim}Query:${colors.reset}`, req.query);

  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`${colors.green}✅ Response: ${res.statusCode} (${duration}ms)${colors.reset}`);
    console.log(`${colors.dim}Response Body:${colors.reset}`, body);
    return originalSend.call(this, body);
  };

  next();
};

/**
 * Error debugging
 */
const debugError = (error, context = {}) => {
  if (!DEBUG_ENABLED) return;

  console.log(`\n${colors.red}🚨 ERROR DEBUG ${colors.reset}`);
  console.log(`${colors.red}Message:${colors.reset}`, error.message);
  console.log(`${colors.red}Stack:${colors.reset}`, error.stack);
  console.log(`${colors.red}Context:${colors.reset}`, context);
  console.log(`${colors.red}Time:${colors.reset}`, new Date().toISOString());
  console.log(`${colors.red}${'='.repeat(50)}${colors.reset}\n`);
};

/**
 * Validation debugging
 */
const debugValidation = (data, errors) => {
  if (!DEBUG_ENABLED) return;

  console.log(`\n${colors.yellow}📝 VALIDATION DEBUG${colors.reset}`);
  console.log(`${colors.yellow}Data:${colors.reset}`, data);
  console.log(`${colors.yellow}Errors:${colors.reset}`, errors);
  console.log(`${colors.yellow}Is Valid:${colors.reset}`, !errors || errors.length === 0);
  console.log(`${colors.yellow}${'='.repeat(50)}${colors.reset}\n`);
};

/**
 * Database debugging
 */
const debugDatabase = (operation, query, result) => {
  if (!DEBUG_ENABLED) return;

  console.log(`\n${colors.magenta}💾 DATABASE DEBUG${colors.reset}`);
  console.log(`${colors.magenta}Operation:${colors.reset}`, operation);
  console.log(`${colors.magenta}Query:${colors.reset}`, query);
  console.log(`${colors.magenta}Result:${colors.reset}`, result);
  console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}\n`);
};

/**
 * Performance debugging
 */
const debugPerformance = (operation, startTime, endTime, details = {}) => {
  if (!DEBUG_ENABLED) return;

  const duration = endTime - startTime;
  console.log(`\n${colors.blue}⚡ PERFORMANCE DEBUG${colors.reset}`);
  console.log(`${colors.blue}Operation:${colors.reset}`, operation);
  console.log(`${colors.blue}Duration:${colors.reset}`, `${duration}ms`);
  console.log(`${colors.blue}Details:${colors.reset}`, details);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
};

// Create logger instance
const serverDebugLogger = new ServerDebugLogger();

// Export utilities
module.exports = {
  serverDebugLogger,
  debugMiddleware,
  debugError,
  debugValidation,
  debugDatabase,
  debugPerformance,
  DEBUG_ENABLED,
  colors
};
