import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from './BugForm';

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    test('renders create form correctly', () => {
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText('Report New Bug')).toBeInTheDocument();
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description *')).toBeInTheDocument();
      expect(screen.getByLabelText('Reporter *')).toBeInTheDocument();
      expect(screen.getByText('Create Bug')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    test('renders edit form correctly', () => {
      const bug = {
        _id: '1',
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe',
        severity: 'high',
        status: 'open',
        priority: 'high',
        assignee: 'Jane Smith',
        tags: ['frontend', 'urgent'],
        stepsToReproduce: ['Step 1', 'Step 2'],
        environment: {
          browser: 'Chrome',
          os: 'Windows',
          version: '10'
        },
        dueDate: '2023-12-31'
      };

      render(<BugForm bug={bug} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEdit={true} />);
      
      expect(screen.getByText('Edit Bug')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Bug')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('frontend, urgent')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Step 1\nStep 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Chrome')).toBeInTheDocument();
      expect(screen.getByText('Update Bug')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('renders all form fields', () => {
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description *')).toBeInTheDocument();
      expect(screen.getByLabelText('Severity')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.getByLabelText('Reporter *')).toBeInTheDocument();
      expect(screen.getByLabelText('Assignee')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags (comma-separated)')).toBeInTheDocument();
      expect(screen.getByLabelText('Steps to Reproduce')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getByText('Environment')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('validates required fields', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByText('Create Bug');
      await user.click(submitButton);
      
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Reporter is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('validates title length', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const titleInput = screen.getByLabelText('Title *');
      await user.type(titleInput, 'ab');
      
      const submitButton = screen.getByText('Create Bug');
      await user.click(submitButton);
      
      expect(screen.getByText('Title must be at least 3 characters long')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('validates description length', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const descriptionInput = screen.getByLabelText('Description *');
      await user.type(descriptionInput, 'too short');
      
      const submitButton = screen.getByText('Create Bug');
      await user.click(submitButton);
      
      expect(screen.getByText('Description must be at least 10 characters long')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('validates due date is in future', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const dueDateInput = screen.getByLabelText('Due Date');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      await user.type(dueDateInput, yesterdayString);
      
      const submitButton = screen.getByText('Create Bug');
      await user.click(submitButton);
      
      expect(screen.getByText('Due date must be in the future')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('clears error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const titleInput = screen.getByLabelText('Title *');
      const submitButton = screen.getByText('Create Bug');
      
      // Submit to trigger validation error
      await user.click(submitButton);
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      
      // Start typing to clear error
      await user.type(titleInput, 'New title');
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug Title');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      await user.selectOptions(screen.getByLabelText('Severity'), 'high');
      await user.selectOptions(screen.getByLabelText('Priority'), 'urgent');
      await user.selectOptions(screen.getByLabelText('Status'), 'in-progress');
      await user.type(screen.getByLabelText('Assignee'), 'Jane Smith');
      await user.type(screen.getByLabelText('Tags (comma-separated)'), 'frontend, urgent');
      await user.type(screen.getByLabelText('Steps to Reproduce'), 'Step 1\nStep 2');
      
      // Environment fields
      await user.type(screen.getByPlaceholderText('Browser'), 'Chrome');
      await user.type(screen.getByPlaceholderText('OS'), 'Windows');
      await user.type(screen.getByPlaceholderText('Version'), '10');
      
      // Due date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      await user.type(screen.getByLabelText('Due Date'), tomorrowString);
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Bug Title',
          description: 'This is a test bug description',
          reporter: 'John Doe',
          severity: 'high',
          priority: 'urgent',
          status: 'in-progress',
          assignee: 'Jane Smith',
          tags: ['frontend', 'urgent'],
          stepsToReproduce: ['Step 1', 'Step 2'],
          environment: {
            browser: 'Chrome',
            os: 'Windows',
            version: '10'
          },
          dueDate: tomorrowString
        });
      });
    });

    test('submits form with minimum required data', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Bug',
          description: 'This is a test bug description',
          reporter: 'John Doe',
          severity: 'medium',
          priority: 'medium',
          status: 'open',
          assignee: '',
          tags: [],
          stepsToReproduce: [],
          dueDate: null
        });
      });
    });

    test('handles form submission errors', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
      
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    test('disables submit button during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit;
      const mockSubmitPromise = new Promise((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(mockSubmitPromise);
      
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      
      const submitButton = screen.getByText('Create Bug');
      await user.click(submitButton);
      
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Resolve the promise
      resolveSubmit();
      
      await waitFor(() => {
        expect(screen.getByText('Create Bug')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Form Actions', () => {
    test('resets form when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const titleInput = screen.getByLabelText('Title *');
      const descriptionInput = screen.getByLabelText('Description *');
      const reporterInput = screen.getByLabelText('Reporter *');
      
      await user.type(titleInput, 'Test Bug');
      await user.type(descriptionInput, 'Test description');
      await user.type(reporterInput, 'John Doe');
      
      expect(titleInput).toHaveValue('Test Bug');
      expect(descriptionInput).toHaveValue('Test description');
      expect(reporterInput).toHaveValue('John Doe');
      
      await user.click(screen.getByText('Reset'));
      
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(reporterInput).toHaveValue('');
    });

    test('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      await user.click(screen.getByText('Cancel'));
      
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('does not render cancel button when onCancel is not provided', () => {
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  describe('Form Field Interactions', () => {
    test('handles environment field changes', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const browserInput = screen.getByPlaceholderText('Browser');
      const osInput = screen.getByPlaceholderText('OS');
      const versionInput = screen.getByPlaceholderText('Version');
      
      await user.type(browserInput, 'Firefox');
      await user.type(osInput, 'Linux');
      await user.type(versionInput, '11');
      
      expect(browserInput).toHaveValue('Firefox');
      expect(osInput).toHaveValue('Linux');
      expect(versionInput).toHaveValue('11');
    });

    test('handles tags input correctly', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const tagsInput = screen.getByLabelText('Tags (comma-separated)');
      await user.type(tagsInput, 'frontend, backend, urgent');
      
      expect(tagsInput).toHaveValue('frontend, backend, urgent');
    });

    test('handles steps to reproduce input correctly', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const stepsInput = screen.getByLabelText('Steps to Reproduce');
      await user.type(stepsInput, 'Step 1\nStep 2\nStep 3');
      
      expect(stepsInput).toHaveValue('Step 1\nStep 2\nStep 3');
    });

    test('handles select field changes', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      const severitySelect = screen.getByLabelText('Severity');
      const prioritySelect = screen.getByLabelText('Priority');
      const statusSelect = screen.getByLabelText('Status');
      
      await user.selectOptions(severitySelect, 'critical');
      await user.selectOptions(prioritySelect, 'urgent');
      await user.selectOptions(statusSelect, 'resolved');
      
      expect(severitySelect).toHaveValue('critical');
      expect(prioritySelect).toHaveValue('urgent');
      expect(statusSelect).toHaveValue('resolved');
    });
  });

  describe('Data Processing', () => {
    test('processes tags correctly', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      await user.type(screen.getByLabelText('Tags (comma-separated)'), 'frontend, backend, urgent, ');
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['frontend', 'backend', 'urgent']
          })
        );
      });
    });

    test('processes steps to reproduce correctly', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      await user.type(screen.getByLabelText('Steps to Reproduce'), 'Step 1\nStep 2\n\nStep 3\n');
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            stepsToReproduce: ['Step 1', 'Step 2', 'Step 3']
          })
        );
      });
    });

    test('removes empty environment object', async () => {
      const user = userEvent.setup();
      render(<BugForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Title *'), 'Test Bug');
      await user.type(screen.getByLabelText('Description *'), 'This is a test bug description');
      await user.type(screen.getByLabelText('Reporter *'), 'John Doe');
      
      await user.click(screen.getByText('Create Bug'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.not.objectContaining({
            environment: expect.anything()
          })
        );
      });
    });
  });
});
