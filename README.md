# Deployment-site

A platform to host, build, and deploy frontend applications — similar to a lightweight self-hosted Vercel/Netlify workflow.

This repository contains multiple coordinated services that handle builds, routing, storage, UI, and deployment automation.

---

## 🧩 Service Roles

| Directory              | Description                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `api-server`           | Central backend API providing deployment endpoints, metadata storage, and communication between subsystems. |
| `frontend`             | Web dashboard to manage deployments, view logs, and interact with the platform.                             |
| `reverse-proxy-server` | Express-based reverse proxy used to route requests to deployed build output.                                |
| `build-server`         | Executes build commands, runs scripts, and handles Docker/CI-style deployment behavior.                     |
| `test-storage`         | Mock storage service simulating Amazon S3 by serving uploaded build artifacts as static files.              |
| `test-grounds`         | Sandbox environment for testing deployment routing and build outputs.                                       |

---

## 🛠 How to Run

Clone the repository:

```sh
git clone https://github.com/AmalJose664/Deployment-site.git
cd Deployment-site
```

## 🔧 Folder Diagram

```
Deployment-site
│
├───api-server
│	└───
├───build-server
│	└───
├───frontend-server
│	└───
├───reverse-proxy-server-server
│	└───
├───test-server
│	└───
├───README.md
└───.gitignore
```

Deployment-site
│
├───[api-server](./api-server)
│ └───
├───[build-server](./build-server)
│ └───
├───[frontend-server](./frontend-server)
│ └───
├───[reverse-proxy-server](./reverse-proxy-server)
│ └───
├───[test-server](./test-server)
│ └───
├───README.md
└───.gitignore
