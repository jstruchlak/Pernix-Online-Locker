/////////////////////////////////////////////////////////////////
// Frontend UNIT Tests Includes
/////////////////////////////////////////////////////////////////
# Signup Component Test (signup.test.js)
Render Check: 
    Ensures signup form shows up.
Input Simulation: 
    Fills in username, email, and password.
Button Click: 
    Simulates clicking "Sign up."
API Verification: 
    Confirms a POST request is sent to /api/user/signup with correct data.

# UserDetails Component Test (userDetails.test.js)
Render Check: 
    Confirms details (e.g., "John Doe") are displayed.
Update Action: 
    Checks if clicking "Update" changes the role to "Updated Role."
Delete Action: 
    Tests that clicking "Delete" removes "John Doe" from display.

# UserForm Component Test (userForm.test.js)
Render Check:
    Ensures all form fields are visible
Input Simulation: 
    Fills in fields for name, date of birth, role, and profile picture
Button Click:
    Simulates clicking "Create Profile."
API Verification:
    Confirms a POST request is sent to /api/details
Success Message Check: 
    Verifies the success message appears after submission
