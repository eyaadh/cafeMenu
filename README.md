# Cafè Menu

Cafè Menu is a custom-built project for a close friend who runs a small cafè. The goal was to create a simple yet powerful application for managing an online menu, accepting customer orders, and streamlining internal workflows. Key features include:

- **Menu Management**: Easily manage the cafè's menu, allowing customers to view items online.
- **QR Code Integration**: Generate a QR code within the app that redirects users to the menu. This can be used on flyers or other promotional materials.
- **Online Ordering**: Customers can place orders directly from the application.
- **Order Management & Notifications**: The cafè staff can update the status of orders, with real-time notifications sent to a designated Telegram group.

The app is built with **Vue.js** and styled using **Tailwind CSS**, leveraging **Firebase** for authentication and Firestore for storing data. Environment variables store sensitive data such as API keys.

Here's an example of the `.env` file configuration:

```bash
VITE_LOCAL_API_KEY=YOUR_FIREBASE_API_KEY
VITE_LOCAL_AUTH_DOMAIN=your-app.firebaseapp.com  
VITE_LOCAL_PROJECT_ID=your-app-id  
VITE_LOCAL_STORAGE_BUCKET=your-app.appspot.com  
VITE_LOCAL_MESSAGE_SENDER_ID=your-sender-id  
VITE_LOCAL_APP_ID=your-app-id  
VITE_LOCAL_BOT_TOKEN=your-telegram-bot-token  
VITE_TELEGRAM_GROUP_ID=your-telegram-group-id
```

### Firestore Security Rules

The following security rules for Firestore are in place for this project, ensuring the appropriate permissions for reading, writing, and updating data in Firestore:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{docId} {
      // Allow anyone to read product documents
      allow read: if true;

      // Only authenticated users can create, update, or delete products
      allow create, update, delete: if request.auth != null;
    }
    match /categories/{docId} {
      // Allow anyone to read category documents
      allow read: if true;

      // Only authenticated users can create, update, or delete categories
      allow create, update, delete: if request.auth != null;
    }
    match /reviews/{docId} {
      // Allow anyone to read and create reviews
      allow read, create: if true;

      // Allow updates if "restricted" is false or if the user is authenticated
      allow update: if resource.data.restricted != true || request.auth != null;

      // Only authenticated users can delete reviews
      allow delete: if request.auth != null;
    }
    match /orders/{docId} {
      // Only authenticated users can read orders
      allow read: if request.auth != null;

      // Anyone can create an order
      allow create: if true;

      // Allow updates if 'restricted' is false, or only authenticated users can update when 'restricted' is true
      allow update: if resource.data.restricted == false || (request.auth != null && resource.data.restricted == true);

      // Only authenticated users can delete orders
      allow delete: if request.auth != null;
    }
    match /systemSettings/{docId} {
      // Only authenticated users can access system settings
      allow read, create, update, delete: if request.auth != null;
    }
  }
}
```

The application is hosted on **Cloudflare Pages**: [Live Demo](https://cafemenu.pages.dev/)

## Key Dependencies

Some standout libraries and tools used in this project:

- **Vue.js**: The progressive JavaScript framework.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Pinia**: A lightweight store management solution for Vue.js.
- **Firebase**: Used for authentication and Firestore to store orders.
- **Headless UI & Heroicons**: Modern, accessible components and icons.
- **Vuelidate**: Powerful form validation built specifically for Vue.
- **VueUse**: Essential Vue Composition Utilities.
- **QR Code**: Generates scannable QR codes for promotional use.
- **HTML2Canvas**: Captures screenshots of web elements.
- **Day.js**: A lightweight date manipulation library.

## Project Setup

To get started locally:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile, and Minify for Production

```sh
npm run build
```

---
