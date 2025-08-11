# Form Builder

A React-based dynamic form builder app that lets you create comprehension, cloze, and categorize type questions with drag-and-drop support. Save your form and preview it!

## Features

- Add multiple types of questions:
  - Comprehension questions with options
  - Cloze (fill-in-the-blank) questions
  - Categorize questions with drag-and-drop items
- Drag and drop items into categories
- Save form data to backend API
- Preview form before saving

## Tech Stack

- React
- Axios (for HTTP requests)
- React Router
- @hello-pangea/dnd (drag and drop)
- Tailwind CSS (styling)

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend API running at `http://localhost:5000/api/forms` (or update the URL in the code)

### Installation

```bash
git clone https://github.com/your-username/form-builder.git
cd form-builder
npm install
npm run dev   # or npm start depending on your setup
