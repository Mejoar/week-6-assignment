import React from 'react';
import PropTypes from 'prop-types';
import BugCard from './BugCard';

/**
 * List of Bug items
 * @param {Array} bugs - Array of bug objects
 * @param {Function} onEdit - Function to handle edit action
 * @param {Function} onDelete - Function to handle delete action
 * @returns BugList component
 */
const BugList = ({ bugs, onEdit, onDelete }) => {
  if (!bugs || bugs.length === 0) {
    return <div className="empty-list">No bugs reported</div>;
  }

  return (
    <div className="bug-list">
      {bugs.map((bug) => (
        <BugCard key={bug._id} bug={bug} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

BugList.propTypes = {
  bugs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      severity: PropTypes.string,
      status: PropTypes.string,
      priority: PropTypes.string,
      reporter: PropTypes.string,
      assignee: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      stepsToReproduce: PropTypes.arrayOf(PropTypes.string),
      environment: PropTypes.shape({
        browser: PropTypes.string,
        os: PropTypes.string,
        version: PropTypes.string,
      }),
      attachments: PropTypes.arrayOf(
        PropTypes.shape({
          filename: PropTypes.string,
          url: PropTypes.string,
          uploadDate: PropTypes.string,
        })
      ),
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          author: PropTypes.string,
          content: PropTypes.string,
          createdAt: PropTypes.string,
        })
      ),
      dueDate: PropTypes.string,
      resolvedAt: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BugList;
