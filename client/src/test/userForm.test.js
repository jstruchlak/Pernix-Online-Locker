import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserForm from '../components/UserForm';
import { useDetailsContext } from '../hooks/useDetailsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock hooks
jest.mock('../hooks/useDetailsContext');
jest.mock('../hooks/useAuthContext');

// Mock fetch
global.fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

test('renders UserForm with required fields', () => {
  useDetailsContext.mockReturnValue({ dispatch: jest.fn() });
  useAuthContext.mockReturnValue({ user: { token: 'fake-token' } });

  render(
    <MemoryRouter>
      <UserForm />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/Full Name:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Date of Birth:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Role:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Profile Picture:/i)).toBeInTheDocument();
});

test('submits form data and shows success message in the modal', async () => {
  useDetailsContext.mockReturnValue({ dispatch: jest.fn() });
  useAuthContext.mockReturnValue({ user: { token: 'fake-token' } });

  fetch.mockResponseOnce(JSON.stringify({ message: 'Profile created successfully.' }));

  render(
    <MemoryRouter>
      <UserForm />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Date of Birth:/i), { target: { value: '2000-01-01' } });
  fireEvent.change(screen.getByLabelText(/Role:/i), { target: { value: 'Developer' } });
  fireEvent.change(screen.getByLabelText(/Profile Picture:/i), { 
    target: { files: [new File(['dummy content'], 'profile.png', { type: 'image/png' })] } 
  });

  fireEvent.click(screen.getByRole('button', { name: /Create Profile/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/details', {
      method: 'POST',
      body: expect.any(FormData),
      headers: {
        'Authorization': `Bearer fake-token`,
      },
    });
  });

  // Check for the modal to be opened and display the success message
  await waitFor(() => {
    expect(screen.getByText(/Profile created successfully./i)).toBeInTheDocument();
  });

});
