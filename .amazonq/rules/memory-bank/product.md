# Amazon Q Custom Rules - Mobile Money Agent Dashboard

## Project Context
You are assisting with the development of **MoPay Agent Portal**, a production-ready React Native mobile money agent dashboard application for iOS and Android platforms.

---

## Technical Stack & Architecture

### Core Technologies
- **Framework**: React Native with Expo SDK 49+
- **Language**: TypeScript with strict type checking
- **Navigation**: React Navigation v6 (Stack Navigator + Bottom Tabs)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Animations**: React Native Reanimated v3 for 60fps animations
- **State Management**: React Context API + useReducer pattern
- **Persistence**: AsyncStorage for local data storage
- **UI Components**: React Native Elements or NativeBase
- **Charts**: Victory Native for data visualization
- **Icons**: React Native Vector Icons (Ionicons + MaterialIcons)

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── context/           # Context providers & reducers
├── hooks/             # Custom React hooks
├── services/          # API & mock data services
├── utils/             # Helper functions & constants
├── types/             # TypeScript type definitions
└── assets/            # Images, fonts, icons
```

---

## Code Quality Standards

### TypeScript Requirements
- Always use TypeScript with strict mode enabled
- Define interfaces for all props, state, and data structures
- Use type inference where possible, explicit types where needed
- Create separate `types/` files for shared type definitions
- Avoid using `any` type - use `unknown` or proper types instead

### Component Guidelines
- Use functional components with React Hooks exclusively
- Create small, single-responsibility components
- Extract reusable logic into custom hooks
- Use React.memo() for performance optimization on expensive components
- Implement proper prop validation with TypeScript interfaces

### Naming Conventions
- **Components**: PascalCase (e.g., `TransactionCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTransactions.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `TransactionData`)

---

## Design System & UI Standards

### Color Palette
```typescript
export const colors = {
  primary: {
    start: '#007bff',
    end: '#00c6ff',
  },
  status: {
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
  text: {
    primary: '#000000',
    secondary: '#6B7280',
  },
};
```

### Typography
- Use platform-specific system fonts (San Francisco for iOS, Roboto for Android)
- Font weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Support dynamic text sizing for accessibility

### Spacing & Layout
- Base spacing unit: 16px (use multiples of 4px or 8px)
- Card border radius: 12px
- Consistent button height: 48px
- Minimum touch target size: 44x44 points (iOS) / 48x48 dp (Android)

### Component Styling Rules
- Use NativeWind (Tailwind) classes for styling
- Create reusable style constants in separate files
- Implement platform-specific styles using `Platform.select()`
- Use `StyleSheet.create()` for performance-critical styles
- Apply proper elevation/shadow for card components

---

## React Native Best Practices

### Performance Optimization
- Use `FlatList` or `SectionList` for long lists (never ScrollView with map)
- Implement `keyExtractor` and `getItemLayout` for FlatLists
- Use `React.memo()`, `useMemo()`, and `useCallback()` appropriately
- Lazy load screens and heavy components
- Optimize images with proper dimensions and caching
- Avoid inline function definitions in render methods
- Use `InteractionManager` for deferred expensive operations

### Navigation
- Always use typed navigation props and routes
- Implement proper screen options (headers, gestures, transitions)
- Use Stack Navigator for hierarchical flows
- Use Bottom Tab Navigator for main app sections
- Handle back button behavior on Android
- Implement deep linking configuration

### State Management
- Use Context API for global app state
- Implement useReducer for complex state logic
- Persist critical data with AsyncStorage
- Create separate contexts for different concerns (auth, transactions, settings)
- Use custom hooks to encapsulate context logic

### Error Handling
- Wrap components with Error Boundaries
- Implement try-catch blocks for async operations
- Show user-friendly error messages
- Log errors for debugging (use proper error tracking in production)
- Handle network failures gracefully with retry mechanisms
- Validate user input before processing

---

## Mobile-Specific Requirements

### Platform Integration
- Implement biometric authentication (TouchID/FaceID/Fingerprint)
- Handle permissions properly (Camera, Contacts, Storage)
- Use Expo APIs for camera, contacts, and notifications
- Implement QR code scanning for merchant payments
- Support deep linking for USSD callbacks
- Handle app state changes (background/foreground)

