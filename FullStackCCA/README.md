# CCA — Chitral Coaching Academy

An online learning platform built as a capstone project. Instructors create and publish courses, Students enroll and learn, and an Admin manages the whole platform.

## Tech Stack
- **Backend:** Laravel (REST API)
- **Database:** MySQL
- **Frontend:** React

## Features
- User registration and login with three roles: Admin, Instructor, Student
- Instructors can create, edit, and delete their own courses and lessons
- Students can browse courses, enroll, track lesson progress, and take quizzes
- Students can leave reviews on courses they're enrolled in
- Admin can approve or reject submitted courses, and manage users

## Project Structure
```
FullStackCCA/
  online-learning-backend/   → Laravel API
  online-learning-frontend/  → React app
```

## Setup Instructions

### Backend (online-learning-backend)
1. Run `composer install`
2. Copy `.env.example` to `.env` and set your database credentials
3. Run `php artisan key:generate`
4. Run `php artisan migrate --seed`
5. Run `php artisan serve`

### Frontend (online-learning-frontend)
1. Run `npm install`
2. Copy `.env.example` to `.env` and confirm `VITE_API_URL` points to your backend
3. Run `npm run dev`

## Demo Login Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@cca.com | password |
| Instructor | instructor@cca.com | password |
| Student | student@cca.com | password |

## Author
Talha Habib
