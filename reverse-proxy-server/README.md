# Deployment-site

## Lynfera

reverse-proxy-server Directory

## 🔧 Folder Diagram

```
reverse-proxy-server
└───src
    │   app.ts
    │   server.ts
    │
    ├───config
    │       db.ts
    │       kafka.ts
    │
    ├───contants
    │       paths.ts
    │       plan.ts
    │
    ├───controller
    │       extrasController.ts
    │
    ├───interfaces
    │   ├───repository
    │   │       IProjectBandwidth.ts
    │   │       IProjectRepo.ts
    │   │
    │   └───service
    │           IAnalyticsService.ts
    │           IProjectService.ts
    │
    ├───middleware
    │       extraProxy.ts
    │       globalErrorHandler.ts
    │       projectChecker.ts
    │       proxy.ts
    │       validate.ts
    │
    ├───models
    │       Analytics.ts
    │       Project.ts
    │       ProjectBandwidth.ts
    │
    ├───repository
    │       project.repo.ts
    │       projectBandwidth.repo.ts
    │
    ├───routes
    │       routes.ts
    │
    ├───service
    │       analytics.service.ts
    │       project.service.ts
    │
    └───utils
            analyticsCleaner.ts
            AppError.ts
            CircuitBreaker.ts
            uaParser.ts

```

## 🔐 Environment Variables

Create a `.env` file in this directory: reverse-proxy-server

```env
MONGO_URL=

OWN_DOMAIN=localhost
KAFKA_USERNAME=
KAFKA_PASSWORD=
```

<br/>
<br/>

## ~~~~

```sh
cd Deployment-site/reverse-proxy-server
```

## Commands

```sh
npm run dev
```

```sh
npm run build
```
