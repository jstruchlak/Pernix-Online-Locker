/////////////////////////////////////////////////////////////////
// Backend UNIT Tests Includes
/////////////////////////////////////////////////////////////////
# Database Connection:
Connection and disconnection from the database.

# CRUD Operations and API Endpoints :
POST /api/user/signup:
    Creates a new user with valid data.
    Returns 400 if required fields are missing.

GET /api/details/:
    Returns detail for a valid ID.
    Returns 404 for an invalid ID format.
    Returns 404 for a non-existent ID.

PUT /api/details/:
    Updates detail with valid data.
    Returns 400 for invalid ID format.
    Returns 404 if the detail does not exist.

DELETE /api/details/:
    Deletes detail with a valid ID.
    Returns 404 for invalid ID format.
    Returns 404 if the detail does not exist.