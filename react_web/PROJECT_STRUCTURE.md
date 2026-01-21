# React Web Application - Complete Structure

## Pages Created (Matching Original Website)

1. **Home** (`/`) - Landing page with Hero, About section, Products, and Contact
2. **About Us** (`/about`) - The Nivorgo Legacy page
3. **Why Ayurveda** (`/why-ayurveda`) - Wisdom of the Ages page  
4. **Profile** (`/profile`) - User profile with order history and address management
5. **Admin Portal** (`/admin-portal`) - Admin dashboard to manage orders

## Navigation Structure

The navbar includes:
- **About** → `/about` 
- **Products** → `/#products` (scroll to products section on home)
- **Why Ayurveda** → `/why-ayurveda`
- **Contact** → `/#contact` (scroll to footer contact form)

## Backend Connectivity

All pages connect to the backend API at `http://localhost:5000`:

### Authentication Endpoints:
- POST `/register` - User registration with OTP
- POST `/verify-otp` - Email verification
- POST `/login` - User login

### Product Endpoints:
- GET `/products` - Fetch all products

### Order Endpoints:
- POST `/place-order` - Place a new order
- GET `/api/user/orders/:email` - Get user's order history
- GET `/api/admin/orders` - Get all orders (admin)
- PATCH `/api/admin/orders/:id` - Update order status

### Profile Endpoints:
- PUT `/api/user/update` - Update user address

### Contact Endpoint:
- POST `/contact` - Send contact form message

## Styling

All styling from the original `style.css` has been preserved in `index.css`:
- Premium Ayurvedic theme
- Responsive design
- Animations and transitions
- Custom navbar with scroll effect
 - Glassmorphism and premium aesthetics

## How to Run

### Backend (Terminal 1):
```bash
cd d:\nivorgo\backend
npm start
```

### Frontend (Terminal 2):
```bash
cd d:\nivorgo\react_web
npm run dev
```

Open the provided Vite URL (usually `http://localhost:5173`)

## Features Implemented

✅ User Authentication (Login/Signup with OTP)
✅ Product Browsing with Quick View
✅ Shopping Cart functionality
✅ Checkout with address collection
✅ Order History tracking
✅ Profile Management with address editing
✅ Admin Portal for order management
✅ Contact Form
✅ Full routing between pages
✅ Responsive design
✅ All original styling preserved
