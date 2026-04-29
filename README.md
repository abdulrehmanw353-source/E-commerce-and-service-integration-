# E-commerce with service integration

### By "@devsiffy"

#### Backend

```
- express server initialized
- packages: cors, cookie-parser, json, dotenv are setup
- dev packages: nodemon
- mongodb atlas connected
- odm: mongoose
- creating folder structure
- creating core utilities
- defining error handling middleware
- creating user model
- customer (user) register route and controller is implemented
- set userSchema transform function to remove password field from response
- customer (user) login route and controller is implemented
- access and refresh tokens generators are defined and used
- creating role middleware
- new refresh and access token route and controller is implemented for customer
- customer logout route and controller is implemented
- do some fixes/improvements
- creating product model
- defining product creation service, route & controller for admin is implemented
- do some fixes/improvements
- getting all products service, route & controller for admin is implemented
- getting single product service, route & controller for admin is implemented
- updating product service, route & controller for admin is implemented
- deleting product service, route & controller for admin is implemented (soft delete)
- FIX: make the product title unique in product model
- FIX: correcting the product create route endpoint
- creating public products routes, services & controller to get all products
- creating public products routes, services & controller to get single product
- fixing product unique constraint using compound index (title + isDeleted)
- implementing mongodb text search for product search functionality
- adding case-insensitive category filtering
- improving sorting with allowed fields validation
- implementing relevance-based sorting for search queries
- fixing pagination and query handling for public products API
- adding the review models and its routes for the products
- implementing cart create & get model, services, controllers & routes
- implementing update, remove & clear cart routes, services & controllers
- implementing get all orders, single order, create order routes, services & controllers
- implementing admin auth login, logout, refresh-roken routes & controllers
- FIX: adding missing ApiError import in order controller
- implementing admin get all orders service, controller & route (paginated, filterable by status/paymentStatus)
- implementing admin get single order service, controller & route (with user details)
- implementing customer get profile service, controller & route
- implementing customer update profile service, controller & route (firstName, lastName, phoneNo, address)
- implementing customer change password service, controller & route (with current password verification)
```

### By "Pull Requests"

#### Backend

```
- creating constants.js for defining .env variables
```
