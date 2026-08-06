# 🛡️ Digital Identity Vault

A premium, secure digital identity wallet application that allows users to upload, verify, manage, and share sensitive identity documents (like passports, driver's licenses, and IDs) with state-of-the-art security controls. The project features a cross-platform **React Native (Expo)** mobile application and a robust **Node.js Express** backend server.

---

## 🌟 Key Features

### 1. Advanced Cryptography & File Security
* **In-Memory Encryption (AES-256-CBC):** Uploaded documents are encrypted directly in server memory before being written to disk, preventing unencrypted files from ever touching the storage volume.
* **Integrity Hashing (SHA-256):** Computes unique cryptographic checksums for every uploaded document to detect tampering.
* **Secure Decryption on Download:** Files are decrypted on-the-fly when authorized users download them, preserving data privacy.

### 2. Dual-Layer & Biometric Authentication
* **Biometric Unlock (FaceID / Fingerprint):** Integrated with `expo-local-authentication` to restrict app access via device biometrics.
* **Email OTP (One-Time Password):** Optional Two-Factor Authentication (2FA) and mandatory email validation using generated OTP codes sent via Nodemailer.
* **Gamified Security Score:** The home dashboard computes a real-time security health score (e.g., +40% for Biometrics, +40% for 2FA, +20% baseline) to encourage users to secure their account.

### 3. Automated OCR Verification (Tesseract.js)
* **Instant Verification:** Parses uploaded ID image buffers using an embedded **Tesseract.js** OCR engine.
* **Smart Match:** Automatically verifies the identity document if the cardholder's name matches the registered profile name.
* **Manual Fallback:** Unmatched or blurry documents are securely flagged as `pending` for manual review by administrators/verifiers.

### 4. Secure & Expirable Share Links
* **Cryptographic Access Tokens:** Generates unique, secure 32-byte sharing tokens.
* **Validity Windows:** Users can set expiration days for links, automatically locking access once expired.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Mobile App)
* **Framework:** React Native with Expo (SDK 51)
* **Navigation:** React Navigation (Stack Navigator)
* **Secure Storage:** `expo-secure-store` for client-side JWT token and biometric preference storage
* **Icons & UI:** Lucide React Native, Custom Design Tokens, and Linear Gradients

### Backend (API Server)
* **Framework:** Node.js, Express.js
* **Database & ORM:** Sequelize ORM with SQLite (embedded file-based database)
* **Security Middleware:** Helmet, CORS, JWT-based Route Protection, and Role-Based Access Control (RBAC)
* **File Uploads:** Multer (Memory Storage configuration)

---

## 📂 Directory Structure

```text
digital-identity-vault/
├── backend/
│   ├── config/             # DB and Sequelize connection configuration
│   ├── controllers/        # App controllers (Auth, Documents, Sharing, Notifications)
│   ├── middleware/         # Auth verification and RBAC middleware
│   ├── models/             # Sequelize schemas (User, Document, DocumentShare, Notification)
│   ├── routes/             # REST API endpoint routes
│   ├── utils/              # Security helper functions (AES encryption, SHA hashing)
│   ├── uploads/            # Encrypted stored files (.enc)
│   ├── index.js            # Express server entrypoint
│   └── package.json
└── frontend/
    ├── components/         # Reusable UI component elements
    ├── constants/          # Design tokens (Colors, Spacing, Shadows, Themes)
    ├── context/            # Global contexts (AuthContext, ThemeContext)
    ├── screens/            # Application views (Login, Home, Vault, Upload, Settings)
    ├── services/           # Axios API interceptor configurations
    ├── App.js              # Application entrypoint
    └── package.json
```

---

## 🚀 Local Development Setup

### Prerequisites
* Install [Node.js](https://nodejs.org) (v18 or higher recommended)
* Install **Expo Go** on your mobile device (iOS/Android)

---

### 1. Backend Configuration & Launch

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
   # Add your SMTP/Email settings below to test email OTP
   # SMTP_HOST=smtp.gmail.com
   # EMAIL_USER=your_email@gmail.com
   # EMAIL_PASS=your_email_password
   ```
4. Launch the server in development mode:
   ```bash
   npm run dev
   ```
   *The server runs locally at `http://localhost:5000`.*

---

### 2. Frontend Configuration & Launch

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your API base URL:
   Open `services/api.js` and set the `BASE_URL` to your computer's local IP address (e.g. `http://192.168.1.15:5000`) so that your physical phone can connect to the server running on your computer.
4. Start the Expo builder:
   ```bash
   npx expo start
   ```
5. Open **Expo Go** on your mobile device, scan the QR code displayed in the terminal, and start testing!

---

## 🌐 Production Deployment Guide

### Deploying the Backend (Render/Railway)

1. Push your project code to a private GitHub repository.
2. Sign up on [Render](https://render.com).
3. Create a new **Web Service** and link your repository.
4. Set the Build Command to `npm install` and Start Command to `npm start`.
5. Under Environment variables, add your `JWT_SECRET` and `PORT`.
6. Use the provided live URL (e.g., `https://my-identity-vault-api.onrender.com`) to update your frontend `services/api.js`.

### Building the Mobile Standalone App (.APK)

1. Sign up on [Expo.dev](https://expo.dev) and log in locally in your terminal:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Initialize build configuration:
   ```bash
   eas build:configure
   ```
3. Compile the installable APK file for Android:
   ```bash
   eas build -p android --profile preview
   ```
4. Once completed, scan the QR code to install the standalone application onto your mobile device!

---

## 🔮 Future Scope & Improvements

* **Zero-Knowledge Architecture:** Moving encryption to the client-side so that the server holds zero access to raw decryption keys.
* **Pre-signed Cloud Uploads:** Uploading directly to Amazon S3 using pre-signed URLs to reduce Express server load.
* **Offline Synchronization:** Utilizing local databases (such as SQLite or WatermelonDB) to cache metadata locally for offline access.
* **Push Notifications:** Integrating Expo Push Notifications to alert users about document shares and verification statuses.
