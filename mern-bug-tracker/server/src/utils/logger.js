/**
 * Logger utility for debugging and monitoring
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const formatTime = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, data = null) => {
  const timestamp = formatTime();
  const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
};

const logger = {
  info: (message, data = null) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(colors.green + formatMessage('info', message, data) + colors.reset);
    }
  },

  warn: (message, data = null) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(colors.yellow + formatMessage('warn', message, data) + colors.reset);
    }
  },

  error: (message, data = null) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(colors.red + formatMessage('error', message, data) + colors.reset);
    }
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(colors.blue + formatMessage('debug', message, data) + colors.reset);
    }
  },

  http: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusColor = res.statusCode >= 400 ? colors.red : colors.green;
      
      if (process.env.NODE_ENV !== 'test') {
        console.log(
          colors.cyan + 
          formatMessage('http', `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`) + 
          colors.reset
        );
      }
    });
    
    next();
  }
};

module.exports = logger;
