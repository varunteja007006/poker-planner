# Poker Planner - Development Checklist

## 📋 Project Overview
This is a comprehensive checklist for the Poker Planner application development, including database tables, features, and development tasks.

## 🗄️ Database Tables

### Core Tables

#### 1. **users**
- **Purpose**: Users who are logged into the platform
- **Key Fields**: 
  - `id` (Primary Key)
  - `username` (Unique)
  - `user_token` (Unique)
  - `is_active`
- **Status**: ✅ Implemented
- **Entity**: `src/users/entities/user.entity.ts`

#### 2. **client**
- **Purpose**: Socket instance tracking for users
- **Key Fields**:
  - `id` (Primary Key)
  - `client_id`
  - `session_id`
  - `user_id` (Foreign Key → users)
- **Status**: ✅ Implemented
- **Entity**: `src/clients/entities/client.entity.ts`

#### 3. **rooms**
- **Purpose**: Sprint planning rooms that users can create and join
- **Key Fields**:
  - `id` (Primary Key)
  - `room_code` (Unique)
  - `is_active`
- **Status**: ✅ Implemented
- **Entity**: `src/rooms/entities/room.entity.ts`

#### 4. **teams**
- **Purpose**: Users in a room combined into a team
- **Key Fields**:
  - `id` (Primary Key)
  - `user_id` (Foreign Key → users)
  - `room_id` (Foreign Key → rooms)
  - `is_room_owner`
- **Status**: ✅ Implemented
- **Entity**: `src/teams/entities/team.entity.ts`

#### 5. **stories**
- **Purpose**: User stories for sprint planning estimation
- **Key Fields**:
  - `id` (Primary Key)
  - `title`
  - `description`
  - `room_id` (Foreign Key → rooms)
  - `finalized_story_point`
  - `story_point_evaluation_status` (Enum: pending, in progress, completed)
- **Status**: ✅ Implemented
- **Entity**: `src/stories/entities/story.entity.ts`

#### 6. **story_points** *(Removed - Replaced with JSON voting)*
- **Previous Purpose**: User votes/estimates for story points (separate table)
- **Status**: ❌ **REMOVED** - Table eliminated, replaced with JSON column in stories
- **New Implementation**: Voting data stored as JSON array in `stories.votes` column
- **Vote Structure**:
  ```json
  [
    {
      "user_id": "string",
      "username": "string", 
      "vote": "string",
      "voted_at": "timestamp"
    }
  ]
  ```

### Common Fields
All tables include standard audit fields:
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `created_by` (user reference)
- `updated_at` (timestamp)
- `updated_by` (user reference)
- `deleted_at` (timestamp, nullable)
- `deleted_by` (user reference, nullable)

## 🏗️ Backend Features Checklist

### Authentication & User Management
- [x] User creation endpoint (`POST /users`)
- [x] Get user by ID (`GET /users/:id`)
- [x] User validation with localStorage sync
- [x] Automatic session cleanup for invalid users
- [x] Reset functionality for user sessions

### Room Management
- [x] Room creation
- [x] Room joining by code
- [x] Room listing
- [x] Room updates
- [x] Room deletion

### Team Management
- [x] Add users to teams
- [x] Room owner designation
- [x] Team member listing
- [x] Remove users from teams

### Story Management
- [x] Create stories
- [x] Update stories
- [x] List stories by room
- [x] Delete stories
- [x] Story status management (pending/in-progress/completed)

### Story Point Voting *(New JSON-based Implementation)*
- [x] Submit story point votes (JSON column)
- [x] Retrieve votes for a story
- [x] Real-time vote updates via WebSocket
- [x] User vote validation and duplicate prevention
- [x] Vote aggregation and average calculation
- [x] Lightweight voting without separate table

### Real-time Features (WebSocket)
- [x] Socket connection management
- [x] Room-based messaging
- [x] Real-time vote updates
- [x] Live story updates

### Health Checks
- [x] Backend health endpoint
- [x] Database health endpoint

## 🎨 Frontend Features Checklist

### Core Components
- [x] User authentication flow
- [x] Room creation/joining interface
- [x] Story management interface
- [x] Voting interface
- [x] Real-time updates via Socket.IO

