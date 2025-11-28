# Sparky ⚡

A voltage drop calculator for electrical installations, built with React, TypeScript, and Google Maps integration. Currently focused on voltage drop calculations for electrical circuit design, with plans for additional electrical engineering tools in future releases.

## Features

### 🔌 Voltage Drop Calculator
- **Wire size determination** based on voltage drop limits for branch circuits
- **Multiple conductor materials** - Copper and Aluminum with accurate resistance values
- **Installation method considerations** - Raceway and Cable configurations
- **Single and three-phase** power system support
- **Real-time calculations** showing recommended wire sizes and actual voltage drop percentages

### 🗺️ Interactive Map Integration
- **Distance measurement** using Google Maps polyline drawing with precise geodesic calculations
- **Location search** powered by Google Places API for accurate address lookup
- **Fullscreen map mode** for detailed route planning and measurement
- **URL state persistence** - Share complete calculations including map polylines via URL
- **Touch-optimized controls** for mobile and tablet usage

### 🎯 User Experience
- **Responsive design** optimized for desktop, tablet, and mobile workflows
- **Real-time calculations** with instant feedback as parameters change
- **Input validation** with electrical standard range checking and error messaging
- **Modern component-based UI** using DaisyUI design system

## Technology Features

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Modern hooks-based architecture** with extracted, reusable components
- **Component extraction** including Results, Map, Input, and Select components for maintainability

### Mapping & Geolocation
- **@vis.gl/react-google-maps** - Modern Google Maps React library with performance optimizations
- **Google Places API integration** for intelligent location search and autocomplete
- **Polyline drawing tools** with geodesic distance calculation for accurate wire run measurements
- **Map state management** with URL parameter encoding for shareable calculations

### State Management & Persistence
- **React Router** with useSearchParams for URL-based state persistence
- **JSON-encoded URL parameters** allowing complete application state sharing
- **Atomic state updates** preventing stale closure issues in React components

### Styling & UI Framework
- **DaisyUI + Tailwind CSS** for consistent, accessible component styling
- **Mobile-first responsive design** with touch-optimized form controls
- **Modern CSS Grid and Flexbox** layouts for complex component arrangements

### Testing & Development
- **Vite** for fast development server and optimized production builds
- **Vitest** for unit testing electrical calculation utilities
- **TypeScript strict mode** for compile-time error prevention
- **ESLint configuration** with React and TypeScript rule sets

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/jelenis/sparky.git
   cd sparky
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Add your Google Maps API key
   VITE_GOOGLE_MAPS_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

## Future Development 🚀

Additional electrical calculation tools may be added in future releases, depending on development priorities and user feedback:

- **Conduit Fill Calculator** - Wire capacity calculations for various conduit types
- **Branch Circuit Load Calculator** - Residential and light commercial load calculations
- **Wire Ampacity Calculator** - Temperature and bundling correction factors
- **Electrical Panel Schedule Generator** - Circuit layout and load distribution tools

*Note: This application currently focuses specifically on voltage drop calculations. Additional features will be evaluated based on user needs and development resources.*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
