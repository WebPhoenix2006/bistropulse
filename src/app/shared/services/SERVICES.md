# Shared Services Documentation

This folder contains reusable Angular services for application-wide features, state management, and API communication. Below is a summary of each service:

## Services Overview

### 1. AuthService

Handles authentication, token storage, user session, and provides methods for login, signup, logout, and token management.

### 2. ChatService

Provides methods to fetch and send chat messages between users, using authentication headers.

### 3. CustomerStateService

Manages the currently selected customer using RxJS BehaviorSubject for reactive state management.

### 4. CustomersService

Handles CRUD operations for customers, including uploading customer data, with authentication and error handling.

### 5. FoodService

Handles CRUD operations for food items, including uploading food data, with authentication and error handling.

### 6. OtpService

Manages OTPs for user roles, including fetching and adding OTPs, with authentication.

### 7. PopupService

Provides a reactive popup message system for showing temporary messages in the UI.

### 8. RestaurantContextService

Manages the currently selected restaurant context using RxJS BehaviorSubject.

### 9. RestaurantService

Handles CRUD operations for restaurants, including uploading restaurant data, with authentication and error handling.

### 10. SlowNetworkService

Utility for detecting and handling slow network conditions using timeouts.

### 11. OfflineService

Detects and exposes the application's online/offline status as a reactive signal.

---

## Usage

- Import the desired service in your component or other service:
  ```typescript
  import { AuthService } from "src/app/shared/services/auth.service";
  ```
- Inject it in the constructor:
  ```typescript
  constructor(private authService: AuthService) {}
  ```
- Use its methods or properties as needed.

---

For more details, see each service's TypeScript file and the main README in this folder.
