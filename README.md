# Builder6 

A powerful low-code/no-code app builder designed to streamline the creation of enterprise applications. Built with NestJS, Liquid templates, and integrated with advanced AI capabilities for generating UI and data models.

## 🚀 Key Features

*   **Multi-Tenant Organization Management**: Seamlessly manage multiple organizations and team members.
*   **AI-Powered Generation**:
    *   **UI Generation**: Generate responsive HTML/Tailwind CSS pages from natural language prompts using models like Gemini 3 Pro and GPT-4o.
    *   **Schema Generation**: Automatically define Steedos Object schemas based on descriptions.
*   **Project & Object Management**:
    *   Create and organize projects within organizations.
    *   Define complex data models using YAML with support for various field types (Text, Number, Logic, Relationships, Formulas, etc.).
*   **Liquid Template Engine**: Fast server-side rendering using LiquidJS.
*   **Modern Auth**: Secure authentication and session management powered by Better-Auth.

## 🛠 Tech Stack

*   **Backend Framework**: [NestJS](https://nestjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/)
*   **Template Engine**: [LiquidJS](https://liquidjs.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration**: OpenAI SDK (compatible with Google Gemini, OpenAI GPT models)

## 📂 Project Structure

```
├── public/             # Static assets (JS, CSS)
├── src/
│   ├── ai/             # AI service for generating code & objects
│   ├── auth/           # Authentication module (Better-Auth)
│   ├── database/       # MongoDB connection providers
│   ├── objects/        # Object schema management & generation
│   ├── organizations/  # Organization & tenant logic
│   ├── pages/          # Page management & rendering
│   ├── projects/       # Project container logic
│   ├── app.module.ts   # Root application module
│   └── main.ts         # Entry point
├── views/              # Liquid templates for UI
└── STEEDOS_FIELDS.md   # Reference for supported field types
```

## ⚡️ Getting Started

### Prerequisites

*   Node.js (v18+)
*   MongoDB (Running instance)
*   Yarn or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/builder6app/interfaces.builder6.com.git
    cd interfaces.builder6.com
    ```

2.  Install dependencies:
    ```bash
    yarn install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory and add:
    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/builder6

    # Authentication
    BETTER_AUTH_SECRET=your_secret_key
    BETTER_AUTH_URL=http://localhost:3000

    # AI Configuration (Optional)
    OPENAI_API_KEY=your_api_key
    OPENAI_BASE_URL=https://api.openai.com/v1 # or other compatible endpoint
    OPENAI_MODEL_DEFAULT=google/gemini-3-pro-preview
    ```

### Running the Application

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod
```

Access the application at `http://localhost:3000`.

## 🤖 AI Usage

The application includes an AI helper for generating content.
*   **Page Generator**: Describe specific UI requirements (e.g., "Create a dashboard with a sidebar and data table") to generate HTML.
*   **Object Generator**: Describe your data needs to generate valid Steedos YAML schemas (refer to `STEEDOS_FIELDS.md` for supported types).
