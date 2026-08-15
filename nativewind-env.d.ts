/// <reference types="nativewind/types" />

// nativewind/types only augments RN component props with `className` — it
// doesn't declare a module for the `.css` file itself. Metro's NativeWind
// transform handles the runtime side; this just satisfies the type checker
// for the side-effect `import './global.css'` in App.tsx.
declare module '*.css';
