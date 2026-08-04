# Services

Este diretório conterá todos os serviços de integração com APIs externas.

## Estrutura futura:

```
services/
├── supabase/
│   ├── client.ts          ← Supabase client
│   ├── auth.ts            ← Auth service
│   ├── videos.ts          ← Video CRUD
│   └── users.ts           ← User service
├── cloudflare/
│   ├── r2.ts              ← R2 upload service
│   └── stream.ts          ← Cloudflare Stream
├── paysuite/
│   └── payments.ts        ← PaySuite integration
└── index.ts
```

## Status

- [ ] Supabase (Prompt 2)
- [ ] Cloudflare R2 (Prompt 3)
- [ ] PaySuite Payments (Prompt 4)
