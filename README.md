# Vyaas Mobile App

This is a smart farming companion application.

## App Flow Diagram

```mermaid
graph TD
    A[Start] --> B{currentPage === 'landing'};
    B --> C[LandingPage];
    C -- onAuthRequest --> D{Set currentPage = 'auth'};
    D --> E[AuthPage];
    E -- onBack --> B;
    E -- onAuthSuccess --> F{Set isAuthenticated = true, currentPage = 'home', showOnboarding = true};
    F --> G[HomePage];
    F --> H[OnboardingTour];
    H -- onComplete --> I{Set showOnboarding = false};
    G -- onSignOut --> J{Set isAuthenticated = false, currentPage = 'landing', showOnboarding = false};
    J --> B;
```
