class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };
    
    this.logs.push(logEntry);

    this.persistLogs();
    
    return logEntry;
  }

  info(message, data = {}) {
    return this.log('INFO', message, data);
  }

  warn(message, data = {}) {
    return this.log('WARN', message, data);
  }

  error(message, data = {}) {
    return this.log('ERROR', message, data);
  }

  persistLogs() {
    try {
      localStorage.setItem('urlShortenerLogs', JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to persist logs:', e);
    }
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();
export default logger;