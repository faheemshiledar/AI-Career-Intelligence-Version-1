# AI Career Intelligence Engine

This application evaluates Computer Science and Engineering students and early professionals in the Indian job market using Gemini AI.

## 🚀 How to Deploy for Free (100% Working)

This app is a fully functional React SPA built with Vite. It is pre-configured to be deployed seamlessly to either **Vercel** or **Netlify** completely free of cost.

### Prerequisites
1. A GitHub account.
2. A free [Google AI Studio](https://aistudio.google.com/) account to get your `GEMINI_API_KEY`.

---

### Option 1: Deploy to Vercel (Recommended)

1. Push this code to a new repository on your GitHub account.
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **Add New** > **Project**.
4. Import your GitHub repository.
5. In the "Configure Project" section, open the **Environment Variables** dropdown.
6. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** *(Paste your Gemini API key here)*
7. Click **Deploy**. Vercel will automatically build and host your app. 
*(Note: The `vercel.json` file is already included to handle routing perfectly).*

---

### Option 2: Deploy to Netlify

1. Push this code to a new repository on your GitHub account.
2. Go to [Netlify](https://www.netlify.com/) and sign in with GitHub.
3. Click **Add new site** > **Import an existing project**.
4. Select your GitHub repository.
5. In the "Site settings" step, click **Show advanced** and then **New variable**.
6. Add a new variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *(Paste your Gemini API key here)*
7. Click **Deploy site**. Netlify will automatically build and host your app.
*(Note: The `netlify.toml` file is already included to handle routing perfectly).*

---

## ⚠️ Important Note About the API Key
Because this is a Client-Side Application (SPA), the `GEMINI_API_KEY` is injected into the frontend at build time. For a personal portfolio or free tool, this is perfectly fine. If you ever plan to monetize this or expect massive public traffic, you would eventually move the API call to an edge function or backend server to hide the key from the browser network tab.

## Features Included
- **Resume Parsing:** Upload a resume image and AI extracts the text automatically.
- **Strict Evaluation:** Generates a FAANG-level reality check, CTC prediction, and skill breakdown.
- **Actionable Roadmap:** A 6-month plan including specific interview prep tips.
- **AI Advisor Chat:** A context-aware chatbot that answers career questions based on your evaluation.
