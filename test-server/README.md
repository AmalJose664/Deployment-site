# Deployment-site

## Lynfera

test-server Directory

## 🔧 Folder Diagram

```
test-server
│   index.ts
│   package-lock.json
│   package.json
│   README.md
│
├───public
│   ├───tests
│   └───user-projects
│
├───config
│       kafka.ts
│
├───controller
│       controller.ts
│       testFunctions.ts
│
├───middleware
│       validate.ts
└───routes
        routes.ts
```

## 🔐 Environment Variables

Create a `.env` file in this directory: test-server

```env
KAFKA_USERNAME=
KAFKA_PASSWORD=
```

<br/>
<br/>

## ~~~~

```sh
cd Deployment-site/test-server
```

## Commands

```sh
npm run dev
```

```sh
npm run build
```
