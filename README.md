# chatApp
A real-time chat application built with Angular (frontend), NestJS (backend), WebSocket (real-time communication), and Passport.js (authentication), with data stored in MongoDB. It features instant messaging, secure login, and a responsive UI.
##backend conig[.env for backend]
# Database Configuration
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

# JWT Configuration
JWT_SECRET_KEY=<your_jwt_secret_key>

# Server Configuration
PORT=3000

# Token Expiration Times
ACCESS_TOKEN_EXPIRE_TIME=30m
REFRESH_TOKEN_EXPIRE_TIME=1h

# Cookie Expiration Time (in milliseconds)
COOKIE_EXPIRE_TIME=3600000
