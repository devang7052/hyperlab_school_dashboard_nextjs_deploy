# How to Add Parameters to NextAuth Session

This guide explains how to add custom parameters to the NextAuth session object. This is useful for storing additional user-specific data that you might need to access throughout your application.

## Steps to Add a New Parameter (e.g., `instituteId`)

To add a new parameter like `instituteId` to the NextAuth session, you typically need to modify three key areas:

1.  **Define the new parameter in your authentication types.**
2.  **Update your `[...nextauth]/route.ts` (or `auth.ts`) to handle the new parameter during authorization and session callbacks.**
3.  **Ensure your login flow provides the necessary data (if applicable).**

Let's walk through these steps using `instituteId` as an example, referencing the changes made in this project.

### 1. Define the New Parameter in Authentication Types

First, you need to extend the NextAuth `User`, `Session`, and `JWT` interfaces to include your new parameter. This provides type safety and ensures your application recognizes the new data.

**File:** `app/models/helpers/authTypes.ts`

```typescript
// app/models/helpers/authTypes.ts
// ... existing code ...

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  userType?: DashboardType;
  instituteId?: string; // Add your new parameter here
}

// ... existing code ...

declare module "next-auth" {
  interface User extends AuthUser {
    userType?: DashboardType;
    instituteId?: string; // Add to User interface
  }

  interface Session {
    user: {
      email: string;
      name: string;
      userType: DashboardType;
      instituteId: string; // Add to Session user object
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: DashboardType;
    instituteId?: string; // Add to JWT interface
  }
} 
```

### 2. Update `auth.ts` (NextAuth Configuration)

Next, you need to modify your NextAuth configuration file to handle the new parameter during the `authorize` function of your `CredentialsProvider` and in the `jwt` and `session` callbacks.

**File:** `app/lib/auth.ts`

```typescript
// app/lib/auth.ts
// ... existing code ...

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
        userType: { label: 'UserType', type: 'text' },
        instituteId: { label: 'InstituteId', type: 'text' } // Add to credentials
      },
      async authorize(credentials) {
        // ... existing credential checks ...

        // Example: Fetch institute data based on email
        const schoolInstitute = await AuthService.checkEmailExistence(credentials.email);
        
        if (!schoolInstitute) {
          throw new Error('This email is not registered with any organization');
        }

        const user: AuthUser = AuthService.createUserFromEmail(credentials.email);
        
        // Assign the new parameter to the user object
        user.userType = schoolInstitute.userType;
        user.instituteId = schoolInstitute.id; // Assign instituteId
        
        return user;
      }
    })
  ],
  
  // ... existing code ...
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.userType = user.userType;
        token.instituteId = user.instituteId; // Add to JWT token
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email as string,
          name: token.name as string,
          userType: token.userType as DashboardType,
          instituteId: token.instituteId as string // Add to session user object
        };
      }
      return session;
    }
  },
  
  // ... existing code ...
}
```

### 3. Ensure Login Flow Provides Necessary Data (if applicable)

If your new parameter is derived during the authentication process (like `instituteId` from an email lookup), you might not need to explicitly pass it from your login form. However, if it's a direct input from the user, ensure your login component passes this data.

**Example (from `useAuth.ts` and `login/page.tsx`):**

In our example, `instituteId` is derived, so the `signIn` call in `useAuth.ts` doesn't explicitly pass it. The `authorize` function in `auth.ts` handles its retrieval and attachment.

```typescript
// app/hooks/authentication/useAuth.ts
// ... existing code ...

  const verifyOTPMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      // ... existing OTP verification ...
      
      const result = await signIn('email-otp', {
        email,
        otp,
        redirect: false,
      });
      
      // ... existing error handling ...
      
      return result;
    },
    // ... existing onSuccess ...
  });

// ... existing code ...
```

## Accessing the New Parameter in Your Application

Once the parameter is added to the session, you can access it using `useSession()` in your client-side components.

```typescript
import { useSession } from 'next-auth/react';

const MyComponent = () => {
  const { data: session } = useSession();

  if (session?.user?.instituteId) {
    console.log('Institute ID:', session.user.instituteId);
  }

  // ...
};
```

By following these steps, you can effectively extend your NextAuth session to include any custom parameters required by your application. 