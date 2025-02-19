---
title: "Developing with Firebase Emulators and WSL Across Two Machines: A Complete Guide"
date: 2024-07-26
tags: [Firebase, WSL, React, Development, Windows, Networking, Port Forwarding, Emulators]
---

Developing with the Firebase Emulator Suite is fantastic for local development, but what if you want to use a second machine as an extended display for your UI and emulator dashboards?  This is especially useful for React development, where you might want to see your UI updates in real-time on a separate screen. This guide will walk you through setting up a robust development environment using Windows 11, WSL (Windows Subsystem for Linux), the Firebase Emulator Suite, and a React frontend (built with Vite), with the ability to access your application and emulators from a second machine on your local network.

## Why This Setup?

This setup offers several benefits:

*   **Larger Workspace:** Use a second machine as an extended display, giving you more screen real estate for code, the React UI, and the Firebase Emulator UI.
*   **Real Device Testing (Optional):**  You can easily test your application on a real mobile device connected to the same Wi-Fi network.
*   **Isolate Development Environment:** WSL provides a clean, isolated Linux environment for your backend and Firebase development, keeping your Windows host system less cluttered.
*   **Fast Feedback Loop:** Local development with emulators is significantly faster than deploying to the cloud for every change.

## Prerequisites

*   Two Windows 11 machines (or one Windows 11 machine and another machine with a web browser).
*   WSL 2 installed and configured on the primary (host) machine.  We'll assume you're using Ubuntu, but other distributions should work similarly.
*   Node.js and npm (or yarn) installed *inside* your WSL environment.
*   Firebase CLI installed *inside* your WSL environment (`npm install -g firebase-tools`).
*   A Firebase project (you can create one in the Firebase console).
*   A React project created with Vite (or a similar bundler that supports environment variables and the `--host` flag).
* Basic knowledge of the command line, PowerShell, and Firebase.

## Step 1: Set up Your Firebase Project (Inside WSL)

1.  **Initialize Firebase:** Inside your WSL terminal, navigate to your project directory and initialize Firebase:

    ```bash
    firebase init
    ```

    Select the Firebase features you need (Firestore, Functions, Hosting, Storage, etc.). Choose to use the emulators when prompted.

2.  **Configure `firebase.json`:**  Open your `firebase.json` file.  Crucially, set the `host` property for *each emulator* you want to use to `"0.0.0.0"`.  This tells the emulators to listen on all network interfaces, not just localhost within WSL.  This is *essential* for port forwarding to work.

    ```json
    {
      "emulators": {
        "auth": {
          "port": 9099,
          "host": "0.0.0.0"
        },
        "functions": {
          "port": 5001,
          "host": "0.0.0.0"
        },
        "firestore": {
          "port": 8080,
          "host": "0.0.0.0"
        },
        "hosting": {
          "port": 5000,
          "host": "0.0.0.0"
        },
        "storage": {
          "port": 9199,
          "host": "0.0.0.0"
        },
        "ui": {
          "enabled": true,
          "port": 4000,
          "host": "0.0.0.0" // Even though the UI *says* 127.0.0.1, this setting is key
        },
        "hub": {
          "port": 4400,
          "host": "0.0.0.0"
        },
        "singleProjectMode": true
      }
    }
    ```
    You might also be using custom ports, so include those as well.

3.  **Firebase Login:**  Run `firebase login` *inside WSL*. This is important, do this *before* starting the emulators.  Because of the `0.0.0.0` binding, the CLI tools might have trouble connecting to the emulators during the login process if you don't do this first.

4. **Start the emulators:**
    ```
    firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
    ```

## Step 2: Set up Your React Project (Inside WSL)

1.  **Create or Use Existing Project:**  If you don't already have a React project set up with Vite, create one:

    ```bash
    yarn create vite my-react-app --template react-ts # Or react for JavaScript
    cd my-react-app
    ```

2.  **Install Firebase SDK:**

    ```bash
    yarn add firebase  # Or npm install firebase
    ```

