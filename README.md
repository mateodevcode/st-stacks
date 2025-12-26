# Stack Builder Pro 🚀

A modern web application for designing, saving, and managing technology stacks with a sleek hacker-themed UI.

## Features

- 🔐 **Authentication** - Secure login with NextAuth.js v5
- 📊 **Project Management** - Create, edit, duplicate, and delete projects
- 🎨 **Visual Stack Builder** - Interactive drag-and-drop interface
- 💾 **MongoDB Integration** - Persistent data storage
- 🎯 **Predefined Templates** - Quick start with 5 stack templates
- 💰 **Cost Calculator** - Automatic cost estimation
- 🌙 **Hacker Theme** - Neon green on black aesthetic
- ✨ **Smooth Animations** - Framer Motion powered transitions

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: MongoDB with Mongoose
- **UI/UX**: Framer Motion, DND Kit, Lucide Icons
- **Validation**: Zod
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd st-stacks
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables
   Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/stack-builder-pro
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

4. Create demo user (optional)

```bash
node scripts/createDemoUser.js
```

5. Run the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

- **Email**: admin@stack.dev
- **Password**: password123

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── builder/       # Stack builder page
│   ├── dashboard/     # Dashboard page
│   └── layout.js      # Root layout
├── components/        # Reusable components
├── lib/              # Utilities and helpers
└── models/           # Mongoose schemas
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Dashboard

- View all your projects in a grid layout
- Quick actions: Edit, Duplicate, Delete
- Browse predefined stack templates
- Create new projects instantly

### Stack Builder

- Toggle layers (Frontend, Backend, API, Database, etc.)
- Select technologies from curated lists
- Drag and drop to reorder (coming soon)
- View JSON configuration
- Calculate total costs
- Save or discard changes

### Predefined Templates

1. **Landing Page** - Static site with Astro
2. **Full-Stack App** - Next.js with MongoDB
3. **Real-Time App** - Socket.io integration
4. **E-Commerce** - Complete online store
5. **PWA** - Progressive Web App with Firebase

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.

## Author

Created with ❤️ by the Stack Builder Pro team

---

**Happy Stack Building! 🎯**
