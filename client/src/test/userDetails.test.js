import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DetailsContext, DetailsContextProvider } from '../context/DetailsContext';

// Sample mock data
const mockDetails = [
  { _id: '1', fullName: 'John Doe', dob: '2000-01-01', aboutMe: 'Developer', profilePic: '' },
  { _id: '2', fullName: 'Jane Smith', dob: '1995-05-15', aboutMe: 'Designer', profilePic: '' }
];

describe('DetailsContext Tests', () => {
  test('should render, update, and delete details in context', () => {
    const TestComponent = () => {
      const { details, dispatch } = React.useContext(DetailsContext);

      React.useEffect(() => {
        dispatch({ type: 'SET_DETAILS', payload: mockDetails });
      }, [dispatch]);

      const handleUpdate = () => {
        dispatch({
          type: 'UPDATE_DETAILS',
          payload: { _id: '1', fullName: 'John Doe', dob: '2000-01-01', aboutMe: 'Updated Role', profilePic: '' }
        });
      };

      const handleDelete = (id) => {
        console.log('Dispatching delete for id:', id);
        dispatch({ type: 'DELETE_DETAILS', payload: { _id: id } });
      };

      console.log('Current details:', details); // Debugging

      return (
        <div>
          <button onClick={handleUpdate}>Update</button>
          {details && details.map(detail => (
            <div key={detail._id}>
              <p>{detail.fullName}</p>
              <p>{detail.aboutMe}</p>
              <button onClick={() => handleDelete(detail._id)}>Delete</button>
            </div>
          ))}
        </div>
      );
    };

    render(
      <DetailsContextProvider>
        <TestComponent />
      </DetailsContextProvider>
    );

    // Initially, check the details are rendered correctly
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();

    // Update details
    act(() => {
      fireEvent.click(screen.getByText('Update'));
    });

    // Verify that updated details are rendered
    expect(screen.getByText('Updated Role')).toBeInTheDocument();

    // Delete details
    const deleteButtons = screen.getAllByText('Delete');
    act(() => {
      fireEvent.click(deleteButtons[0]);
    });

    // Verify that deleted details are removed
    console.log('Verifying John Doe is removed');
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