3.  **Environment Variables (`.env.local`):** Create a file named `.env.local` in the *root* of your React project (where `package.json` is).  *Do not commit this file to version control.* Add the following, replacing `192.168.6.93` with your *Windows host machine's* IP address (more on finding this below):

    ```
    VITE_AUTH_EMULATOR_HOST=[http://192.168.6.93:9099](http://192.168.6.93:9099)
    VITE_FIRESTORE_EMULATOR_HOST=192.168.6.93
    VITE_FIRESTORE_EMULATOR_PORT=8080
    VITE_FUNCTIONS_EMULATOR_HOST=192.168.6.93
    VITE_FUNCTIONS_EMULATOR_PORT=5001

    # Your other Firebase config variables
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_MESSAGING_SENDER_ID=...
    VITE_APP_ID=...
    VITE_MEASUREMENT_ID=...
    ```

    This is *crucial*: your React app, running on the *client* machine, needs to connect to the emulators using the Windows host's IP address, *not* `localhost`.

4.  **Firebase Initialization (`firebaseConfig.ts` or similar):** Create or modify your Firebase initialization file to use the environment variables:

    ```typescript
    // src/firebaseConfig.ts
    import { initializeApp } from "firebase/app";
    import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
    import { getAuth, connectAuthEmulator } from "firebase/auth";
    import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
      measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    export const auth = getAuth(app);
    export const functions = getFunctions(app);
    export const storage = getStorage(app);


    if (import.meta.env.DEV) {
      connectAuthEmulator(auth, import.meta.env.VITE_AUTH_EMULATOR_HOST);
      connectFirestoreEmulator(
        db,
        import.meta.env.VITE_FIRESTORE_EMULATOR_HOST,
        parseInt(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT),
      );
      connectFunctionsEmulator(
        functions,
        import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST,
        parseInt(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT),
      );
      console.log("Connected to Firebase Emulators");
    }
    ```

5.  **Start Vite with `--host`:**  This makes your React app accessible from other devices on your network.

    ```bash
    yarn dev --host
    ```

## Step 3: Port Forwarding (Windows Host - PowerShell)**

This is the magic that connects your client machine to the WSL instance running the emulators.  We'll use a PowerShell script to create firewall rules and set up port forwarding using `netsh`.

1.  **Create a PowerShell Script:** Create a new file (e.g., `wsl-port-forward.ps1`) and paste the following code into it:

    ```powershell
    # Run this in PowerShell on the *Windows* host (not inside WSL) - AS ADMINISTRATOR!

    # Get the WSL IP address dynamically
    $remoteport = bash.exe -c "ifconfig eth0 | grep 'inet '"
    $found = $remoteport -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

    if( $found ){
      $remoteport = $matches[0];
    } else{
      echo "The Script Exited, the ip address of WSL 2 cannot be found";
      exit;
    }

    # --- All Ports for Firebase Emulators (and Vite) ---
    $ports = @(4000, 9099, 5001, 8080, 5000, 9199, 4400, 4500, 9150, 5173, 8852);  # Include Vite's port too!
    $addr = '0.0.0.0'; # Listen on all interfaces

    # --- Firewall Rules and Port Forwarding (Combined) ---
    # We'll use a single loop to create firewall rules and port forwarding for all ports

    foreach ($port in $ports) {
        $firewallRuleName = "WSL 2 Firebase Emulator - Port $port"

        # Remove any existing firewall rule (clean up)
        Remove-NetFireWallRule -DisplayName $firewallRuleName -ErrorAction SilentlyContinue

        # Add firewall rules (inbound and outbound)
        New-NetFireWallRule -DisplayName $firewallRuleName -Direction Outbound -LocalPort $port -Action Allow -Protocol TCP
        New-NetFireWallRule -DisplayName $firewallRuleName -Direction Inbound -LocalPort $port -Action Allow -Protocol TCP

        # Delete any existing portproxy rule
        netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr

        # Add the portproxy rule
        netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remoteport
    }

    Write-Host "Port forwarding rules created/updated for ports: $($ports -join ', ')" -ForegroundColor Green
    ```

    *   This script handles *both* the Windows Firewall rules *and* the `netsh` port forwarding.
    *   It dynamically gets the WSL IP address.
    *   It includes all the necessary ports for the Firebase Emulator Suite and Vite.
    * It includes a custom port that my firebase function uses, 8852

