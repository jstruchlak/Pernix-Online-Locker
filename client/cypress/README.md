/////////////////////////////////////////////////////////////////
// User Flow END 2 END Tests Includes
/////////////////////////////////////////////////////////////////

# Home Screen Navbar Test
Opens the home page:
    Checks for the title 
    Checks for the subtitle
    Looks for the "Login" link
    Looks for the "Signup" link

# Login Page Tests
Opens the login page.
Tests for incorrect username:
    Enters wrong username, correct email/password
    Checks for "Incorrect Username" message

Tests for incorrect email:
    Enters correct username, wrong email/password
    Checks for "Incorrect Email" message

Tests for incorrect password:
    Enters correct username/email, wrong password
    Checks for "Incorrect Password" message

Tests for empty form submission:
    Submits without filling anything
    Checks for "All fields are required" message

Tests successful login:
    Enters correct username/email/password
    Fills out profile details and uploads a photo
    Tests deleting the user
    Logs out and redirects back home 

# Forgot Password Page Test
Opens the login page:
    Clicks "Forgot Password?" link.
    Confirms it goes to the forgot password page
    Checks for the "Forgot Password" heading
Returns to the home page