# **Lost @ Yale**

_Lost @ Yale_ is a simple platform for Yale students to report lost and found items on campus. Users can log in, post items, browse the board, and contact each other when items are found.

This is the **MVP** version of the application.

---

## **Development Setup**

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd lost-at-yale
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Create `.env.local`**

You must manually create a `.env.local` file in the project root.

This file stores your **Firebase + app environment variables**.
It is not shared publicly.

Example structure (values are placeholders):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **4. Run the App (Important)**

The app **must run on port 3000** during development.

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

If another process is using port 3000, **stop it first** — the app relies on this exact port during OAuth login.

---

## **Authentication**

The app supports **Google Sign-In**.

- At MVP stage, **any Google account** can log in.
- Later, we will restrict login to **@yale.edu** email addresses only.

---

## **Features**

### **1. Create a Post (Lost or Found)**

Users can submit a post describing an item, including:

- Whether it is **Lost** or **Found**
- **Title and description**
- **Location and date**
- **Multiple images** (photos are uploaded and displayed on the card)

### **2. Lost/Found Board**

All active posts appear on the main board:

- **Lost items** are highlighted in red
- **Found items** are highlighted in green
- Posts update **in real time** when status changes

### **3. Contact the User Who Made a Given Post**

Every post includes a **contact option**:

- If you found something someone lost → you can email the original poster
- If someone found what _you_ lost → you can claim it
- Future feature: In-app messaging
