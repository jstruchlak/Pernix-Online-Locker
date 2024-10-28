import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Signup from '../pages/Signup';
import { AuthContextProvider } from '../context/AuthContext';

// Mock fetch
global.fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

test('renders signup form and submits data correctly', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    user: {
      email: 'test@example.com',
      username: 'testuser',
      token: 'fake-token'
    }
  }));

  const { getByLabelText, getByText } = render(
    <AuthContextProvider>
      <Signup />
    </AuthContextProvider>
  );

  const usernameInput = getByLabelText('Username');
  const emailInput = getByLabelText('Email');
  const passwordInput = getByLabelText('Password');
  const submitButton = getByText('Sign up');

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'bl@ckb1rdJPs29$101' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'bl@ckb1rdJPs29$101',
      }),
    });
  });
});
