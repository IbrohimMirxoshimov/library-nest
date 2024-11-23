## Run the project
1. Install requiements with the following command
```bash
   pnpm install
```

2. Config correction
 - Moving all configs from example.env to .env doesn't work unless you need to
 - postresql server must be running

3. Prisma generation
```bash
   pnpm run migration:up
```

4. Run the project in dev mode
```bash
   pnpm run dev
```

## Key requirements:

1. Multi-library support:

   - Each library (location) operates independently
   - Librarians can only access/modify their own library's data
   - Library isolation should be enforced through permissions and guards

2. Permission-based access control:
   - Role model contains an array of permission numbers
   - Different actions require specific permissions
   - Users' access is restricted based on their role's permissions

## For each module, please provide:

1. DTOs with validation
2. Service with proper error handling
3. Controller with correct permission decorators
4. Necessary interfaces/types
5. Example usage if applicable

## Important considerations:

1. All services should enforce location-based access
2. Use transactions where multiple database operations are needed
3. Include proper error handling and validation
4. Implement logging for important operations
5. Follow NestJS best practices for dependency injection and module organization
