---
sidebar_position: 3
---

# General Requirements 

## Installation

To run the project locally, clone the repository and install Node.js and some required dependencies:

### Step 1: Set Up the Project Environment
Load up your preferred IDE and Navigate to your preferred directory for the installation. Then clone the repo:
```bash
    git clone https://github.com/cis3296f24/applebaum-final-projects-mafia-uhh
```
Download the latest version of Node.js from the official website: "https://nodejs.org/en/download/package-manager".    
- Choose your system and either "Current" version or "LTS" (Long-Term Support) version.  

Next, run the installation wizard. Also make sure that you install Node.js in a directory above or at your preferred directory from before. Check the version of node and npm with:
```bash
    node -v
    npm -v
```
Navigate into the project directory and install the initial dependencies:
```bash
    cd applebaum-final-projects-mafia-uhh
    npm install
```
While still in the project directory, applebaum-final-projects-mafia-uhh, install these additional dependencies:
```bash
    npm install express
    npm install ws
    npm install concurrently --save-dev
```
Navigate to the client folder within the main project directory and install this last dependency:
```bash
    npm install react-router-dom
```

### Step 2: Run Project!
In your preferred IDE, navigate to the project directory:
```bash
    cd applebaum-final-projects-mafia-uhh
```
Then run the start script to begin the localhost and Game:
```bash
    npm start
```
In your browser, visit the localhost link to join the game.
- (the Host should see it in their console, while other users must manually type it into their browser)
```bash
    Local:            http://localhost:3000
    On Your Network:  http://192.111.11.1:3000
```
Enjoy!