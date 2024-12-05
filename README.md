# Odysseus CLI

<img height="150" src="src/assets/logo.png" alt="Logo"/>

**NOTICE: ODYSSEUS-CLI IS BETA SOFTWARE**

While we strive to ensure functionality, we are not liable for any damages or issues arising from the use of this beta version.

We welcome detailed bug reports to help us improve the software.

Odysseus CLI is a command-line interface tool designed to streamline the deployment and management of applications on alpira. By leveraging alpira's build servers and GitHub integration, it simplifies the process of building, configuring, and deploying applications, triggered directly via CLI commands or GitHub push events.

## Features
- **App Deployment:** Deploy Laravel and React apps effortlessly.

- **GitHub Integration:** Seamlessly authorize and integrate with GitHub repositories.

- **Environment Management**: Easily edit .env files and other configuration settings.

- **Build Automation:** Automatically trigger builds using Alpira's build servers.

- **Job Monitoring:** View build and deployment jobs with detailed status updates.

- **Multi-Command Workflow:** Modular commands for various operations such as app creation, repository updates, and deletion.

## Table of Contents
1.  Installation
2. Getting Started
3. Commands Overview
4. What's coming
5. Contribution
6. License

## Installation
1.  Ensure you have Node.js (v16 or above) installed.

2. Install Odysseus CLI globally:

`npm install -g odysseus-cli`

## Getting Started
Before creating or deploying apps, make sure you must have a purchased hosting package which supports Odysseus. For hosting plans, see [here](http://alpira.net "here").

1.  **Authenticate with alpira:** log in to the CLI and authenticate with alpira:

```bash
odysseus-cli login
```
2. **Create an Application:** For now, only Laravel and React are supported:

```bash
odysseus-cli create-app
```
Running this command will prompt the website selector,  after which the application type can be configured. For applications requiring git integration, authorization with the source control provider will be requested.

Some applications such as React can require immediate .env configuration, since these variables are necessary during the initial build.

You can return to this step to change any of the parameters prior to the first build.

3. **Confirm the application has been created**: Make sure all the parameters are correct:
```bash
odysseus-cli list-apps
```

4. **Build the application:** After successfully creating the app, initiate the first build:
```bash
odysseus-cli build-app <app-id>
```
Congratulations! You've successfully deployed your application on alpira. Odysseus-CLI will now update your application whenever a push event has been triggered on your source control provider.


## Laravel-Specific Configuration and Optimization

When deploying Laravel applications, Odysseus CLI goes beyond standard builds to ensure your application is fully configured and optimized. These additional features include:

### Database Configuration:
- Automatically sets up database connections based on the hosting package.
- Configures .env files with necessary database credentials.

### Migrations and Seeders:
- Automatically applies database migrations.
- Optionally runs seeders to populate the database with initial data.

### Redis Configuration:
- Configures Redis for optimized caching and session management.
- Ensures Redis settings are correctly applied to the .env file.

### OPCache Optimization:
- Enables and configures OPCache for improved Laravel performance.
- Ensures compatibility with hosting environments for caching efficiency.

### Queue Configuration:
- Basic queue configuration is added to cronjob.

These features are designed to save time and reduce manual intervention, allowing developers to focus on their application logic while Odysseus CLI handles the infrastructure setup.

### Commands Overview

#### Authentication Commands

- **`login`**: Log in and authenticate with alpira.
  ```bash
  odysseus-cli login
  ```
- **`logout`**: Log out and clear local configurations.
  ```bash
  odysseus-cli logout
  ```
#### App Management Commands
- **`create-app`**:Create a new application
  ```bash
  odysseus-cli create-app
  ```
- **`list-apps`**:View a list of your applications.
  ```bash
  odysseus-cli list-apps
  ```
  
#### Build and Deployment Commands
- **`build-app <appId>`**: Trigger a build for a specific application.
  ```bash
  odysseus-cli build-app <appId>
  ```
- **`view-jobs <appId>`**: View all jobs for a specific application, including build and command execution jobs.
  ```bash
  odysseus-cli view-jobs <appId>
  ```
#### Configuration Commands
- **`edit-env <appId>`**: Edit the ``.env``file of an application. Only certain applications support this.
  ```bash
  odysseus-cli edit-env <appId>
  ```
- **`edit-post-deployment <appId>`**: Edit the post-deployment script of an application. Only certain applications support this.
  ```bash
  odysseus-cli edit-post-deployment <appId>
  ```
- **`update-repository <appId>`**: Update repository settings such as URL, branch, and source control provider.
  ```bash
  odysseus-cli update-repository <appId>
  ```

## What's Coming?
We're excited to announce that the following functionality is planned:
1. Support for GitLab
2. Support for more applications
3. Additional Laravel functionality and monitoring
4. Email notifications

Please feel free to request a feature. User feedback is important to us.

## Contribution
We welcome contributions to improve Odysseus CLI! To contribute:
1. Fork the repository. 
2. Create a feature branch. 
3. Submit a pull request.

## License
Odysseus-CLI is licensed under the MIT License.