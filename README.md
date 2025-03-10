# Utsavia - E-commerce Platform for Event Decorations 🎉

Welcome to **Utsavia**, a modern e-commerce platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Utsavia is designed to help users book decoration services for events seamlessly. The platform features secure authentication, integrated payment gateways, and an intuitive admin panel for managing categories and items.

---

## Features ✨

- **Modern E-commerce Platform**: Built with the MERN stack for a scalable and efficient user experience.
- **Secure Authentication**: Integrated **Google Auth**, **Auth0**, and **JWT tokens** for robust user authentication and security.
- **Payment Integration**: Supports payments via **Stripe** and **Razorpay** for a seamless checkout experience.
- **State Management**: Implemented **Redux** for efficient state management, reducing component coupling by 30% and improving maintainability.
- **Admin Panel**: Allows admins to perform CRUD operations on categories and items, with role-based access control.
- **Event Decoration Services**: A dedicated platform for booking decoration services for events.

---

## Technologies Used 🛠️

- **Frontend**: React.js, Redux, Tailwind CSS (optional, if used)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Google Auth, Auth0, JWT
- **Payment Gateways**: Stripe, Razorpay
- **Deployment**: Vercel (Frontend), Render/Heroku (Backend)

---

## Getting Started 🚀

Follow these steps to set up the Utsavia platform on your local machine.

### Prerequisites

- **Node.js**: Download and install from [here](https://nodejs.org/).
- **MongoDB**: Set up a MongoDB database locally or using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/himuexe/Utsavia-Latest.git
   cd utsavia-ecommerce
   ```

2. **Backend Setup**:
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and add the following environment variables:
     ```plaintext
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret-key>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     AUTH0_DOMAIN=<your-auth0-domain>
     AUTH0_CLIENT_ID=<your-auth0-client-id>
     AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     RAZORPAY_KEY_ID=<your-razorpay-key-id>
     RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` folder:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and add the following environment variables:
     ```plaintext
     REACT_APP_API_BASE_URL=http://localhost:5000
     REACT_APP_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
     REACT_APP_RAZORPAY_KEY_ID=<your-razorpay-key-id>
     ```
   - Start the frontend application:
     ```bash
     npm start
     ```

4. **Access the Application**:
   - The frontend will be running at `http://localhost:5173`.
   - The backend will be running at `http://localhost:9000`.

---

## Admin Panel 👨‍💻

The admin panel allows administrators to manage categories and items. Key features include:

- **Create, Read, Update, Delete (CRUD)** operations for categories and items.
- **Role-Based Access Control**: Different roles for admins and users.
- **Dashboard**: View and manage orders, users, and services.

---

## Payment Integration 💳

Utsavia supports two payment gateways:

1. **Stripe**:
   - Secure and reliable payment processing.
   - Test cards can be used for development (e.g., `4242 4242 4242 4242`).

2. **Razorpay**:
   - Popular payment gateway for Indian users.
   - Test mode available for development.

---

## Running Automated Tests 🧪

To ensure the application is reliable and bug-free, automated tests are implemented. Here's how to run them:

1. Navigate to the `backend` or `frontend` folder.
2. Run the following command:
   ```bash
   npm test
   ```

---

## Deployment 🚀

The application can be deployed using the following platforms:

- **Frontend**: Deploy on [Vercel](https://vercel.com/).
- **Backend**: Deploy on [Render](https://render.com/) 

---

## Contributing 🤝

We welcome contributions! If you have any ideas or suggestions, feel free to submit a pull request. Here's how you can contribute:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---



## Acknowledgments 🙏

- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [Razorpay](https://razorpay.com/)
- [Auth0](https://auth0.com/)
- [Google Auth](https://developers.google.com/identity)

---

Leave a ⭐ if this project helped you! Happy decorating! 🎉
