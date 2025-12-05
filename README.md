# Flashcardify — Frontend

Live App: https://flashcardify-frontend.vercel.app/

This repository contains the **frontend application** for **Flashcardify**, a full-stack platform that turns user input into **interactive flashcards** using AI-powered processing.

The frontend handles the complete user experience — input collection, API communication with the backend, flashcard rendering, and dynamic UI updates.

---

## 🌐 Project Links

- **Frontend Repository:** https://github.com/ManikaKutiyal/flashcardify-frontend  
- **Backend Repository:** https://github.com/ManikaKutiyal/flashcardify-backend  
- **Live Backend API:** https://flashcardify-backend.vercel.app/

---

## 📌 What is Flashcardify?

Flashcardify is an educational AI tool designed to help users learn faster by converting **notes, topics, or text input into flashcards**.

### Workflow:
1. User submits text or study topics from the frontend.
2. Frontend sends the input to the backend API.
3. Backend processes the input using AI logic and generates flashcards.
4. Flashcards are returned as structured JSON.
5. Frontend displays the cards interactively for easy studying.

---

## ✨ Features

- AI-powered flashcard generation
- Clean & minimal input interface
- Dynamic flashcard rendering
- Responsive layout for all devices
- API integration with full backend service
- Deployed live on Vercel

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- AI/LLM-powered text processing

---

## 🚀 Run Locally

```bash
# Clone the frontend repository
git clone https://github.com/ManikaKutiyal/flashcardify-frontend.git

# Navigate into the project
cd flashcardify-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
Local frontend will run at:
```
http://localhost:5173
```
🔌 Backend Connection

By default, the frontend connects to the deployed backend:
```
https://flashcardify-backend.vercel.app/
```

If running the backend locally, update the API base URL in source to:
```
http://localhost:5000
```
🔄 Application Flow

User enters text or topic

Frontend sends request to backend API

Backend generates flashcards using AI

Flashcards returned as JSON

Frontend renders them interactively

📁 Project Structure
```
src/
 ├── components/
 ├── App.jsx
 └── main.jsx
```
Author

Manika Kutiyal