### Responsive Design
- Support multiple screen sizes (iPhone SE to iPhone 14 Pro Max, Android phones/tablets)
- Use `SafeAreaView` for proper notch handling
- Implement landscape mode support where appropriate
- Use `Dimensions` API or responsive hooks for layout calculations
- Test on both iOS and Android devices/simulators

### User Experience
- Implement smooth animations using Reanimated v3
- Add haptic feedback for interactions (use Haptics API)
- Show loading indicators for async operations
- Implement pull-to-refresh on lists
- Add keyboard dismissal on scroll or tap
- Use `KeyboardAvoidingView` for forms
- Display toast notifications for feedback
- Implement skeleton loading states

### Offline Support
- Cache critical data locally with AsyncStorage
- Show offline indicators when network is unavailable
- Queue transactions for sync when connection returns
- Handle network status changes reactively

---

## Feature-Specific Guidelines

### Authentication & Security
- Never store sensitive data in plain text
- Use Expo SecureStore for tokens and credentials
- Implement session timeout with automatic logout
- Add biometric authentication for sensitive operations
- Validate all inputs on client and server side
- Use secure API communication (HTTPS only)

### Transaction Processing
- Format currency values properly (GHS with 2 decimal places)
- Validate phone numbers with carrier detection
- Show real-time validation errors
- Implement transaction confirmation dialogs
- Display clear success/error feedback
- Generate unique transaction IDs
- Store transaction history locally

### Analytics & Reports
- Use Victory Native for charts and graphs
- Implement horizontal scrollable cards for summaries
- Show animated progress bars for targets
- Calculate commission accurately
- Display historical trends with proper data grouping
- Allow date range filtering
- Export reports functionality

### Search & Filtering
- Implement debounced search for performance
- Add filter chips for transaction status
- Support sorting by date, amount, type
- Show "no results" states clearly
- Persist search/filter preferences

---

## Mock Data Standards

### Transaction Data Structure
```typescript
interface Transaction {
  id: string;
  type: 'Cash In' | 'Cash Out' | 'Airtime' | 'Pay Merchant';
  amount: number;
  phoneNumber: string;
  carrier: 'MTN' | 'Vodafone' | 'AirtelTigo';
  status: 'completed' | 'pending' | 'failed';
  commission: number;
  date: string; // ISO format
  isPorted: boolean;
}
```

### Create Realistic Mock Data
- Generate 50+ transaction entries with varied types
- Include mix of completed, pending, and failed transactions
- Use realistic Ghanaian phone numbers (024, 025, 027, 050, etc.)
- Add varied amounts and commission values
- Include timestamps spanning multiple days/weeks
- Create user profile with agent ID, balance, commission totals

---

## Testing & Quality Assurance

### Code Quality
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions
- Follow DRY (Don't Repeat Yourself) principle
- Keep functions small and focused
- Use early returns to reduce nesting
- Avoid magic numbers - use named constants

### Accessibility
- Add proper `accessibilityLabel` to interactive elements
- Support screen readers (VoiceOver/TalkBack)
- Ensure sufficient color contrast (WCAG AA)
- Support dynamic text sizing
- Add `accessibilityRole` and `accessibilityHint` where appropriate

### Performance Monitoring
- Avoid heavy computations on main thread
- Profile app with React DevTools and Flipper
- Monitor bundle size and load times
- Optimize images (use WebP format where possible)
- Implement code splitting for large screens

---

## API & Data Management

### Mock API Services
- Create service layer for API calls
- Simulate network delays (200-500ms)
- Return realistic success/error responses
- Use async/await for all async operations
- Implement proper error typing

### Data Validation
- Validate amount inputs (positive numbers, max limits)
- Validate phone numbers (format, length, carrier)
- Check balance before transactions
- Sanitize user inputs
- Provide clear validation error messages

---

## Documentation Standards

### Code Comments
- Add file-level comments describing purpose
- Document complex algorithms or business logic
- Explain non-obvious code decisions
- Add TODO comments for future improvements
- Use TypeScript for self-documenting types

### Component Documentation
- Document component props with TypeScript interfaces
- Add usage