2.  **Run as Administrator:** Open PowerShell *as an administrator* (right-click -> "Run as administrator"). Navigate to the directory where you saved the script (using `cd`) and run it:

    ```powershell
    .\wsl-port-forward.ps1
    ```

    You should see output indicating that the firewall rules and port forwarding rules were created. If you get any errors, double-check that you're running PowerShell as administrator and that the script is saved correctly as a `.ps1` file.

## Step 4: Find Your Windows Host IP Address

You need the *local* IP address of your Windows *host* machine (the one running WSL).  *Do not* use `127.0.0.1` or `localhost`.

*   **Open Command Prompt (or PowerShell):** On your Windows *host* machine (not inside WSL), open Command Prompt (`cmd`) or PowerShell.
*   **Run `ipconfig`:** Type `ipconfig` and press Enter.
*   **Find the IPv4 Address:** Look for the section describing your Wi-Fi adapter (usually labeled "Wireless LAN adapter Wi-Fi").  The "IPv4 Address" is what you need.  It will likely be something like `192.168.1.XX` or `10.0.0.XX`.

## Step 5: Access from Your Client Machine

On your *client* machine (the second laptop):

1.  **Open a Web Browser:** Open Chrome, Firefox, Edge, or any other browser.
2.  **Enter the URLs:**
    *   **React App:** `http://<Windows_Host_IP>:5173` (e.g., `http://192.168.6.93:5173`)
    *   **Firebase Emulator UI:** `http://<Windows_Host_IP>:4000` (e.g., `http://192.168.6.93:4000`)
    *   **Individual Emulators:** Use the appropriate ports (e.g., `http://192.168.6.93:8080` for Firestore).

## Troubleshooting

*   **WSL IP Address Changes:** The IP address assigned to your WSL instance *can* change, especially after reboots.  If things stop working, re-check the WSL IP address (using `ip addr show eth0` inside WSL) and update your `.env.local` file and re-run the port forwarding script if it has changed.
*   **Windows Firewall:**  Even with the script, the Windows Firewall can sometimes be finicky.  If you're having trouble, *temporarily* disable the Windows Firewall (on the *host* machine) for testing.  If that fixes the problem, you know you need to revisit your firewall rules. *Do not leave the firewall disabled.*
*   **Browser Cache:** Clear your browser's cache and cookies on the client machine.
* **Check the backend is bound to `0.0.0.0`**. Your backend server must be set up to listen on all interfaces, and not just `127.0.0.1`.

##  Making it Persistent (Optional)

The main thing that can disrupt this setup is the WSL IP address changing.  Here are some ways to mitigate that:

*   **Static IP for WSL (Advanced):** You *can* configure WSL to use a static IP address, but this is more complex and requires modifying the virtual network adapter settings in Windows. It's generally *not recommended* unless you have a strong understanding of networking.
*   **Script Alias:** Create an alias (or a function) in your WSL `~/.bashrc` (or `~/.zshrc`) to quickly get the WSL IP address:

    ```bash
    alias getwslip="ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'"
    ```

    Then you can just type `getwslip` in your WSL terminal to get the current IP.

* **Scheduled task** You can set up a windows scheduled task to run your port forwarding script on startup.

## Conclusion

This setup provides a powerful and flexible development environment for Firebase and React applications. By using WSL, port forwarding, and environment variables, you can create a seamless workflow that allows you to leverage multiple machines for a more productive and comfortable development experience. Remember to re-run the port forwarding script and update your environment variables if the WSL IP address changes.  Happy coding!
