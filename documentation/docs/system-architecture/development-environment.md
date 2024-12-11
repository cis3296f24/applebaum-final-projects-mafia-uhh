---
sidebar_position: 4
---

# Development Environment

Using VSCode & GitHub primarily.

- Operating System: Windows, macOS
```
Windows 10 and 11
```
- Built for computer and desktop (not mobile)
- Node.js:
```
version v22.11.0
``` 
- npm:
```
version 10.9.0
```
- yarn:
```
version 1.22.22
```
- git (Windows):
```
version 2.47.0.windows.2
```
- Dependencies
```
## from package.json

{
  "devDependencies": {
    "concurrently": "^9.1.0",
    "jest": "^27.5.1",
    "web-vitals": "^4.2.4"
  },
  "scripts": {
    "start": "concurrently \"npm start --prefix server\" \"npm start --prefix client\"",
    "test": "concurrently \"npm test --prefix server\" \"npm test --prefix client\""
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "react-router-native": "^6.28.0",
    "react-scripts": "^5.0.1",
    "ws": "^8.18.0"
  }
}
```