### UI Components
- [x] Navigation with reset button
- [x] Room code sharing
- [x] Story cards
- [x] Voting cards
- [x] Results visualization

### State Management
- [x] User state management (Context API)
- [x] Room state management
- [x] Story state management
- [x] Real-time state synchronization

### Data Persistence
- [x] LocalStorage integration
- [x] Automatic validation with backend
- [x] Session cleanup for invalid users

## 🔧 Development Tools

### Code Quality
- [x] ~~Husky for Git hooks~~ (Removed)
- [x] ~~lint-staged for pre-commit checks~~ (Removed)
- [x] ESLint configuration
- [x] Prettier formatting
- [x] TypeScript strict mode

### API Documentation
- [x] Postman collection available
- [x] API endpoints documented
- [ ] Swagger/OpenAPI documentation

### Database
- [x] Database schema (DBML)
- [x] TypeORM entities
- [x] Database migrations
- [x] Relationship mappings

## 🚀 Deployment Checklist

### Backend
- [x] NestJS application setup
- [x] TypeORM configuration
- [x] Environment configuration
- [x] Build process (`pnpm build`)
- [ ] Production deployment
- [ ] Environment variables setup
- [ ] Database migration in production

### Frontend
- [x] Next.js application setup
- [x] Tailwind CSS styling
- [x] Component library (shadcn/ui)
- [x] Build process
- [ ] Production deployment
- [ ] Environment variables setup

## 📝 API Endpoints Summary

### Users
- `POST /users` - Create user ✅ **USED**
- ~~`GET /users` - List all users~~ ❌ **NOT USED**
- `GET /users/:id` - Get user by ID ✅ **USED**
- ~~`PATCH /users/:id` - Update user~~ ❌ **REMOVED** (Not used by frontend)
- ~~`DELETE /users/:id` - Delete user~~ ❌ **REMOVED** (Not used by frontend)

### Rooms
- `POST /rooms` - Create room ✅ **USED**
- `GET /rooms` - Get rooms (with query params) ✅ **USED**
- ~~`GET /rooms/:id` - Get room by ID~~ ❌ **NOT USED**
- ~~`PATCH /rooms/:id` - Update room~~ ❌ **NOT USED**
- ~~`DELETE /rooms/:id` - Delete room~~ ❌ **NOT USED**

### Teams
- `GET /teams` - Get teams (with query params) ✅ **USED**
- `POST /teams` - Add user to team ✅ **USED**
- `GET /teams/:id` - Get team by ID ✅ **USED**
- ~~`PATCH /teams/:id` - Update team~~ ❌ **NOT USED**
- ~~`DELETE /teams/:id` - Remove from team~~ ❌ **NOT USED**

### Stories
- `POST /stories` - Create story ✅ **USED**
- `PATCH /stories/:id` - Update story ✅ **USED**
- `POST /stories/:id/vote` - Submit vote ✅ **NEW** (JSON-based voting)
- `GET /stories/:id/votes` - Get votes ✅ **NEW** (JSON-based voting)
- ~~`GET /stories` - List stories~~ ❌ **REMOVED** (Not used by frontend)
- ~~`GET /stories/:id` - Get story by ID~~ ❌ **REMOVED** (Not used by frontend)
- ~~`DELETE /stories/:id` - Delete story~~ ❌ **REMOVED** (Not used by frontend)

### Story Points *(Replaced with JSON-based voting)*
- ~~**ENTIRE MODULE REMOVED**~~ ❌ **Table approach replaced**
- ✅ **NEW: JSON-based voting in stories table**
- ✅ `POST /stories/:id/vote` - Submit vote endpoint
- ✅ `GET /stories/:id/votes` - Get votes endpoint  
- ✅ WebSocket: `story-points:create` - Real-time vote broadcasting
- ✅ Lightweight voting without separate table overhead

### Health
- `GET /health/backend` - Backend health check ✅ **USED**
- `GET /health/db` - Database health check ✅ **USED**

## 🔄 WebSocket Events

### Connection Events
- `connection` - Client connects
- `disconnect` - Client disconnects

### Room Events
- `join-room` - Join a planning room
- `leave-room` - Leave a planning room

