import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BugForm.css';

const BugForm = ({ bug, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    status: 'open',
    priority: 'medium',
    reporter: '',
    assignee: '',
    tags: '',
    stepsToReproduce: '',
    environment: {
      browser: '',
      os: '',
      version: ''
    },
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bug && isEdit) {
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        severity: bug.severity || 'medium',
        status: bug.status || 'open',
        priority: bug.priority || 'medium',
        reporter: bug.reporter || '',
        assignee: bug.assignee || '',
        tags: bug.tags ? bug.tags.join(', ') : '',
        stepsToReproduce: bug.stepsToReproduce ? bug.stepsToReproduce.join('\n') : '',
        environment: {
          browser: bug.environment?.browser || '',
          os: bug.environment?.os || '',
          version: bug.environment?.version || ''
        },
        dueDate: bug.dueDate ? new Date(bug.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [bug, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('environment.')) {
      const envField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        environment: {
          ...prev.environment,
          [envField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.reporter.trim()) {
      newErrors.reporter = 'Reporter is required';
    }

    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        stepsToReproduce: formData.stepsToReproduce.split('\n').map(step => step.trim()).filter(step => step),
        dueDate: formData.dueDate || null
      };

      // Remove empty environment fields
      if (!submitData.environment.browser && !submitData.environment.os && !submitData.environment.version) {
        delete submitData.environment;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      priority: 'medium',
      reporter: '',
      assignee: '',
      tags: '',
      stepsToReproduce: '',
      environment: {
        browser: '',
        os: '',
        version: ''
      },
      dueDate: ''
    });
    setErrors({});
  };

  return (
    <form className="bug-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Bug' : 'Report New Bug'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          maxLength={100}
          required
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          maxLength={1000}
          rows={4}
          required
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reporter">Reporter *</label>
          <input
            type="text"
            id="reporter"
            name="reporter"
            value={formData.reporter}
            onChange={handleChange}
            className={errors.reporter ? 'error' : ''}
            maxLength={50}
            required
          />
          {errors.reporter && <span className="error-message">{errors.reporter}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            maxLength={50}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., frontend, login, mobile"
        />
      </div>

      <div className="form-group">
        <label htmlFor="stepsToReproduce">Steps to Reproduce</label>
        <textarea
          id="stepsToReproduce"
          name="stepsToReproduce"
          value={formData.stepsToReproduce}
          onChange={handleChange}
          placeholder="Enter each step on a new line"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Environment</label>
        <div className="form-row">
          <input
            type="text"
            name="environment.browser"
            placeholder="Browser"
            value={formData.environment.browser}
            onChange={handleChange}
          />
          <input
            type="text"
            name="environment.os"
            placeholder="OS"
            value={formData.environment.os}
            onChange={handleChange}
          />
          <input
            type="text"
            name="environment.version"
            placeholder="Version"
            value={formData.environment.version}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={errors.dueDate ? 'error' : ''}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (isEdit ? 'Update Bug' : 'Create Bug')}
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

BugForm.propTypes = {
  bug: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isEdit: PropTypes.bool
};

export default BugForm;
