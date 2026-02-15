# MindForge - AI-Powered Mind Mapping Platform

![MindForge Logo](https://img.shields.io/badge/MindForge-AI%20Powered-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 Overview

**MindForge** is a next-generation collaborative mind mapping and brainstorming platform that combines real-time collaboration with AI-powered suggestions. Transform your ideas into visual masterpieces with stunning visualizations, intelligent content recommendations, and seamless team collaboration.

### ✨ Key Features

- **🧠 AI-Powered Suggestions** - Get intelligent content recommendations and auto-organization
- **👥 Real-Time Collaboration** - Work together with live cursors and instant updates
- **🎨 Beautiful Visualizations** - Stunning mind maps with customizable themes and colors
- **📱 Cross-Platform** - Works perfectly on desktop, tablet, and mobile
- **🔒 Secure & Private** - Enterprise-grade security with encrypted data
- **📊 Analytics Dashboard** - Track productivity and collaboration stats
- **🌐 Offline Support** - Progressive Web App with offline capabilities
- **🎯 Templates Library** - Pre-built templates for various use cases

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **HTML5 Canvas** - Interactive mind map rendering

### Backend
- **Next.js API Routes** - Serverless functions
- **Better-SQLite3** - Fast, embedded database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Security & Validation
- **Zod** - Schema validation
- **DOMPurify** - XSS protection
- **HTTP-only cookies** - Secure token storage

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd third
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and update the JWT secret for production:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started

1. **Create an Account**
   - Click "Get Started" on the landing page
   - Fill in your name, email, and password
   - Submit to create your account

2. **Create Your First Mind Map**
   - Click "+ New Mind Map" in your workspace
   - Enter a title for your mind map
   - Start adding nodes and connections

3. **Use AI Suggestions**
   - Select any node in your mind map
   - Click "🤖 AI Suggest" to get intelligent recommendations
   - Click on a suggestion to add it as a connected node

4. **Organize Your Ideas**
   - Drag nodes to reposition them
   - Add new nodes with the "+ Add Node" button
   - Delete nodes by selecting them and clicking "Delete"
   - Zoom in/out using the controls in the bottom-right

### Keyboard Shortcuts

- **Delete** - Delete selected node
- **Escape** - Deselect node
- **Mouse Drag** - Move nodes around the canvas

## 🏢 Use Cases

### Professional Teams
- Project planning and roadmapping
- Strategic brainstorming sessions
- Team workshops and retrospectives
- Process mapping and documentation

### Education
- Study planning and organization
- Research project structuring
- Learning pathway creation
- Lecture notes and summaries

### Personal Productivity
- Goal setting and tracking
- Decision making frameworks
- Creative writing outlines
- Life planning and organization

### Business
- Product roadmap development
- Marketing campaign planning
- Customer journey mapping
- SWOT analysis

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - Protection against XSS
- **Input Validation** - Zod schema validation
- **XSS Protection** - DOMPurify sanitization
- **SQL Injection Prevention** - Prepared statements
- **CSRF Protection** - SameSite cookie policy

## 📊 Database Schema

```sql
users
├── id (INTEGER PRIMARY KEY)
├── email (TEXT UNIQUE)
├── password_hash (TEXT)
├── name (TEXT)
├── created_at (DATETIME)
└── updated_at (DATETIME)

mind_maps
├── id (INTEGER PRIMARY KEY)
├── user_id (INTEGER FK)
├── title (TEXT)
├── description (TEXT)
├── data (TEXT JSON)
├── is_public (BOOLEAN)
├── created_at (DATETIME)
└── updated_at (DATETIME)

collaborators
├── id (INTEGER PRIMARY KEY)
├── mind_map_id (INTEGER FK)
├── user_id (INTEGER FK)
├── permission (TEXT)
└── created_at (DATETIME)

templates
├── id (INTEGER PRIMARY KEY)
├── name (TEXT)
├── description (TEXT)
├── category (TEXT)
├── data (TEXT JSON)
├── thumbnail_url (TEXT)
└── created_at (DATETIME)
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud
- Azure

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: {
    // Your custom primary colors
  },
  accent: {
    // Your custom accent colors
  },
}
```

### Adding New Templates

Add templates to the database by inserting into the `templates` table:

```sql
INSERT INTO templates (name, description, category, data) VALUES
('Template Name', 'Description', 'Category', '{"nodes":[],"connections":[]}');
```

## 📝 API Documentation

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout and clear session

### Mind Maps

- `GET /api/maps` - Get all mind maps for current user
- `POST /api/maps` - Create new mind map
- `GET /api/maps/[id]` - Get specific mind map
- `PUT /api/maps/[id]` - Update mind map
- `DELETE /api/maps/[id]` - Delete mind map

### AI

- `POST /api/ai/suggest` - Get AI suggestions for a node

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from emoji
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Support

For support, email support@mindforge.app or open an issue on GitHub.

---

**Made with ❤️ for creative minds everywhere**
