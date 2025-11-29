# Deployment-site

## Lynfera

Api server Directory

## 🔧 Folder Diagram

```
api-server
├───node_modules/
└───src
    ├───config
    │   └───oauthStrategies/
    ├───constants/
    ├───controllers/
    ├───dtos/
    ├───events/
    │   ├───handlers/
    │   ├───schemas/
    │   └───types/
    ├───interfaces/
    │   ├───Base/
    │   ├───consumers/
    │   ├───controller/
    │   ├───repository/
    │   └───service/
    ├───mappers/
    ├───middlewares/
    ├───models/
    ├───repositories/
    │   └───base/
    ├───routes/
    ├───services/
    └───utils/

```

## 🔐 Environment Variables

Create a `.env` file in this directory: api-server

```env
MONGO_URL=mongodb+.....

FRONTEND_URL=http://localhost:3000

REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_SECRET=

API_ENDPOINT=http://localhost:8000

NODE_ENV=development

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CONTAINER_API_TOKEN=


SUBNETS_STRING=
AWS_ACCESSKEY=
AWS_SECRETKEY=
CLUSTER_ARN=
TASK_ARN=
SECURITY_GROUPS=
AWS_S3_BUCKET=

KAFKA_USERNAME=
KAFKA_PASSWORD=

CLICKHOUSE_USERNAME=
CLICKHOUSE_PASSWORD=

```

<br/>
<br/>

## ~~~~

```sh
cd Deployment-site/api-server
```

## Commands

```sh
npm run dev
```

```sh
npm run build
```

## Additional Services needed

- **[Mongo Db](https://www.mongodb.com/)**
- **[Clickhouse](https://clickhouse.com/)**
- **[Kafka](https://kafka.apache.org/)**