### Story Events
- `story-created` - New story added
- `story-updated` - Story modified
- `story-deleted` - Story removed

### Voting Events *(Updated for JSON-based voting)*
- `story-points:create` - New vote submitted (JSON-based)
- `room-metadata` - Updated to include current votes
- `voting-complete` - All votes submitted
- `consensus-reached` - Story points finalized

## 📊 Project Statistics

- **Total Tables**: 5 core tables (story_points table replaced with JSON column)
- **Backend Modules**: 5 active modules (users, clients, rooms, teams, stories, common) - **story_points module removed**
- **API Endpoints**: ✅ **13 ACTIVE endpoints** (11 + 2 new voting endpoints)
- **WebSocket Events**: ~10 real-time events
- **Frontend Pages**: ~3 main pages
- **UI Components**: ~20 reusable components

## 🔍 API Usage Analysis (Last Updated: January 13, 2025)

### **Actively Used Endpoints** (13 total):
1. `POST /users` - User creation
2. `GET /users/:id` - User validation  
3. `POST /rooms` - Room creation
4. `GET /rooms` - Room lookup by code
5. `GET /teams` - Team listing with filters
6. `POST /teams` - Join team/room
7. `GET /teams/:id` - Team details
8. `POST /stories` - Story creation
9. `PATCH /stories/:id` - Story updates
10. `POST /stories/:id/vote` - Submit vote ✅ **NEW** (JSON-based)
11. `GET /stories/:id/votes` - Get votes ✅ **NEW** (JSON-based)
12. `GET /health/backend` - Backend health
13. `GET /health/db` - Database health

### **Cleaned Up/Removed Endpoints**:
- ❌ `GET /users` - List all users (not needed)
- ❌ `PATCH /users/:id` - Update user (**REMOVED** + UpdateUserDto deleted)
- ❌ `DELETE /users/:id` - Delete user (**REMOVED**)
- ❌ `GET /rooms/:id` - Get room by ID (**REMOVED**)
- ❌ `PATCH /rooms/:id` - Update room (**REMOVED** + UpdateRoomDto deleted)
- ❌ `DELETE /rooms/:id` - Delete room (**REMOVED**)
- ❌ `PATCH /teams/:id` - Update team (**REMOVED** + UpdateTeamDto deleted)
- ❌ `DELETE /teams/:id` - Remove from team (**REMOVED**)
- ❌ `GET /stories` - List stories (**REMOVED** + findAll method deleted)
- ❌ `GET /stories/:id` - Get story by ID (**REMOVED** + findOne method deleted)
- ❌ `DELETE /stories/:id` - Delete story (**REMOVED** + remove method deleted)
- ❌ **ENTIRE story_points module** - All endpoints, controller, service, DTOs, and entity **COMPLETELY REMOVED**

### **Results of Cleanup + New Voting Implementation**:
- **API surface optimized to 13 focused endpoints** (from ~30+ to 13)
- **Removed 4 unused DTO files** (UpdateUserDto, UpdateRoomDto, UpdateTeamDto, all story_points DTOs)
- **Replaced story_points table with JSON column** (simpler, more efficient)
- **Added 2 new voting endpoints** (POST/GET for votes)
- **Enhanced WebSocket voting events** for real-time updates
- **Maintained voting functionality** without table overhead
- **Cleaner, more focused backend** aligned with frontend usage patterns
- **Easier maintenance** with fewer unused code paths

## 🎯 Next Steps & Future Enhancements

### High Priority
- [ ] Add API documentation (Swagger)
- [ ] Implement user roles and permissions
- [ ] Add story estimation templates (Fibonacci, T-shirt sizes)
- [ ] Export planning results

### Medium Priority
- [ ] Add story comments/discussion
- [ ] Implement story dependencies
- [ ] Add planning session history
- [ ] User profile management

### Low Priority
- [ ] Dark/light theme toggle
- [ ] Multiple estimation methods
- [ ] Planning analytics dashboard
- [ ] Integration with project management tools

---

**Last Updated**: January 13, 2025  
**Project Status**: ✅ Core Features Complete + Backend Optimized  
**Version**: 0.1.0