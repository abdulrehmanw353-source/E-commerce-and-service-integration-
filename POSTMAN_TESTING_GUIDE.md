# 🚀 Postman API Testing Guide for Frontend Developers

Welcome! This guide is designed to help frontend developers easily test the backend APIs using Postman. You don't need to be a backend expert to use this guide.

---

## 💡 Part 1: Postman Superpowers (Make testing effortless!)

Postman has features that save you from copy-pasting URLs and Tokens hundreds of times. Let's set them up first.

### 1. Environments & Variables
Instead of typing `http://localhost:3000/api/v1` for every request, we use **Variables**.

**How to set it up:**
1. Open Postman. On the left sidebar, click **Environments**.
2. Click the **+** (Create new Environment) and name it `Local Backend`.
3. Add a new variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000/api/v1`
   - **Current Value**: `http://localhost:3000/api/v1`
4. Add another variable:
   - **Variable**: `accessToken`
   - *(Leave the values empty for now)*
5. Click **Save**.
6. In the **top-right corner** of Postman, click the dropdown that says "No Environment" and select `Local Backend`.

Now, you can use `{{base_url}}` in your request URLs!

### 2. The Magic of Scripts (Automating Tokens)
When you log in, the server gives you an `accessToken`. You need this token to access protected routes (like your profile or cart). Instead of manually copying it, let Postman do it for you!

**How to set it up:**
When you create the **Customer Login** or **Admin Login** request, go to the **Tests** (or **Scripts > Post-response**) tab of that request and paste this code:

```javascript
// This checks if the response is successful and has a token
const response = pm.response.json();
if (response.success && response.data.accessToken) {
    // This saves the token to your Postman Environment
    pm.environment.set("accessToken", response.data.accessToken);
    console.log("Token saved automatically!");
}
```
Now, whenever you click "Send" on the login route, Postman updates your token automatically!

### 3. Setting Up Authorization
For any route that requires `🔒 JWT` or `🔒 Admin`:
1. Go to the request's **Authorization** tab.
2. Select **Bearer Token** from the "Type" dropdown.
3. In the Token box, type: `{{accessToken}}`

---

## 🚦 Part 2: Endpoint Test Data

Here are the endpoints you need to test, organized by feature.

> **Note on Body Data:** For POST and PATCH requests, go to the **Body** tab, select **raw**, and choose **JSON** from the dropdown on the right. Paste the provided JSON there.

### 🔐 1. Authentication

**1.1 Register Customer**
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/customer/register`
- **Auth:** None
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNo": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }
}
```

