# SCEC Allahabad — Modern Website

A full-stack web application for SCEC Allahabad.
Built with **React 18 + Vite**, **Node.js + Express**, and **MongoDB Atlas**.

---

## 🗂 Project Structure

```
scec-website/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Node.js + Express REST API
└── package.json     # Root scripts (runs both together)
```

---

## ⚡ Quick Start

### 1. Prerequisites

Make sure you have these installed:
- **Node.js** v18 or higher → https://nodejs.org
- **npm** v9+
- A **MongoDB Atlas** account (free) → https://www.mongodb.com/atlas
- A **Cloudinary** account (free) → https://cloudinary.com
- A **Gmail** account (for sending enquiry emails)

---

### 2. Clone and Install

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

---

### 3. Configure Environment Variables

Copy the example `.env` file and fill in your values:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
# 1. Go to https://cloud.mongodb.com
# 2. Create a free cluster
# 3. Click Connect → Drivers → copy the connection string
# 4. Replace <username> and <password>
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/scecdb

# JWT — use any long random string (min 32 chars)
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary
# 1. Sign up at https://cloudinary.com (free)
# 2. Go to Dashboard → copy Cloud Name, API Key, API Secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (for enquiry email notifications)
# 1. Enable 2-Factor Authentication on your Gmail account
# 2. Go to Google Account → Security → App Passwords
# 3. Create an App Password for "Mail"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx   # 16-char app password (no spaces)
EMAIL_FROM="SCEC Allahabad <noreply@scecallahabad.com>"
ADMIN_EMAIL=admin@scecallahabad.com
```

---

### 4. Seed the Database

This creates the default superadmin user and sample content:

```bash
npm run seed
```

Output will show:
```
✅ Superadmin created: admin@scecallahabad.com / Admin@12345
⚠️  Please log in and change this password immediately.
✅ Site settings configured
✅ Sample notices created (4)
✅ Sample courses created (9)
✅ Sample universities created (4)
✅ Sample centers created (1)
🎉 Seeding complete!
```

---

### 5. Run Development Server

```bash
npm run dev
```

This starts both servers simultaneously:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000/api/health

---

### 6. Admin Panel

Go to **http://localhost:5173/admin/login**

Default credentials (change after first login!):
- **Email:** `admin@scecallahabad.com`
- **Password:** `Admin@12345`

---

## 🌐 All Pages

### Public Website
| Page | URL |
|------|-----|
| Home | `/` |
| About Us | `/about` |
| Courses | `/courses` |
| Universities | `/universities` |
| Photo Gallery | `/gallery` |
| Centers | `/centers` |
| Enquiry Form | `/enquiry` |
| Contact | `/contact` |
| Verification | `/verification` |

### Admin Panel
| Page | URL |
|------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Notices | `/admin/notices` |
| Hero Slides | `/admin/slides` |
| Courses | `/admin/courses` |
| Universities | `/admin/universities` |
| Centers | `/admin/centers` |
| Gallery | `/admin/gallery` |
| Enquiries | `/admin/enquiries` |
| Users | `/admin/users` |
| Settings | `/admin/settings` |

---

## 🚀 Deployment

### Frontend → Vercel (Free)

```bash
# Build the client
npm run build

# Deploy client/ folder to Vercel
# 1. Go to https://vercel.com → New Project
# 2. Import your GitHub repo
# 3. Set Root Directory to: client
# 4. Build Command: npm run build
# 5. Output Directory: dist
```

### Backend → Render.com (Free)

```bash
# 1. Go to https://render.com → New Web Service
# 2. Connect your GitHub repo
# 3. Set Root Directory to: server
# 4. Build Command: npm install
# 5. Start Command: node server.js
# 6. Add all environment variables from .env
# 7. Set NODE_ENV=production
```

After deploying the backend:
- Update `CLIENT_URL` in Render env vars to your Vercel URL
- Update the Vite proxy in `client/vite.config.js` to point to your Render URL for production

---

## 📋 API Reference

### Public Endpoints (no auth required)
```
GET  /api/health              → Health check
GET  /api/notices             → Active notices
GET  /api/slides              → Active hero slides
GET  /api/courses             → Courses (filter: ?category=Computer&search=bca)
GET  /api/universities        → Universities
GET  /api/centers             → Centers
GET  /api/gallery             → Gallery (filter: ?category=Events)
GET  /api/gallery/categories  → Distinct gallery categories
GET  /api/settings            → Site settings
POST /api/enquiries           → Submit enquiry form
```

### Admin Endpoints (JWT required)
```
POST /api/auth/login          → Login
POST /api/auth/logout         → Logout
GET  /api/auth/me             → Current user

GET/POST/PUT/DELETE  /api/notices/:id?
GET/POST/PUT/DELETE  /api/slides/:id?
PUT  /api/slides/reorder      → Drag-drop reorder
GET/POST/PUT/DELETE  /api/courses/:id?
GET/POST/PUT/DELETE  /api/universities/:id?
GET/POST/PUT/DELETE  /api/centers/:id?
GET/POST/PUT/DELETE  /api/gallery/:id?
POST /api/gallery/bulk-delete → Bulk delete images

GET/PUT/DELETE       /api/enquiries/:id?
GET  /api/enquiries/export/csv → Download CSV

GET/POST/PUT/DELETE  /api/users/:id?      (superadmin only)
PUT  /api/users/:id/reset-password        (superadmin only)
GET/PUT              /api/settings
```

---

## 🔒 Security Notes

- JWT tokens stored in **httpOnly cookies** (XSS-safe)
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- Login rate-limited to **10 attempts per 15 minutes**
- **Helmet.js** sets HTTP security headers
- **CORS** restricted to `CLIENT_URL` only
- File uploads restricted to **images only, max 5MB**
- Admin routes gated behind JWT + role middleware
- Mongoose prevents MongoDB injection

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Routing | React Router v6 |
| State | Zustand |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JWT, bcryptjs |
| File Storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Security | Helmet, cors, express-rate-limit |

---

## 📁 Adding New Content Types

To add a new content type (e.g. "Events"):

1. **Create model** → `server/models/Event.js`
2. **Create controller** → `server/controllers/events.controller.js` (use `crudFactory.js`)
3. **Create routes** → `server/routes/events.routes.js`
4. **Register in server.js** → `app.use('/api/events', eventRoutes)`
5. **Add service** → `client/src/services/contentService.js`
6. **Create public page** → `client/src/pages/public/Events.jsx`
7. **Create admin page** → `client/src/pages/admin/ManageEvents.jsx`
8. **Add route** → `client/src/App.jsx`
9. **Add to sidebar** → `client/src/components/admin/AdminSidebar.jsx`

---

*Built for SCEC Allahabad — SCEC Allahabad*
