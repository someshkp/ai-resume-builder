## 🌐 Live Demo & Deployment

**Live Application:**
🔗 https://ai-resume-builders-kj5h60khh-someshkps-projects.vercel.app/login

### Deployment Architecture

The application is deployed using separate services for the frontend and backend:

* **Frontend:** Hosted on **Vercel**
* **Backend:** Hosted on **Render**
* **Database:** MongoDB Atlas

```text
Frontend (React + Vite)
        │
        ▼
      Vercel
        │
 REST API Calls
        │
        ▼
 Backend (Node.js + Express)
        │
        ▼
      Render
        │
        ▼
   MongoDB Atlas
```

### Production Stack

| Layer          | Technology              | Hosting         |
| :------------- | :---------------------- | :-------------- |
| Frontend       | React 19 + Vite + Sass  | Vercel          |
| Backend        | Node.js + Express       | Render          |
| Database       | MongoDB + Mongoose      | MongoDB Atlas   |
| AI Models      | Gemini API, Groq API    | External APIs   |
| PDF Generation | Puppeteer               | Backend Service |
| Authentication | JWT + HTTP-only Cookies | Backend         |

The frontend and backend are maintained within a single monorepo and deployed independently, enabling easier development and scalable production deployments.


# AI Resume Builder & Interview Prep Assistant

An AI-powered web application that helps job seekers align their resumes with job descriptions, receive targeted technical and behavioral preparation advice, identify skill gaps, and generate customized, high-quality resumes tailored for specific roles.

---

## 🌟 Key Features

*   **Tailored AI Job Match:** Evaluates how well a resume matches a job description and gives a match score.
*   **Targeted Preparation:** Generates customized technical and behavioral interview questions based on the candidate's experience and target role.
*   **Skill Gap Analysis:** Highlights crucial skills missing from the resume relative to the job requirements.
*   **Actionable Preparation Plan:** Provides a structured, step-by-step roadmap to bridge gaps and prepare for the interview.
*   **Tailored PDF Resume Generation:** Generates a clean, professional resume PDF compiled dynamically via Puppeteer.
*   **Secure Authentication:** Built-in signup, login, and session tracking using JWTs and HTTP-only cookies.

---

## 🏗️ Project Architecture

```
   ┌────────────────┐                ┌─────────────────┐
   │                │   REST API     │                 │
   │  React Frontend│ ─────────────> │  Express Backend│
   │  (Vite + Sass)  │ <───────────── │   (Node.js)     │
   │                │  JWT / JSON    │                 │
   └────────────────┘                └────────┬────────┘
                                              │ Mongoose
                                              ▼
                                     ┌─────────────────┐
                                     │  MongoDB Atlas  │
                                     │   Database      │
                                     └─────────────────┘
```

The codebase is divided into two primary directories:
1.  **[Frontend](file:///c:/myProjects/ai-resume-builder/Frontend)**: React 19 SPA bootstrapped with Vite, styled with Sass (SCSS), using React Router 7 for navigation.
2.  **[Backend](file:///c:/myProjects/ai-resume-builder/Backend)**: Node.js and Express.js server interacting with MongoDB (via Mongoose), utilizing Gemini & Groq APIs for generation, and Puppeteer for PDF creation.

---

## 🛠️ Tech Stack

### Frontend
*   **Core:** React 19, React Router 7
*   **Build Tool:** Vite
*   **Styles:** Sass (SCSS)
*   **Icons:** Lucide React
*   **API Client:** Axios

### Backend
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB & Mongoose
*   **AI Models:** `@google/genai`, `@google/generative-ai`, `groq-sdk`
*   **PDF Generation:** Puppeteer
*   **File Uploads:** Multer (for resume PDF uploads)
*   **Security:** JSON Web Tokens (JWT), `bcryptjs`, Cookie Parser, CORS

---

## 📂 Project Structure

```text
ai-resume-builder/
├── Backend/                    # Node.js Express server
│   ├── src/
│   │   ├── config/             # DB and system configs
│   │   ├── controller/         # API controllers
│   │   ├── middlewares/        # Authentication and file upload middlewares
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes (auth, interview)
│   │   ├── services/           # AI and utility services
│   │   └── app.js              # Express app initialization
│   ├── .env                    # Environment variables (secret)
│   ├── .gitignore              # Backend ignore rules
│   ├── package.json            # Node.js scripts & dependencies
│   └── server.js               # Entry point
│
└── Frontend/                   # React Frontend
    ├── public/                 # Static assets
    ├── src/
    │   ├── features/           # Modularized feature folders
    │   │   ├── auth/           # Login, registration, session management
    │   │   └── interview/      # Home dashboard, Report, PDF viewer
    │   ├── styles/             # Global Sass styles
    │   ├── App.jsx             # Main App layout
    │   ├── app.routes.jsx      # Navigation routing
    │   └── main.jsx            # Entry point mounting
    ├── .gitignore              # Frontend ignore rules
    ├── package.json            # Vite scripts & dependencies
    └── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/someshkp/ai-resume-builder.git
    cd ai-resume-builder
    ```

2.  **Configure Backend Environment Variables**
    Create a `.env` file inside the `Backend/` directory:
    ```bash
    cd Backend
    touch .env
    ```
    Add the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    GOOGLE_GENAI_API_KEY=your_gemini_api_key
    GROQ_API_KEY=your_groq_api_key
    PORT=3000
    ```

3.  **Install Backend Dependencies & Start Server**
    ```bash
    npm install
    npm run dev  # Starts the nodemon server on http://localhost:3000
    ```

4.  **Install Frontend Dependencies & Start App**
    In a separate terminal, navigate to the `Frontend/` directory:
    ```bash
    cd ../Frontend
    npm install
    npm run dev  # Starts the Vite dev server on http://localhost:5173
    ```

---

## 📡 API Endpoints

### Authentication `/api/auth`
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Registers a new user | Public |
| **POST** | `/login` | Authenticates user and issues HTTP-only cookie | Public |
| **POST** | `/logout` | Clears authentication cookie | Private |
| **GET** | `/me` | Returns current user profile | Private |

### Interview & Resume `/api/interview`
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/generate-interview-report` | Generates a report from JD, Self Desc, and Resume PDF | Private |
| **GET** | `/reports` | Retrieves list of all reports for logged-in user | Private |
| **GET** | `/report/:interviewId` | Gets full details of a specific report | Private |
| **POST** | `/resume/pdf/:interviewReportId` | Generates a tailored PDF resume from a report | Private |

---

## 📝 License

This project is licensed under the ISC License.
