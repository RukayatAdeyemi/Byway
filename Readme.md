....
#Byway Backend Code Documentation

## API Testing Guide

This is the guide to test the endpoint

### Setup Requirements

Before starting, ensure you have:

1. Node JS and npm installed
2. MongoDB running both locally and globally
3. Postman installed
4. The API Server code

### Initial Setup

1. Clone the repository.
2. `bash npm install `
3. create a `.env` file with these variable:
   `.env MONGODB_URL = mongoDBlink JWT_SECRET= jwt_secret NODE_ENV=environment`
4. ```bash npm run dev```

### Authentication Testing
1. User Signup
- Create User Account

Request
-Method: `POST`
-URL: http://localhost:3004/api/auth/signup
-Headers: 
   -Content-Type: application/json
-Body:
```json
{
"firstname": "Rukayat",
"lastname": "Adeyemi",
"username": "Abeey1020",
"email": "rukayatadeyemi@gmail.com",
"password": "Temitope101",
"role": "instructor"
}```

- Expected Response
  - Status: `201 Created`
-Body: Contains user object with success message


2. User Signin

-Login to get an authentication token
Request:
-Method: `POST`
-URL: http://localhost:3004/api/auth/login

-Headers: 
   -Content-Type: application/json
-Body:

```json
{
"email": "rukayatadeyemi@gmail.com",
"password": "Temitope101"
}```

- Expected Response
  - Status: `201 Ok`
-Body: Contains token and user details

_!important_: copy the token from this response for use in subsequent request

3. Update User Profile
-Update current user profile details/ information

Request:
-Method: `PUT`
-URL: http://localhost:3004/api/auth/profile

-Headers: 
   -Content-Type: application/json
   -Authorization: Bearer `YOUR TOKEN`
-Body:

```json
{
//whatever value you want to change, example firstname, profileImage
}```

- Expected Response
  - Status: `201 Ok`
-Body: Contains updated user details/data


