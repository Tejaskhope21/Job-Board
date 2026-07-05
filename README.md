#  JobNest — AI-Powered Job Portal

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

### A Modern, Full-Stack, AI-Powered Job Portal Platform

**Developed by Tejas Khope**

🌐 **Live Demo:** [jobnestfrontendbytejas.vercel.app](https://jobnestfrontendbytejas.vercel.app)

</div>

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Project Objective](#-project-objective)
3. [Key Features](#-key-features)
4. [AI Features](#-ai-features)
5. [Dashboards](#-dashboards)
6. [Tech Stack](#-tech-stack)
7. [System Architecture](#-system-architecture)
8. [Project Structure](#-project-structure)
9. [User Roles & Functionalities](#-user-roles--functionalities)
10. [Core Modules in Detail](#-core-modules-in-detail)
11. [Data Flow & Processes](#-data-flow--processes)
12. [Database Models](#-database-models)
13. [Authentication & Security](#-authentication--security)
14. [UI/UX Overview](#-uiux-overview)
15. [Responsive Design](#-responsive-design)
16. [Installation & Setup](#-installation--setup)
17. [Environment Variables](#-environment-variables)
18. [API Endpoints Overview](#-api-endpoints-overview)
19. [Screenshots](#-screenshots)
20. [Future Enhancements](#-future-enhancements)
21. [Contributing](#-contributing)
22. [License](#-license)
23. [Author](#-author)
24. [Project Highlights](#-project-highlights)

---

## 📖 Overview

**JobNest** is a modern, full-stack web application built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js) that bridges the gap between talented job seekers and prospective employers. It is designed as a complete, production-style job board platform that streamlines the **entire recruitment lifecycle** — from job discovery and application, to candidate management, AI-assisted content generation, and administrative oversight.

The platform is engineered around **three primary user roles** — **Candidate**, **Employer**, and **Administrator** — each with its own dedicated, purpose-built dashboard and workflow.

JobNest goes beyond a typical CRUD job board by integrating **Google Gemini AI** to power two major intelligent features:

- An **ATS (Applicant Tracking System) Resume Checker** that scores and analyzes candidate resumes.
- An **AI Job Description Generator** that helps employers create professional job postings instantly from just a job title.

**🎥 Watch the AI Job Description Generator demo:**


https://github.com/user-attachments/assets/445cffa5-16f0-423f-a1ad-82a2c390aa3e

This makes JobNest not just a listing platform, but an **intelligent recruitment ecosystem** that adds real value to both sides of the hiring process.

---

## 🎯 Project Objective

The primary objective of JobNest is to create a seamless, efficient, and intelligent job-matching ecosystem. Key goals include:

- **Centralized Job Discovery** — A powerful search and filter engine so candidates can quickly find relevant jobs by title, company, location, and job type.
- **Simplified Application Management** — Let candidates apply for jobs and track their application status in real time.
- **Efficient Employer Tools** — Give employers a single dashboard to post jobs, manage listings, and review applications.
- **Data-Driven Insights** — Offer analytics for employers (job views, applicant counts) and administrators (platform-wide usage and health metrics).
- **AI-Enhanced Recruitment** — Use AI to improve the experience on both sides: resume analysis (ATS scoring) for candidates, and automated job description generation for employers.
- **Secure, Role-Based Access** — Ensure that every user only sees and does what their role permits, using robust authentication and authorization.
- **Scalable, Maintainable Architecture** — Build the platform on a modular, service-oriented structure that can grow with additional features over time.

---

## ✨ Key Features

### 👨‍💼 Candidate Features

- User Registration & Login
- Profile Management (name, email, profile picture, skills)
- Resume Upload (PDF)
- ATS Resume Checker with detailed scoring
- Resume Skill Extraction
- AI-assisted Resume Analysis & Feedback
- Smart Job Matching based on extracted skills
- Browse, Search, and Filter Jobs (by title, company, location, job type, salary)
- Apply for Jobs directly from listings
- Application Tracking with real-time status updates
- Candidate Dashboard with statistics and recent activity
- Saved / Recent Applications view
- View detailed application status history

**Application Status Pipeline:**

| Stage | Description |
|---|---|
| 🟡 Pending | Application submitted, awaiting review |
| 🔵 Reviewed | Employer has reviewed the application |
| 🟣 Shortlisted | Candidate shortlisted for next steps |
| 🟠 Interview Scheduled | Interview has been arranged |
| 🟢 Offered | Job offer extended |
| ✅ Hired | Candidate successfully hired |

---

### 🏢 Employer Features

- Employer Dashboard with key hiring metrics
- Create, Edit, and Delete Job Posts
- Close / Reopen Job Listings
- View and Manage Applicants per job
- Application Status Management (move candidates through the pipeline)
- Dashboard Analytics — total jobs, active jobs, closed jobs, views, applications
- Job Performance Statistics (views vs. applications)
- **AI Job Description Generator** — auto-generate description, responsibilities, requirements, and skills from just a job title
- Applicant Tracking across all postings

---

### 👨‍💻 Admin Features

- Admin Dashboard with platform-wide analytics
- Manage Users (view, search, filter, and moderate all accounts)
- Manage Employers and their job postings
- Manage Candidates and their profiles
- Manage Jobs — oversee every listing on the platform
- Monitor Applications across the platform
- Platform Statistics (Total Users, Employers, Candidates, Jobs, Applications)
- User Role Management
- Job Status Management (approve, flag, or remove listings for quality control)

---

## 🤖 AI Features

JobNest integrates **Google Gemini AI** at two critical points in the recruitment workflow.

### 1. AI Job Description Generator

Employers only need to provide:

- **Job Title**

The AI automatically generates:

- A professional **Job Description** (overview of role and company culture)
- **Responsibilities** — a list of key duties for the role
- **Requirements** — required skills and qualifications
- **Skills** needed for the position
- **Qualifications**
- **Company Overview** content

**How it works:**
1. The employer enters a job title and clicks *"Generate with AI."*
2. The backend sends an engineered prompt to the Gemini API.
3. Gemini returns structured content for description, requirements, and responsibilities.
4. The employer can review, edit, and apply the AI-generated content before publishing.

### 2. ATS Resume Checker

Candidates upload their resume and receive:

- **ATS Score** (e.g., 83% — displayed with a circular progress indicator)
- **Keyword Analysis** — keywords found vs. missing
- **Missing Keywords** — suggestions for keywords to add
- **Resume Strengths** (e.g., *"Strong keyword coverage," "All standard resume sections are present"*)
- **Areas for Improvement** (e.g., *"Contact information may be incomplete," "Few quantifiable achievements found"*)
- **Skill Extraction** — automatically identifies key skills from the resume text
- Downloadable **Resume Feedback Report**

**How it works:**
1. Candidate uploads a resume (PDF) via drag-and-drop or file picker.
2. The backend parses the PDF and extracts raw text using a file parser (Multer + PDF parsing).
3. Skill-extraction logic scans the text for relevant keywords and skills.
4. The system compares extracted content against ATS best practices to generate a score.
5. Results (score, strengths, improvement areas, keyword breakdown) are returned to the frontend for display.

---

## 📊 Dashboards

### Candidate Dashboard
- Total Applications
- Pending Reviews
- Interviews Scheduled
- Offers Received
- Matched Jobs (based on resume skills)
- Resume / ATS Score

### Employer Dashboard
- Total Jobs Posted
- Active Jobs
- Closed Jobs
- Total Applications Received
- Total Job Views
- Recent Applicants

### Admin Dashboard
- Total Users
- Total Employers
- Total Candidates
- Total Jobs
- Total Applications
- Platform-wide Analytics & Trends

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React.js (v19)** | Core UI library |
| **Vite** | Fast development build tool |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client for API requests |
| **React Router** | Client-side routing |
| **React Context API** | Global state management |
| **React Hooks** | Component logic and lifecycle management |
| **React Dropzone** | Drag-and-drop resume/file uploads |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework / REST API layer |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose** | ODM for MongoDB schema modeling |
| **JWT (JSON Web Tokens)** | Stateless authentication |
| **Bcrypt** | Password hashing & salting |
| **Multer** | Handling file/resume uploads |
| **Dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |
| **Google Gemini API** | AI content generation & resume analysis |

### Cloud / External Services

| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Primary database (Users, Jobs, Applications) |
| **Cloudinary** | Cloud storage for resumes, company logos, and images/media |
| **Google Gemini API** | AI content generation and job/skill matching |
| **Vercel** | Frontend hosting / deployment |

---

## 🏗 System Architecture

JobNest follows a **service-oriented backend architecture** behind a single API gateway, designed for security, scalability, and maintainability.

```
                              ┌───────────────────────────┐
                              │        CLIENT (React)      │
                              │  Web interface for job      │
                              │  seekers, employers, admins │
                              └──────────────┬──────────────┘
                                             │  HTTPS / Secure Connection
                                             ▼
                              ┌───────────────────────────┐
                              │   API GATEWAY (Express)     │
                              │  Single entry point for all │
                              │  client requests & API mgmt │
                              └──────────────┬──────────────┘
                     ┌───────────────┬───────┴────────┬───────────────┐
                     ▼               ▼                ▼               ▼
              Auth Middleware  Role-Based Access   Rate Limiting   Request Logging
             (JWT verification) (Permissions per    (Prevents abuse, (Error handling &
                                  user role)          fair API usage)  monitoring)
                                             │
       ┌─────────────┬─────────────┬────────┴────────┬───────────────┬────────────────┐
       ▼             ▼             ▼                 ▼               ▼                ▼
 Auth Service   Job Service  Application Service  User Service    AI Service   Notification Service
 (registration, (posting,    (applications,       (profiles,     (resume       (email alerts,
 login, reset,   search,      status, tracking)    companies,     parsing,      in-app alerts,
 profile mgmt)   filtering)                        roles)         job matching, real-time updates)
                                                                   AI recs)
       │             │              │                  │              │
       ▼             ▼              ▼                  ▼              ▼
 ┌─────────────────────────┐  ┌───────────────────┐  ┌─────────────────────┐
 │      MongoDB Atlas       │  │    Cloudinary      │  │      AI API          │
 │  (User / Job / App Data) │  │ (Resumes, Logos,   │  │ (Google Gemini —     │
 │                          │  │  Images & Media)    │  │ content generation,  │
 │                          │  │                     │  │  job matching)       │
 └─────────────────────────┘  └───────────────────┘  └─────────────────────┘
```

### Architecture Highlights

| Pillar | Description |
|---|---|
| 🛡️ **Security** | End-to-end security with JWT, HTTPS, and strict data validation |
| ⚖️ **Scalability** | Modular, service-based architecture designed for horizontal scaling |
| 🔁 **Reliability** | Centralized error handling, logging, and monitoring |
| ⚡ **Performance** | Caching, rate limiting, and optimized database queries |
| 🧩 **Maintainability** | Clean code, modular design, and thorough documentation |

---

## 📂 Project Structure

```
JobNest
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components      # Reusable UI components (cards, badges, forms, etc.)
│   │   ├── pages            # Route-level page components (Dashboard, Jobs, ATS Check, etc.)
│   │   ├── context          # React Context providers (auth, user state, etc.)
│   │   ├── hooks             # Custom React hooks
│   │   ├── services          # API service layer (Axios calls)
│   │   ├── assets            # Images, icons, static files
│   │   ├── layouts           # Shared layout wrappers (dashboard shell, auth layout)
│   │   └── utils              # Helper/utility functions
│
├── backend
│   ├── config                # Database & environment configuration
│   ├── controllers            # Route handler logic (auth, jobs, applications, AI, etc.)
│   ├── middleware              # JWT verification, role-based access, error handling
│   ├── models                  # Mongoose schemas (User, Job, Application, Resume)
│   ├── routes                   # Express route definitions
│   ├── uploads                    # Local resume/file storage (or cloud reference)
│   ├── services                    # Business logic (AI integration, resume parsing, ATS scoring)
│   ├── utils                        # Helper functions (token generation, validators, etc.)
│   └── server.js                     # Application entry point
│
└── README.md
```

---

## 👥 User Roles & Functionalities

### 6.1 Candidate
- **Landing / Home** — Browse and search for jobs.
- **Dashboard** — View application statistics and recent activity.
- **Matched Jobs** — Jobs recommended based on skills extracted from the uploaded resume.
- **My Applications** — View and filter applications by status (Pending, Reviewed, Shortlisted, etc.).
- **ATS Check** — Upload a resume and receive an ATS score (e.g., 83%) with detailed feedback on keywords, strengths, and areas for improvement.

### 6.2 Employer
- **Employer Dashboard** — Summary of all job postings (Total Jobs, Active Jobs, Views, Applicants).
- **Post a Job** — Form to create a new job listing, including an **"AI Job Description Generator"** button that fetches pre-filled content from Google Gemini.
- **My Jobs** — Table/list view of all job postings with filters and management options (View, Edit, Close).

### 6.3 Admin
- **Admin Dashboard** — High-level overview of platform performance, including charts for users, jobs, and applications.
- **Manage Users** — Searchable, filterable list of all registered users by role (Employer, Candidate, Admin), with administrative actions.
- **Manage Jobs** — List of all jobs posted on the platform, with the ability to view details and manage statuses for quality control.

---

## 🧩 Core Modules in Detail

### 7.1 Authentication & Authorization
JobNest implements a secure authentication system using **JWT**. Passwords are hashed using **Bcrypt** before being stored in MongoDB. Protected API routes (e.g., dashboards, job posting) are guarded by middleware that verifies the JWT token and checks the user's role before granting access.

### 7.2 Job Management
Employers and Admins can **create, read, update, and delete (CRUD)** job listings. The system supports advanced search functionality using MongoDB queries to filter jobs by **title, location, company, job type, and salary range**.

### 7.3 Application Tracking System (ATS)
This is a core candidate-facing feature, made up of:

- **Resume Parsing** — When a candidate uploads a resume, the backend processes the PDF file to extract raw text using a file parser.
- **Skill Extraction** — The backend uses algorithms to identify and list key skills from the extracted text.
- **Job Matching** — The system compares the candidate's skills against skills required by various job postings.
- **ATS Score** — The Resume Checker evaluates the resume against common ATS standards and returns:
  - **Keywords Found** — number of relevant keywords present.
  - **Missing Keywords** — keywords that should be added.
  - **Strengths** — e.g., *"Strong keyword coverage," "All standard resume sections are present."*
  - **Areas for Improvement** — e.g., *"Contact information may be incomplete," "Few quantifiable achievements found."*

### 7.4 AI-Powered Job Description Generator
JobNest leverages the **Google Gemini API** to help employers create compelling, complete job descriptions.

- **Input:** The employer provides a job title.
- **Processing:** The backend sends a prompt engineered to generate a professional job posting to Gemini.
- **Output:** The AI returns pre-filled content for:
  - **Description** — overview of the role and company culture.
  - **Requirements** — list of required skills and qualifications.
  - **Responsibilities** — list of key duties for the role.

---

## 🔄 Data Flow & Processes

### Resume Processing Workflow
```
Upload Resume
     │
     ▼
PDF Parsing
     │
     ▼
Extract Text
     │
     ▼
Skill Extraction
     │
     ▼
ATS Analysis
     │
     ▼
Generate ATS Score
     │
     ▼
Provide Feedback
```

### Job Posting Workflow
```
Employer Login
     │
     ▼
Create Job
     │
     ▼
AI Generates Description
     │
     ▼
Review Content
     │
     ▼
Publish Job
     │
     ▼
Candidates Apply
```

### Application Workflow
```
Candidate Login
     │
     ▼
Search Jobs
     │
     ▼
View Details
     │
     ▼
Apply
     │
     ▼
Employer Reviews
     │
     ▼
Status Updates
```

### Step-by-Step Data Flow

1. **User Registration / Login** — Data is sent from the client to the `/api/auth` route for validation, password hashing, JWT token generation, and storage in the `Users` collection.
2. **Job Posting** — An Employer creates a job. The data is sent via Axios to `/api/jobs`. The backend saves the job document to the `Jobs` collection.
3. **Job Application** — A Candidate applies for a job. The request creates a document in the `Applications` collection and updates the job's applicant count.
4. **Resume Upload & ATS Check:**
   - The candidate uploads a file via Multer.
   - The file is stored in the `/uploads` folder or cloud storage (Cloudinary).
   - The text is extracted and parsed.
   - The backend processes the text to determine a score, extract skills, and generate feedback.
   - The result is sent back to the frontend for display.
5. **AI Job Description** — A request is sent from the frontend to `/api/ai/generate`, which interacts with Gemini and returns the generated content.

---

## 🗄 Database Models

### User Model
| Field | Description |
|---|---|
| `_id` | Unique identifier |
| `name` | Full name |
| `email` | Unique email address |
| `password` | Hashed password |
| `role` | `admin` / `employer` / `candidate` |
| `profilePicture` | Profile image URL |
| `resumeUrl` | Link to uploaded resume |
| `skills` | Array of extracted/declared skills |

### Job Model
| Field | Description |
|---|---|
| `_id` | Unique identifier |
| `title` | Job title |
| `company` | Company name |
| `location` | Job location |
| `description` | Full job description |
| `requirements` | List of requirements |
| `salary` | Salary range |
| `type` | Job type (full-time, part-time, remote, etc.) |
| `postedBy` | Reference to the Employer (User) |
| `applications` | Count / references to applications |
| `views` | Number of times the job was viewed |

### Application Model
| Field | Description |
|---|---|
| `_id` | Unique identifier |
| `jobId` | Reference to the Job |
| `candidateId` | Reference to the applying User |
| `status` | `pending` / `reviewed` / `shortlisted` / `interview` / `offered` / `hired` |
| `appliedDate` | Timestamp of application |
| `expectedSalary` | Candidate's expected salary |

### Resume Model
| Field | Description |
|---|---|
| `resumeText` | Extracted raw text from resume |
| `extractedSkills` | Skills identified from the resume |
| `atsScore` | Computed ATS compatibility score |
| `feedback` | Strengths and improvement suggestions |

> The Resume Model is primarily used for temporary storage/analysis of parsed resume content used during ATS scoring.

---

## 🔐 Authentication & Security

JobNest takes a defense-in-depth approach to security:

- **JWT Authentication** — Stateless, token-based authentication storing only necessary user claims.
- **Password Hashing** — Bcrypt is used to salt and hash all user passwords before storage.
- **Role-Based Access Control (RBAC)** — Middleware restricts access to routes based on the user's role (`admin`, `employer`, `candidate`).
- **Protected Routes** — Sensitive frontend routes and backend APIs are gated behind authentication checks.
- **Input Validation** — Data is validated on both the client and server sides to prevent injection attacks.
- **Environment Variables** — Sensitive data (DB URIs, JWT secrets, API keys) is stored securely in `.env` files and never committed to source control.
- **Secure API Access** — CORS policies and middleware layers control which origins can access the API.

**Supported Roles:**
- Candidate
- Employer
- Admin

---

## 🎨 UI/UX Overview

The JobNest interface is designed to be **clean, modern, and highly intuitive**, ensuring a seamless experience across all user roles.

- **Theme:** Professional blue-and-white color scheme that conveys trust and reliability.
- **Dashboard-Centric Design:** Each role has a dedicated dashboard that acts as a command center for their primary tasks.
- **Data Presentation:** Clear metrics, badges (e.g., "Active"), status tags ("Pending," "Reviewed"), and progress bars (ATS Score) make complex information easy to digest at a glance.
- **Interactive Elements:** Cards, statistic widgets, and clean navigation improve overall usability.
- **Consistent Component Library:** Built with reusable, Tailwind-styled components for visual consistency across pages.

---

## 📱 Responsive Design

JobNest is fully responsive and optimized for:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile Devices

The layout, built with **Tailwind CSS**, automatically adapts to different screen sizes without sacrificing usability or visual clarity.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API key
- (Optional) Cloudinary account for file/image storage

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jobnest.git
cd jobnest
```

### 2. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173` (default Vite port)
- Backend API: `http://localhost:5000`

---

## ⚙ Environment Variables

Create a `.env` file inside the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Client
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file to version control.** Add it to `.gitignore` to keep your secrets safe.

---

## 🔌 API Endpoints Overview

> Base URL: `/api`

| Route | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Log in and receive a JWT | Public |
| `/api/jobs` | GET | Get all job listings (with filters) | Public |
| `/api/jobs` | POST | Create a new job posting | Employer |
| `/api/jobs/:id` | PUT | Update a job posting | Employer/Admin |
| `/api/jobs/:id` | DELETE | Delete a job posting | Employer/Admin |
| `/api/applications` | POST | Apply for a job | Candidate |
| `/api/applications/:id` | PUT | Update application status | Employer |
| `/api/applications/my` | GET | Get candidate's own applications | Candidate |
| `/api/resume/upload` | POST | Upload resume for ATS check | Candidate |
| `/api/resume/analyze` | POST | Run ATS analysis on uploaded resume | Candidate |
| `/api/ai/generate` | POST | Generate AI job description | Employer |
| `/api/admin/users` | GET | List/manage all users | Admin |
| `/api/admin/jobs` | GET | List/manage all jobs | Admin |

> Exact route names may vary slightly depending on your backend implementation — update this table to match your actual route definitions.

---

## 🖼 Screenshots

> Add screenshots of your application here to give visitors a quick visual overview.

| Screen | Description |
|---|---|
| 🏠 Landing Page | Job search and popular categories |
| 📊 Candidate Dashboard | Application stats and matched jobs |
| 🧾 ATS Resume Checker | Resume score, keywords, and feedback |
| 🏢 Employer Dashboard | Job stats and applicant overview |
| ✨ AI Job Description Generator | AI-generated description, requirements, responsibilities |
| 👨‍💻 Admin Dashboard | Platform-wide analytics and management tools |

```
![Landing Page](./screenshots/landing-page.png)
![Candidate Dashboard](./screenshots/candidate-dashboard.png)
![ATS Checker](./screenshots/ats-checker.png)
![Employer Dashboard](./screenshots/employer-dashboard.png)
![AI Job Generator](./screenshots/ai-job-generator.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 📈 Future Enhancements

- 📧 Email Notifications (application updates, interview alerts)
- 🎥 Video Interview Integration
- 📝 Resume Builder tool
- 🤖 AI Career Advisor / Chatbot
- ⭐ Company Reviews & Ratings
- 💬 Real-time Chat Between Employer & Candidate
- 🧠 Job Recommendations powered by Machine Learning
- 🌙 Dark Mode
- 🌍 Multi-language Support
- 📱 Dedicated Mobile Application
- 🔔 Push Notifications
- 📊 Advanced Analytics & Reporting for Admins

---

## 🤝 Contributing

Contributions are welcome and appreciated! To contribute:

1. **Fork** the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add: your feature description"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** describing your changes.

Please make sure your code follows the existing style conventions and includes relevant comments where necessary.

---

## 📄 License

This project is developed for **educational and portfolio purposes** under the **MIT License**. You are free to use, modify, and distribute this project with proper attribution.

---

## 👨‍💻 Author

### Tejas Khope


- 🌐 Live Project: [jobnestfrontendbytejas.vercel.app](https://jobnestfrontendbytejas.vercel.app)
- 💼 Specialization: MERN Stack, AI Integration, Full-Stack Web Development

---

## ⭐ Project Highlights

✅ Full MERN Stack Architecture
✅ AI-Powered (Google Gemini Integration)
✅ ATS Resume Checker with Scoring
✅ Resume Skill Extraction
✅ Smart Job Matching
✅ Role-Based Authentication (Candidate / Employer / Admin)
✅ Dedicated Employer, Admin & Candidate Dashboards
✅ Fully Responsive UI (Tailwind CSS)
✅ MongoDB Atlas Cloud Database
✅ JWT-Based Secure Authentication
✅ Clean, Modular, Professional Architecture
✅ Scalable Service-Oriented Backend Design

---

<div align="center">

### ⭐ If you like this project, don't forget to give it a Star on GitHub!

**Made with ❤️ by Tejas Khope**

</div>
