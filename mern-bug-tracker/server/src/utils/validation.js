/**
 * Validation utility functions for the bug tracker application
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateBugTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required and must be a string' };
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters long' };
  }
  
  if (trimmedTitle.length > 100) {
    return { isValid: false, error: 'Title cannot exceed 100 characters' };
  }
  
  return { isValid: true, value: trimmedTitle };
};

const validateBugDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: false, error: 'Description is required and must be a string' };
  }
  
  const trimmedDescription = description.trim();
  if (trimmedDescription.length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters long' };
  }
  
  if (trimmedDescription.length > 1000) {
    return { isValid: false, error: 'Description cannot exceed 1000 characters' };
  }
  
  return { isValid: true, value: trimmedDescription };
};

const validateSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(severity)) {
    return { isValid: false, error: 'Severity must be one of: low, medium, high, critical' };
  }
  return { isValid: true, value: severity };
};

const validateStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return { isValid: false, error: 'Status must be one of: open, in-progress, resolved, closed' };
  }
  return { isValid: true, value: status };
};

const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return { isValid: false, error: 'Priority must be one of: low, medium, high, urgent' };
  }
  return { isValid: true, value: priority };
};

const validateReporter = (reporter) => {
  if (!reporter || typeof reporter !== 'string') {
    return { isValid: false, error: 'Reporter is required and must be a string' };
  }
  
  const trimmedReporter = reporter.trim();
  if (trimmedReporter.length < 2) {
    return { isValid: false, error: 'Reporter name must be at least 2 characters long' };
  }
  
  if (trimmedReporter.length > 50) {
    return { isValid: false, error: 'Reporter name cannot exceed 50 characters' };
  }
  
  return { isValid: true, value: trimmedReporter };
};

const validateBugData = (bugData) => {
  const errors = [];
  
  // Validate required fields
  const titleValidation = validateBugTitle(bugData.title);
  if (!titleValidation.isValid) {
    errors.push(titleValidation.error);
  }
  
  const descriptionValidation = validateBugDescription(bugData.description);
  if (!descriptionValidation.isValid) {
    errors.push(descriptionValidation.error);
  }
  
  const reporterValidation = validateReporter(bugData.reporter);
  if (!reporterValidation.isValid) {
    errors.push(reporterValidation.error);
  }
  
  // Validate optional fields if provided
  if (bugData.severity) {
    const severityValidation = validateSeverity(bugData.severity);
    if (!severityValidation.isValid) {
      errors.push(severityValidation.error);
    }
  }
  
  if (bugData.status) {
    const statusValidation = validateStatus(bugData.status);
    if (!statusValidation.isValid) {
      errors.push(statusValidation.error);
    }
  }
  
  if (bugData.priority) {
    const priorityValidation = validatePriority(bugData.priority);
    if (!priorityValidation.isValid) {
      errors.push(priorityValidation.error);
    }
  }
  
  // Validate due date
  if (bugData.dueDate) {
    const dueDate = new Date(bugData.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push('Due date must be a valid date');
    } else if (dueDate <= new Date()) {
      errors.push('Due date must be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially harmful characters
  return input
    .replace(/<script[^>]*>/gis, '') // Remove opening script tags
    .replace(/<\/script>/gis, '') // Remove closing script tags
    .replace(/<[^>]*>/g, '') // Remove all other HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

module.exports = {
  validateEmail,
  validateBugTitle,
  validateBugDescription,
  validateSeverity,
  validateStatus,
  validatePriority,
  validateReporter,
  validateBugData,
  sanitizeInput
};
