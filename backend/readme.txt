elder-assistant-backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   └── config.module.ts
│   │
│   ├── assistance/
│   │   ├── assistance.module.ts
│   │   ├── assistance.controller.ts
│   │   ├── assistance.service.ts
│   │   └── dto/guide.dto.ts
│   │
│   ├── ai/
│   │   ├── ai.module.ts
│   │   └── ai.service.ts
│   │
│   ├── sessions/
│   │   ├── sessions.module.ts
│   │   └── sessions.service.ts
│   │
│   └── prisma/
│       └── prisma.service.ts
│
└── .env