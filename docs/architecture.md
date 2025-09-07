
## Project Structure
```
app/
├── [uuid]/                    # Student routes
│   ├── [sessionId]/          # Test session details
│   │   └── components/       # Session-specific components
│   ├── profile/              # Student profile management
│   │   ├── edit/             # Profile editing
│   │   │   └── components/   # Edit form components
│   │   └── components/       # Profile view components
│   ├── onboarding/           # Student registration
│   │   └── components/       # Registration form components
│   └── components/           # Student-level components
├── components/               # Global reusable components
│   ├── common/              # Common UI components
│   └── providers/           # Context providers
├── hooks/                    # Custom React hooks with React Query
├── models/                   # TypeScript interfaces
├── repository/               # Data access layer
│   ├── abstract/            # Repository interfaces
│   ├── implementation/      # Firebase implementations
│   └── repositaryFactory.ts # Factory pattern
├── service/                  # Business logic layer
└── utils/                    # Helper functions

```
## Architecture

- Data Flow: Components → Hooks → Services → Repositories → Firebase

### Key Pattern :


- Repository Pattern:

```
Handles all Firebase query implementations. Each Firebase collection has its own dedicated repository containing all related database operations.

Structure:
Abstract Layer: Defines data access contracts
Implementation Layer: Firebase-specific query logic
Factory Pattern: Centralized repository instance management
```

- Service Layer:

```
Contains all business logic and  Firebase operations for specific routes. Services aggregate all necessary data from multiple repositories and return processed information ready for UI consumption.
```

- Custom Hooks:

```
React Query integration for optimized data fetching. Hooks manage useEffect calls, fetch data from services, and handle caching, loading states, and error management.
```

- Component Organization:

```
All components related to a specific route are organized within that route's folder structure, ensuring clear feature boundaries and easy maintenance.
```


## How to Create New Route

```
- Follow these steps to add a new route to the application:

1. Create Service Layer

2. Create Custom Hook

3. Create Route Structure

4. Connect Everything:
Use the custom hook in your page component to fetch data and pass it to your components.

```
