import React, { useState, useEffect } from 'react';
import BugList from './BugList';
import BugForm from './BugForm';
import bugService from '../services/bugService';
import './BugTracker.css';

const BugTracker = () => {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const result = await bugService.getAllBugs();
        setBugs(result.data || []);
      } catch (err) {
        setError('Failed to load bugs.');
        console.error('Load bugs error:', err);
      }
    };
    fetchBugs();
  }, []);

  const handleFormSubmit = async (bugData) => {
    try {
      if (selectedBug) {
        await bugService.updateBug(selectedBug._id, bugData);
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug._id === selectedBug._id ? { ...bug, ...bugData } : bug))
        );
      } else {
        const newBug = await bugService.createBug(bugData);
        setBugs((prevBugs) => [...prevBugs, newBug.data]);
      }
      closeForm();
    } catch (err) {
      setError('Failed to submit form.');
      console.error('Form submit error:', err);
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      await bugService.deleteBug(id);
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== id));
    } catch (err) {
      setError('Failed to delete bug.');
      console.error('Delete error:', err);
    }
  };

  const openForm = (bug = null) => {
    setSelectedBug(bug);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedBug(null);
    setIsFormOpen(false);
    setError(null);
  };

  return (
    <div className='bug-tracker'>
      <h1>MERN Bug Tracker</h1>
      <button onClick={() => openForm()} className='add-bug-button'>Report New Bug</button>
      {error && <div className='error-message'>{error}</div>}
      {isFormOpen ? (
        <BugForm
          bug={selectedBug}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isEdit={!!selectedBug}
        />
      ) : (
        <BugList bugs={bugs} onEdit={openForm} onDelete={handleDeleteBug} />
      )}
    </div>
  );
};

export default BugTracker;

