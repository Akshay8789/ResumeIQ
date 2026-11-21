# ResumeIQ – AI-Powered Resume Analyzer

ResumeIQ is an AI-powered resume analysis platform that helps users evaluate their resumes, identify skill gaps, and receive actionable suggestions to improve their professional profiles.

Built using the MERN stack and Google Gemini AI, ResumeIQ analyzes uploaded PDF resumes and provides intelligent feedback to help candidates improve their resumes and career readiness.

## 🚀 Live Demo

- **Frontend:** https://resume-iq-flame-sigma.vercel.app
- **Backend API:** https://resumeiq-lxe7.onrender.com
- **GitHub Repository:** https://github.com/Akshay8789/ResumeIQ

## ✨ Features

- **AI-Powered Resume Analysis:** Analyze resumes using Google Gemini AI.
- **Resume Scoring:** Get an AI-generated resume evaluation score.
- **Improvement Suggestions:** Receive recommendations to improve resume quality.
- **Skill Gap Analysis:** Identify missing or weak skills.
- **PDF Resume Upload:** Upload resumes in PDF format.
- **User Authentication:** Register and log in securely.
- **Personal Dashboard:** Access resume analysis and related information.
- **AI Insights:** Get personalized feedback based on resume content.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Axios
- React Router
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- PDF Parsing

### AI Integration
- Google Gemini API
- Google Generative AI SDK (`@google/genai`)

### Deployment & Tools
- Git & GitHub
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- Postman
- VS Code

## 📂 Project Structure

```text
ResumeIQ/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Akshay8789/ResumeIQ.git
```

```bash
cd ResumeIQ
```

### 2. Setup Frontend

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### 3. Setup Backend

Open another terminal:

```bash
cd ResumeIQ/server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5001
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/resumeiq

JWT_SECRET=your_secure_secret_key_at_least_32_characters

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=your_supported_gemini_model
GEMINI_FALLBACK_MODEL=your_fallback_gemini_model

CLIENT_URL=http://localhost:5173,http://localhost:5174

COOKIE_NAME=resumeiq_token
MAX_FILE_SIZE_MB=5
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5001
```

**Note:** Replace the placeholder environment values with your actual configuration. Never upload `.env` files or API keys to GitHub.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Primary Gemini model |
| `GEMINI_FALLBACK_MODEL` | Fallback AI model |
| `CLIENT_URL` | Allowed frontend origins |
| `COOKIE_NAME` | Authentication cookie name |
| `MAX_FILE_SIZE_MB` | Maximum PDF upload size |

## 🔄 Application Workflow

1. User registers or logs into ResumeIQ.
2. User uploads a resume in PDF format.
3. Backend extracts text from the uploaded PDF.
4. Extracted resume content is processed using Google Gemini AI.
5. AI analyzes the resume and generates feedback.
6. User receives resume scores, insights, and improvement suggestions.
7. Analysis information is available through the dashboard.

## 🌐 Deployment

ResumeIQ is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI Service | Google Gemini API |

## 🔒 Security

- JWT-based authentication.
- HTTP-only authentication cookies.
- Environment variables for sensitive credentials.
- PDF file type and size validation.
- Backend request validation and security middleware.

## 🔮 Future Enhancements

- ATS compatibility analysis.
- Job description and resume matching.
- AI-powered resume rewriting.
- Resume templates and customization.
- LinkedIn profile optimization.
- Interview preparation based on resume skills.
- Export improved resumes as PDF.

## 👨‍💻 Author

**Akshay Rajput**

B.Tech Computer Science & Engineering | Full Stack Developer

- GitHub: https://github.com/Akshay8789
- LinkedIn: https://www.linkedin.com/in/akshay-rajput-302121279

## ⭐ Support

If you find ResumeIQ useful, consider giving this repository a star ⭐ on GitHub.

---

**Built with ❤️ using MERN Stack and Google Gemini AI.**
