# 🖥️ Zenith Dash API | Premium MERN Backend Service

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![Express.js](https://img.shields.io/badge/Express.js-v5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Hosting-blue)
![Passport](https://img.shields.io/badge/Passport.js-Google_OAuth-yellow)

**Zenith Dash Backend** is a robust and scalable RESTful API built to power the Zenith Dash ecosystem. It features a modular **MVC architecture**, secure authentication layers, and real-time analytics processing to deliver a seamless management experience.

---

## ✨ Key Features

- **🔐 Dual-Layer Authentication**: Secure access using **JWT** (JSON Web Tokens) and **Google OAuth 2.0** integration via Passport.js.
- **☁️ Cloud Asset Hosting**: Automated profile image management using **Cloudinary** with pre-configured image transformations.
- **📊 Business Intelligence Logic**: Custom algorithms to calculate monthly user growth, active trends, and status distributions.
- **🛡️ Advanced Security**: Integrated **Bcryptjs** for password hashing, protected routes via custom middlewares, and centralized error handling.
- **👤 Multi-Tenant Logic**: Intelligent tracking of user ownership (`createdBy`), allowing specific administrators to manage their own staff/members.

---

## 🛠️ Tech Stack

### Core Runtime & Framework

- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js (v5.x)**: Fast, unopinionated, minimalist web framework.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.

### Security & Storage

- **JWT & Passport**: Standardized stateless authentication.
- **Cloudinary**: Cloud-based image and video management.
- **Multer**: Middleware for handling `multipart/form-data` (File Uploads).

---

## 🔑 Environment Variables

To run this service, create a `.env` file in the root of the `/server` directory and configure the following:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=your_frontend_url

# Database
MONGO_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (Image Hosting)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

```

---

## 📡 API Endpoints

### Auth & Membership

| Method | Endpoint                 | Description          | Access  |
| :----- | :----------------------- | :------------------- | :------ |
| `POST` | `/api/users/login`       | Admin login          | Public  |
| `POST` | `/api/users/signup`      | Self-registration    | Public  |
| `POST` | `/api/users/register`    | Add new member       | Private |
| `GET`  | `/api/users/auth/google` | Trigger Google login | Public  |

### Dashboard & Users

| Method   | Endpoint           | Description               | Access  |
| :------- | :----------------- | :------------------------ | :------ |
| `GET`    | `/api/users/stats` | Growth & trend stats      | Private |
| `GET`    | `/api/users`       | Fetch all managed members | Private |
| `PUT`    | `/api/users/:id`   | Update member & avatar    | Private |
| `DELETE` | `/api/users/:id`   | Delete member             | Private |

---

## 📂 Project Structure

```txt
server/
├── config/             # DB, Cloudinary, and Passport strategies
├── controllers/        # Request handlers & Business logic
├── middleware/         # Auth protection & Global error handler
├── models/             # Mongoose Schemas (User Model)
├── routes/             # API Endpoint definitions
├── .env                # Environment configuration
└── server.js           # Main entry point
```

## ⚙️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/Saktra007/Admin_Dashboard_UI.git
```

2. Navigate to the project folder

```bash
cd server

```

3. Install dependencies

```bash
npm install
```

4. Run in Development (Nodemon)

```bash
npm run dev
```

5. Start Production Server

```bash
npm start
```

---

## 👨‍💻 Developed By

### Saktra C.

Professional Frontend & Backend Developer based in Phnom Penh.
Specializing in MERN Stack and Clean Code Architecture.

---

> [!IMPORTANT]
> The backend service is optimized for performance and follows strict RESTful principles, ensuring it can easily scale as the application grows.

```

```
"# zenith-backend" 