**1.2 Login Customer** (Remember to add the Magic Script here!)
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/customer/login`
- **Auth:** None
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**1.3 Login Admin** (Remember to add the Magic Script here!)
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/admin/login`
- **Auth:** None
- **Body:** *(Use the credentials from the seed script)*
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**1.4 Logout** (Works for both Customer/Admin depending on route)
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/customer/logout` OR `{{base_url}}/auth/admin/logout`
- **Auth:** `{{accessToken}}`
- **Body:** None

---

### 👤 2. Customer Profile

**2.1 Get My Profile**
- **Method:** `GET`
- **URL:** `{{base_url}}/customer/profile`
- **Auth:** `{{accessToken}}`

**2.2 Update Profile**
- **Method:** `PATCH`
- **URL:** `{{base_url}}/customer/profile`
- **Auth:** `{{accessToken}}`
- **Body:**
```json
{
  "firstName": "John Updated",
  "phoneNo": "9876543210"
}
```

---

### 📦 3. Products (Public)

**3.1 Get All Products** (Test search, filter, paginate)
- **Method:** `GET`
- **URL:** `{{base_url}}/products?page=1&limit=10&search=laptop`
- **Auth:** None

**3.2 Get Single Product**
- **Method:** `GET`
- **URL:** `{{base_url}}/products/<paste_product_id_here>`
- **Auth:** None

---

### 🛒 4. Cart

**4.1 Add to Cart**
- **Method:** `POST`
- **URL:** `{{base_url}}/cart`
- **Auth:** `{{accessToken}}`
- **Body:**
```json
{
  "productId": "<paste_product_id_here>",
  "quantity": 2
}
```

**4.2 View Cart**
- **Method:** `GET`
- **URL:** `{{base_url}}/cart`
- **Auth:** `{{accessToken}}`

**4.3 Clear Cart**
- **Method:** `DELETE`
- **URL:** `{{base_url}}/cart/clear`
- **Auth:** `{{accessToken}}`

---

### 💳 5. Orders (Customer)

**5.1 Checkout / Create Order**
- **Method:** `POST`
- **URL:** `{{base_url}}/orders`
- **Auth:** `{{accessToken}}`
- **Body:** None *(It automatically converts your cart to an order!)*

**5.2 My Orders**
- **Method:** `GET`
- **URL:** `{{base_url}}/orders`
- **Auth:** `{{accessToken}}`

---

### 🔧 6. Service Bookings (Customer)

**6.1 Create Booking (Form Data)**
*Important: Because this accepts images, you cannot use raw JSON.*
1. Go to **Body** tab.
2. Select **form-data**.
3. Enter keys and values:
   - `problemTitle`: Screen broken (Type: Text)
   - `problemDescription`: Dropped phone on floor (Type: Text)
   - `deviceType`: mobile (Type: Text)
   - `preferredDate`: 2026-12-01 (Type: Text)
   - `images`: Select a file from your computer! (Hover over the key row, change type from Text to File).

- **Method:** `POST`
- **URL:** `{{base_url}}/bookings`
- **Auth:** `{{accessToken}}`

**6.2 My Bookings**
- **Method:** `GET`
- **URL:** `{{base_url}}/bookings`
- **Auth:** `{{accessToken}}`

---

### 💬 7. Chat System (Customer)

**7.1 Start / Get Conversation**
- **Method:** `POST`
- **URL:** `{{base_url}}/chat/conversations`
- **Auth:** `{{accessToken}}`

**7.2 Send Message**
- **Method:** `POST`
- **URL:** `{{base_url}}/chat/conversations/<paste_conversation_id_here>/messages`
- **Auth:** `{{accessToken}}`
- **Body:**
```json
{
  "content": "Hello, I need help with my order."
}
```

---

### 🛠️ 8. Admin Routes

*(⚠️ Important: Log in as Admin first, so your `{{accessToken}}` is an Admin token!)*

**8.1 Create Product**
- **Method:** `POST`
- **URL:** `{{base_url}}/admin/products`
- **Auth:** Admin `{{accessToken}}`
- **Body:**
```json
{
  "title": "Gaming Laptop Pro",
  "description": "High performance laptop",
  "price": 1500,
  "stock": 50,
  "category": "Electronics",
  "images": ["https://via.placeholder.com/150"]
}
```

**8.2 Update Order Status**
- **Method:** `PATCH`
- **URL:** `{{base_url}}/admin/orders/<paste_order_id_here>/status`
- **Auth:** Admin `{{accessToken}}`
- **Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```

**8.3 Admin Dashboard Analytics**
- **Method:** `GET`
- **URL:** `{{base_url}}/admin/dashboard/stats`
- **Auth:** Admin `{{accessToken}}`

**8.4 Update Booking Status**
- **Method:** `PATCH`
- **URL:** `{{base_url}}/admin/bookings/<paste_booking_id_here>/status`
- **Auth:** Admin `{{accessToken}}`
- **Body:**
```json
{
  "status": "completed",
  "finalCost": 150
}
```

**8.5 Create Time Slot**
- **Method:** `POST`
- **URL:** `{{base_url}}/time-slots`
- **Auth:** Admin `{{accessToken}}`
- **Body:**
```json
{
  "date": "2026-12-01",
  "startTime": "09:00",
  "endTime": "10:00",
  "maxBookings": 2
}
```

---
**Happy Testing! 🎉** If a request fails, always check the `success` and `message` properties in the JSON response, as the backend will tell you exactly what went wrong!
