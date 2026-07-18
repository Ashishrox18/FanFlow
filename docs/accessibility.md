# Accessibility Implementation (WCAG 2.2 AA)

FanFlow AI is built to meet WCAG 2.2 AA accessibility guidelines, ensuring stadium navigation and real-time guidance are usable by all supporters.

## Accessible Navigation features

- **Skip Navigation Link**: Keyboard users can press `Tab` on page load to focus on a visually hidden "Skip to main content" link, allowing them to bypass the header menu.
- **Accessibility Mode**: A dedicated global setting. When activated, the AI Smart Navigation avoids stairs and suggests elevator and ramp-accessible paths only.
- **Focus Indicators**: Explicitly styled focus rings (`focus-visible:ring-2`) on all interactive buttons, links, and forms.

## Screen Reader Optimization

- **ARIA Roles & Attributes**: Every interactive element utilizes semantic HTML or is annotated with `aria-label`, `aria-expanded`, or `aria-live`.
- **Aria-Live Announcements**: Live status updates like loading state transitions and AI chat response generations utilize `aria-live="polite"` or `role="status"` to announce changes immediately.
- **Skip Nav Target**: Layout wraps the content with `id="main-content"` so screen readers can jump directly to page contents.

## Color & Motion

- **Contrast Ratios**: Color palettes are tailored to ensure readability. Text colors and background combinations exceed the WCAG AA 4.5:1 contrast requirement.
- **Reduced Motion Support**: Employs `@media (prefers-reduced-motion: reduce)` to automatically disable all Framer Motion transitions and custom CSS animations for users with vestibular disorders.
