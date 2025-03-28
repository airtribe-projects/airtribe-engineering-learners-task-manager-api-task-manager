# News Aggregator API

## Overview
The **News Aggregator API** is a RESTful API that allows users to register, log in, and manage their news preferences. The API fetches personalized news articles from an external news provider based on user preferences. It also supports features like caching, marking articles as read/favorites, and search functionality.

## Features
- User Authentication (Register/Login) with JWT
- Manage User Preferences (categories, languages, sources)
- Fetch Personalized News from an External API
- Caching to Reduce API Requests
- Mark Articles as Read/Favorite
- Search News by Keywords
- Input Validation & Error Handling

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT, bcrypt
- **External API**: NewsAPI (or any news provider)
- **Testing**: Jest, Supertest

## Installation & Setup
### Prerequisites
- Node.js installed on your system
- MongoDB running locally or a cloud database (e.g., MongoDB Atlas)
- API key for an external news provider (e.g., NewsAPI)

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd news-aggregator-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and configure environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/news-aggregator
   JWT_SECRET=your_jwt_secret
   NEWS_API_KEY=your_news_api_key
   ```
4. Start the server:
   ```sh
   npm start
   ```
5. Run tests:
   ```sh
   npm test
   ```

## API Endpoints
### Authentication
| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login and receive JWT |

### User Preferences
| Method | Endpoint            | Description                        |
|--------|--------------------|--------------------------------|
| GET    | /api/preferences    | Retrieve user news preferences |
| PUT    | /api/preferences    | Update user news preferences  |

### News
| Method | Endpoint                  | Description                                   |
|--------|--------------------------|-------------------------------------------|
| GET    | /api/news                 | Fetch personalized news                    |
| POST   | /api/news/:id/read        | Mark an article as read                    |
| POST   | /api/news/:id/favorite    | Mark an article as favorite                |
| GET    | /api/news/read            | Retrieve all read articles                 |
| GET    | /api/news/favorites       | Retrieve all favorite articles             |
| GET    | /api/news/search/:keyword | Search for news articles by keyword       |

## Error Handling
- 400: Bad Request (e.g., missing fields, validation errors)
- 401: Unauthorized (e.g., invalid token, authentication failure)
- 404: Not Found (e.g., invalid endpoints, no matching data)
- 500: Internal Server Error

## Future Improvements
- Implement user role-based access control (RBAC)
- Enhance search functionality with filters
- Add pagination for news results
- Improve caching with Redis

## License
This project is licensed under the MIT License.

---
Happy coding! 🚀

