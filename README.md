# AI Code Studio

An AI-powered code editor with live preview, built with GitHub authentication and Supabase backend.

## Features

- **GitHub Authentication**: Sign in with your GitHub account
- **AI Code Generation**: Generate code from natural language prompts
- **Live Code Editor**: Write and edit code with syntax highlighting (powered by CodeMirror)
- **Live Preview**: See your code running in real-time
- **Session Management**: Save and load your coding sessions
- **Multiple Templates**: Built-in templates for common projects (todo apps, calculators, forms, etc.)

## Setup

### Prerequisites

- GitHub account for authentication
- Supabase project (already configured)

### GitHub OAuth Configuration

To enable GitHub login, you need to configure GitHub OAuth in your Supabase project:

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: AI Code Studio
   - **Homepage URL**: Your application URL
   - **Authorization callback URL**: `https://lgpeubbumvyebwkrwlor.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Go to your Supabase dashboard: https://supabase.com/dashboard/project/lgpeubbumvyebwkrwlor/auth/providers
7. Enable GitHub provider and paste your Client ID and Client Secret
8. Save the configuration

### Installation

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## Usage

1. Open the application and click "Continue with GitHub"
2. Authorize the application with your GitHub account
3. Enter a prompt describing what you want to build (e.g., "Create a todo list app")
4. Click "Generate Code" to let AI create the code for you
5. Edit the code in the editor - the preview updates automatically
6. Click "Save" to store your session
7. Create new sessions or load previous ones from the sidebar

## Supported Templates

The AI can generate code for:
- Todo lists and task managers
- Calculators
- Contact forms
- Profile cards
- Timers and countdowns
- Image galleries
- Quiz applications
- Charts and dashboards
- And more...

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Code Editor**: CodeMirror
- **Backend**: Supabase (PostgreSQL database, Edge Functions)
- **Authentication**: GitHub OAuth via Supabase Auth
- **Build Tool**: Vite

## Project Structure

- `ai-coder.html` - Main application interface
- `app.js` - Frontend application logic
- `styles.css` - Application styling
- `supabase/functions/generate-code/` - Edge function for AI code generation
- Database tables:
  - `profiles` - User profiles linked to GitHub accounts
  - `code_sessions` - Saved coding sessions

## Note

This application uses template-based code generation. For production use with actual AI models (like OpenAI GPT), you would need to:
1. Add an API key for your chosen AI service
2. Update the Edge Function to call the AI API
3. Configure the secret in Supabase
