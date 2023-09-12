# TripTrek Blog API

## Link to the Client
[Blog Api Client](https://github.com/xeniakadar/blog-api-client)

## Short Description

This project showcases my skills in full-stack web development, including user authentication, database integration and RESTful API design. Below, you'll find information about the project's architecture, dependencies, and how to run the application. To learn more about the front-end, check out the [Blog Api Client](https://github.com/xeniakadar/blog-api-client).

### Technologies Used
- **Back-End**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Railway (for hosting)

### Project Structure
- `/models`: Defines Mongoose schemas for MongoDB.
- `/controllers`: Contains route controllers for user, blog post, topic, and comment functionalities.
- `/routes`: Defines API routes and their corresponding controllers.
- `/config`: Contains configuration files, including environment variables.

### Dependencies
- `express`: Web application framework for routing and middleware.
- `mongoose`: MongoDB object modeling for data management.
- `bcryptjs`: For securely hashing and comparing passwords.
- `express-session`, `connect-mongo`: For session management and storing sessions in MongoDB.
- `helmet`, `compression`: Enhance security and optimize server responses.
- `express-rate-limit`: For rate-limiting requests to prevent abuse.
- `jsonwebtoken`: For creating and verifying JWT tokens.
- `passport`, `passport-local`: For user authentication strategies.
- `dotenv`: For handling environment variables.

## How to Run the Application

1. **Clone the Repository**:
```git clone https://github.com/xeniakadar/blog-api.git```
2. **Install Dependencies**:
- Navigate to the project's root directory:
  ```cd blogpost-app```
  ```npm install```

3. **Configure Environment Variables**:
- Create a `.env` file in the `/server` directory with the following variables:
  ```MONGODB_URI=<your_mongodb_uri>SECRET=<your_secret_key> ```

4. **Run the Application**:
- Start the server (from the `/server` directory):
  ```npm start```


5. **Access the Application**:
- The application will be accessible at `http://localhost:3000`.

6. **Sign Up and Log In**:
- Create a new user account or use the provided credentials for testing.
- Enjoy exploring and interacting with the BlogPost web application!

## Project Features

- User registration and authentication.
- Creating, updating, and deleting blog posts.
- Adding and deleting comments on blog posts.
- Managing topics for blog posts.
- Rate limiting and security enhancements.
- Integration with MongoDB for data storage.
- Deployed on Railway for hosting.


## What I've learned
- Successfully developed a full-stack web application from scratch, showcasing expertise in both front-end and back-end technologies.
- Designed and implemented a RESTful API to handle various functionalities, including user registration, authentication, blog post creation, and more.
- Integrated MongoDB, a NoSQL database, into the project, illustrating the ability to work with databases, define schemas, and manage data effectively.
- Implemented secure user authentication using JWT (JSON Web Tokens) and bcrypt for password hashing, ensuring user data is protected and following best practices for security.
- Implemented robust error handling and input validation throughout the application, enhancing user experience and safeguarding against potential vulnerabilities.
- Demonstrated the ability to integrate third-party APIs and services for enhanced functionality, such as connecting with Railway for deployment and MongoDB for data storage.
- Implemented rate limiting to protect against abusive requests, and addressed security concerns such as the Express 'trust proxy' setting to maintain the integrity of the application.
