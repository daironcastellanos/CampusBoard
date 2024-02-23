# CampusBoard App Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js (includes npm)**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Visual Studio Code**: [Download VS Code](https://code.visualstudio.com/)
- **Expo CLI**: Install by running `npm install -g expo-cli` in your terminal (macOS) or command prompt/PowerShell (Windows).

## Setup Instructions

### Step 1: Clone the Repository

Open your terminal (macOS) or command prompt/PowerShell (Windows) and clone the CampusBoard app repository using Git:

```shell
git clone https://github.com/yourusername/CampusBoard.git
Remember to replace https://github.com/yourusername/CampusBoard.git with the real link to your repository.

Step 2: Navigate to the Project Directory
After cloning the repository, navigate to the project directory:

shell
Copy code
cd CampusBoard
Step 3: Install Dependencies
Install all the necessary dependencies for the project:

shell
Copy code
npm install
Step 4: Start the Project with Expo
Run the project using Expo CLI:

shell
Copy code
expo start
Step 5: Run the App on a Simulator or Device
iOS Simulator (macOS only): Press i in the terminal to launch the iOS Simulator.
Android Emulator: Press a in the terminal to launch the Android Emulator. Ensure you have an emulator set up beforehand in Android Studio.


### Physical Device (Recommended): ###
 Download the Expo Go app from your device's app store and scan the QR code presented in the terminal or opened Expo developer tools in the browser with your device's camera.
Additional Information
Environment Variables: If the app requires environment variables, create an .env file at the root of the project and populate it with the necessary key-value pairs.
Platform-Specific Dependencies: Some dependencies may need extra setup for iOS or Android. Refer to the library documentation for instructions.
Troubleshooting
If you encounter any issues with dependencies, try removing the node_modules directory and the package-lock.json file, then run npm install again.
For issues related to Expo, consult the Expo documentation.
