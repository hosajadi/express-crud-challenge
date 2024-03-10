### Endpoints

```
POST /api/v1/auth/register - Signup
POST /api/v1/auth/login - Login
POST /api/v1/auth/refreshToken - RefreshToken
GET /api/v1/users/ - All Users
GET /api/v1/users/feed - Filter Users by location
GET /api/v1/users/profile - User Profile
POST /api/v1/users/update - Update User
POST /api/v1/users/like/:id - Like User
POST /api/v1/users/unlike/:id - UnLike User
```

### Project Structure

```
./src
├── api/            # Routes and services and socket
├── common/         # configService and errors
├── utils/          # Utility classes and functions
├── middleware.ts   # Custom middlewares
├── app.ts          # Express App
└── index.ts        # App Entrypoint
```

### Database

The structure of our database, the data model presented below.

```js

model User {
  id            String              @id @unique @default(uuid())
  name          String
  email         String              @unique
  password      String
  refreshTokens RefreshToken[]
  avatars       UserAvatar[]
  bio           String? 
  latitude      String?
  longitude     String?
  liked         UserLike[]          @relation("UserLikes")
  likedBy       UserLike[]          @relation("UserIsLiked")
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}

model RefreshToken {
  id          String                @id @unique @default(uuid())
  hashedToken String
  userId      String
  User        User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  revoked     Boolean               @default(false)
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
}
model UserAvatar {
  id                     String     @id @default(cuid())
  original               String
  p180                   String?
  p320                   String?
  p640                   String?
  p1280                  String?
  userId                 String
  user                   User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserLike {
  id                      Int       @id @default(autoincrement())
  liker_id                String
  liker                   User      @relation("UserLikes", fields: [liker_id], references: [id], onDelete: Cascade)
  user_id                 String
  user                    User      @relation("UserIsLiked", fields: [user_id], references: [id], onDelete: Cascade)
@@unique([liker_id, user_id])
}
```

## Getting Started

### Prerequisites

This project uses Yarn as package manager

### Installation

```bash
  git clone https://github.com/hosajadi/express-crud-challenge.git
```

Go to the project directory

```bash
  cd express-crud-challenge
```

```bash
  yarn install
```

### Run Locally

Start the server in development mode

> Note: Do not forget to define the .env variables you can use .env.sample
> Note: If you do not have a running MySql server you can run a sample by below command

```bash
  yarn docker:db
```
But if you have one skip the previous command.

```bash
  yarn build
  npx prisma generate
```
If you run the project for the first time you should generate the prisma client,
also migrate the migration file.

```bash
  yarn migrate:deploy
```
Too seed database 
```bash
  yarn seed
```
> Note: The initial user ==> email: 'example@example.com',  password: 'examplePass'  


and finally to run 
```bash
  yarn start
```

### Run with Docker

Run docker compose

```bash
  yarn docker
```
