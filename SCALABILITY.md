# 📈 Scalability & Deployment Notes

## Current Architecture

TaskFlow follows a **modular monolith** pattern with clean separation of concerns:

```
Client  →  Express Server  →  MongoDB
              │
              ├── Routes (versioned: /api/v1/)
              ├── Middleware (auth, rbac, validation, errors)
              ├── Controllers (business logic)
              └── Models (data layer)
```

This structure makes it straightforward to scale horizontally or decompose into microservices.

---

## Scaling Strategies

### 1. Horizontal Scaling
- **Stateless API** — JWT tokens are self-contained, no server-side sessions
- **Load Balancer** — Place Nginx or AWS ALB in front of multiple Node.js instances
- **PM2 Cluster Mode** — Run multiple processes on a single machine:
  ```bash
  pm2 start src/server.js -i max
  ```

### 2. Database Scaling
- **Connection Pooling** — Already configured with Mongoose `maxPoolSize: 10`
- **Indexes** — Compound indexes on frequently queried fields (createdBy + status/priority)
- **Read Replicas** — MongoDB replica sets for read-heavy workloads
- **Sharding** — Shard by `createdBy` for large-scale multi-tenant deployments

### 3. Caching (Redis)
For a production deployment, add Redis for:
- **Session/Token blacklisting** — Handle token revocation on logout
- **API response caching** — Cache frequent queries (GET /tasks) with TTL
- **Rate limiting** — Distributed rate limiting across multiple instances

```javascript
// Example Redis integration:
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}:${req.user._id}`;
  const cached = await client.get(key);
  if (cached) return res.json(JSON.parse(cached));
  res.originalJson = res.json;
  res.json = (data) => {
    client.setEx(key, duration, JSON.stringify(data));
    res.originalJson(data);
  };
  next();
};
```

### 4. Microservices Decomposition
As the app grows, decompose into independent services:

| Service | Responsibility |
|---------|---------------|
| **Auth Service** | User management, JWT issuance |
| **Task Service** | CRUD operations, analytics |
| **Notification Service** | Email, push notifications |
| **API Gateway** | Routing, rate limiting, auth verification |

Communication via:
- **REST** for synchronous calls
- **Message Queue** (RabbitMQ / Redis Pub/Sub) for async events

### 5. Docker Deployment

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
COPY swagger.js ./
EXPOSE 5000
CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/taskflow
      - JWT_SECRET=production_secret
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  frontend:
    build: ./frontend
    ports:
      - "3000:80"

volumes:
  mongo_data:
```

### 6. Monitoring & Logging
- **Winston/Pino** — Structured JSON logging
- **Prometheus + Grafana** — Metrics dashboarding
- **ELK Stack** — Centralized log aggregation
- **Health check endpoint** — Already available at `/api/v1/health`

### 7. CI/CD Pipeline
- **GitHub Actions** — Automated testing and deployment
- **Lint + Test** on every PR
- **Docker image build** on merge to main
- **Auto-deploy** to AWS ECS / Railway / Render

---

## Production Checklist

- [ ] Replace JWT_SECRET with a strong, randomly generated key
- [ ] Enable HTTPS (TLS termination at load balancer)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain only
- [ ] Set up MongoDB Atlas with authentication
- [ ] Add request logging to persistent storage
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and alerting
- [ ] Add Dockerfile and docker-compose for containerized deployment
