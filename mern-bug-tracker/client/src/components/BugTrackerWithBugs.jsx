import React, { useState, useEffect, useCallback } from 'react';
import BugList from './BugList';
import BugForm from './BugForm';
import bugService from '../services/bugService';
import { 
  debugLogger, 
  debugComponentLifecycle, 
  debugStateChange, 
  debugApiCall, 
  debugError,
  debugPerformance 
} from '../utils/debugUtils';
import './BugTracker.css';

const BugTrackerWithBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🐛 BUG 1: Intentional infinite loop in useEffect
  // This will cause the component to make infinite API calls
  useEffect(() => {
    debugLogger.component('BugTrackerWithBugs', 'useEffect called');
    
    const fetchBugs = async () => {
      try {
        setLoading(true);
        debugLogger.time('fetchBugs');
        
        const result = await bugService.getAllBugs();
        debugApiCall('getAllBugs', null, result);
        
        setBugs(result.data || []);
        debugLogger.timeEnd('fetchBugs');
      } catch (err) {
        debugError(err, { component: 'BugTrackerWithBugs', operation: 'fetchBugs' });
        setError('Failed to load bugs.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
    
    // ✅ FIXED: Added dependency array to prevent infinite loop
  }, []);

  // 🐛 BUG 2: Incorrect state update that causes issues
  const handleFormSubmit = useCallback(async (bugData) => {
    debugLogger.component('BugTrackerWithBugs', 'handleFormSubmit called');
    debugLogger.info('Form data received:', bugData);
    
    const startTime = performance.now();
    
    try {
      setLoading(true);
      
      if (selectedBug) {
        // ✅ FIXED: Access correct property
        debugLogger.debug('Updating bug with ID:', selectedBug._id);
        
        await bugService.updateBug(selectedBug._id, bugData);
        
        // ✅ FIXED: Correct state update without wrong id
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug._id === selectedBug._id ? { ...bug, ...bugData } : bug))
        );
        
        debugLogger.info('Bug updated successfully');
      } else {
        const newBug = await bugService.createBug(bugData);
        debugApiCall('createBug', bugData, newBug);
        
        // 🐛 BUG: Adding bug without proper ID structure
        setBugs((prevBugs) => [...prevBugs, newBug.data]);
        
        debugLogger.info('Bug created successfully');
      }
      
      closeForm();
      
    } catch (err) {
      debugError(err, { 
        component: 'BugTrackerWithBugs', 
        operation: 'handleFormSubmit',
        bugData: bugData,
        selectedBug: selectedBug 
      });
      setError('Failed to submit form.');
    } finally {
      setLoading(false);
      const endTime = performance.now();
      debugPerformance('handleFormSubmit', endTime - startTime, { bugData, selectedBug });
    }
  }, [selectedBug]);

  // 🐛 BUG 3: Missing error handling and incorrect state updates
  const handleDeleteBug = async (id) => {
    debugLogger.component('BugTrackerWithBugs', 'handleDeleteBug called');
    debugLogger.warn('Attempting to delete bug with ID:', id);
    
    try {
      setLoading(true);
      
      // 🐛 BUG: Not checking if ID exists
      await bugService.deleteBug(id);
      
      // ✅ FIXED: Use correct property in filter
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== id));
      
      debugLogger.info('Bug deleted successfully');
      
      // ✅ COMMENTED OUT: Intentional error for debugging (uncomment to test error boundary)
      // throw new Error('This is an intentional error for debugging');
      
    } catch (err) {
      debugError(err, { 
        component: 'BugTrackerWithBugs', 
        operation: 'handleDeleteBug',
        bugId: id 
      });
      // Don't set error if deletion was successful but we threw intentional error
      if (!err.message.includes('intentional error')) {
        setError('Failed to delete bug.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openForm = (bug = null) => {
    const previousState = { selectedBug, isFormOpen };
    
    setSelectedBug(bug);
    setIsFormOpen(true);
    setError(null);
    
    debugStateChange('BugTrackerWithBugs', previousState, { selectedBug: bug, isFormOpen: true });
    debugLogger.component('BugTrackerWithBugs', 'Form opened');
  };

  const closeForm = () => {
    const previousState = { selectedBug, isFormOpen };
    
    setSelectedBug(null);
    setIsFormOpen(false);
    setError(null);
    
    debugStateChange('BugTrackerWithBugs', previousState, { selectedBug: null, isFormOpen: false });
    debugLogger.component('BugTrackerWithBugs', 'Form closed');
  };

  // 🐛 BUG 4: Function that will cause runtime error
  const triggerError = () => {
    debugLogger.error('Triggering intentional error');
    
    // Confirm before triggering error
    const confirmed = window.confirm('This will trigger an intentional error to test the Error Boundary. Are you sure?');
    if (!confirmed) return;
    
    // This will cause an error that the Error Boundary should catch
    const undefinedObject = undefined;
    return undefinedObject.someProperty.anotherProperty;
  };

  // 🐛 BUG 5: Incorrect conditional rendering
  const renderContent = () => {
    debugLogger.component('BugTrackerWithBugs', 'renderContent called');
    
    if (loading) {
      return <div className="loading">Loading bugs...</div>;
    }
    
    // 🐛 BUG: Wrong condition - should check isFormOpen first
    if (bugs.length === 0) {
      return <div className="no-bugs">No bugs found</div>;
    }
    
    if (isFormOpen) {
      return (
        <BugForm
          bug={selectedBug}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isEdit={!!selectedBug}
        />
      );
    }
    
    return <BugList bugs={bugs} onEdit={openForm} onDelete={handleDeleteBug} />;
  };

  // Log component lifecycle
  useEffect(() => {
    debugComponentLifecycle('BugTrackerWithBugs', 'componentDidMount', null, { bugs, selectedBug, isFormOpen, error });
    
    return () => {
      debugComponentLifecycle('BugTrackerWithBugs', 'componentWillUnmount', null, { bugs, selectedBug, isFormOpen, error });
    };
  }, []);

  // Log state changes
  useEffect(() => {
    debugLogger.state('BugTrackerWithBugs state update', { 
      bugsCount: bugs.length, 
      selectedBug: selectedBug?._id, 
      isFormOpen, 
      error,
      loading 
    });
    
    // ✅ FIXED: Only log table if bugs exist and are valid
    if (bugs.length > 0) {
      debugLogger.table('Current bugs', bugs.map(bug => ({
        id: bug._id,
        title: bug.title,
        status: bug.status,
        reporter: bug.reporter,
        // Fixed: Use proper property access
        priority: bug.priority || 'unknown'
      })));
    }
  }, [bugs, selectedBug, isFormOpen, error, loading]);

  return (
    <div className='bug-tracker'>
      <h1>MERN Bug Tracker (Debug Version)</h1>
      
      {/* Debug controls */}
      <div className="debug-controls" style={{ 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        marginBottom: '20px',
        borderRadius: '4px' 
      }}>
        <h3>Debug Controls</h3>
        <button 
          onClick={() => debugLogger.info('Manual debug log', { bugs, selectedBug, isFormOpen })}
          style={{ marginRight: '10px' }}
        >
          Log Current State
        </button>
        <button 
          onClick={triggerError}
          style={{ marginRight: '10px', backgroundColor: '#dc3545', color: 'white' }}
        >
          Trigger Error
        </button>
        <button 
          onClick={() => debugLogger.table('Bugs Table', bugs)}
          style={{ marginRight: '10px' }}
        >
          Show Bugs Table
        </button>
        <button 
          onClick={() => {
            debugLogger.group('Performance Test', () => {
              debugLogger.time('test-operation');
              // Simulate heavy operation
              for (let i = 0; i < 1000000; i++) {
                Math.random();
              }
              debugLogger.timeEnd('test-operation');
            });
          }}
        >
          Performance Test
        </button>
      </div>

      <button onClick={() => openForm()} className='add-bug-button'>
        Report New Bug
      </button>
      
      {error && <div className='error-message'>{error}</div>}
      
      {/* 🐛 BUG 6: Conditional rendering issue */}
      {renderContent()}
      
      {/* Debug info panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          padding: '10px', 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '300px'
        }}>
          <div>Bugs: {bugs.length}</div>
          <div>Form Open: {isFormOpen ? 'Yes' : 'No'}</div>
          <div>Selected Bug: {selectedBug?._id || 'None'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
        </div>
      )}
    </div>
  );
};

export default BugTrackerWithBugs;
