# Software & AI Engineer Portfolio

This is a modern, professional portfolio website for a Software and AI Engineer, built with React, TypeScript, and Vite.

## Features
- **About Me**: Introduction and background.
- **Skills**: Technical skills with a focus on AI and software engineering.
- **Projects**: Showcase of selected projects with images and descriptions.
- **Experience**: Work history and relevant roles.
- **Education**: Academic background.
- **Contact**: Contact form for inquiries.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Works on all devices.
- **Accessibility**: Built with best practices for accessibility.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

## Customization

Update the content in the respective sections to personalize your portfolio. Replace placeholder images and text as needed.

---
This project was bootstrapped with [Vite](https://vitejs.dev/) and uses React + TypeScript.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
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
