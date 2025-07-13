import React from 'react';
import PropTypes from 'prop-types';
import './BugCard.css';

/**
 * BugCard component to display individual bug details
 * @param {Object} bug - Bug object
 * @param {Function} onEdit - Function to handle edit action
 * @param {Function} onDelete - Function to handle delete action
 * @returns BugCard component
 */
const BugCard = ({ bug, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      onDelete(bug._id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#dc3545';
      case 'in-progress': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="bug-card">
      <div className="bug-header">
        <h3>{bug.title}</h3>
        <div className="bug-actions">
          <button onClick={() => onEdit(bug)} className="edit-btn">Edit</button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>
      
      <p className="bug-description">{bug.description}</p>
      
      <div className="bug-meta">
        <span className="bug-status" style={{ backgroundColor: getStatusColor(bug.status) }}>
          {bug.status}
        </span>
        <span className="bug-severity" style={{ backgroundColor: getSeverityColor(bug.severity) }}>
          {bug.severity}
        </span>
        <span className="bug-priority">
          Priority: {bug.priority}
        </span>
      </div>
      
      <div className="bug-details">
        <p><strong>Reporter:</strong> {bug.reporter}</p>
        {bug.assignee && <p><strong>Assignee:</strong> {bug.assignee}</p>}
        {bug.tags && bug.tags.length > 0 && (
          <div className="bug-tags">
            <strong>Tags:</strong>
            {bug.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        <p><strong>Created:</strong> {new Date(bug.createdAt).toLocaleDateString()}</p>
        {bug.dueDate && (
          <p><strong>Due Date:</strong> {new Date(bug.dueDate).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

BugCard.propTypes = {
  bug: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string,
    reporter: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BugCard;

