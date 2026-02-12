## The project structure:

```
incubyte-training-okr
	client (frontend)
	express-server (old/v1)
	okr-server (old/v2)
	server (backend) (stable v2.5)
```

Version control: `git`
# Getting Started
## Backend

Pre-requisites:

Package Manager: `pnpm`

| Dependency | Version |
| ---------- | ------- |
| node       | 24.12.0 |
| pnpm       | 10.28.0 |


### Environment Variables;

`DATABASE_URL`
`PORT` : Default 3000


`cd .\okr-server`

First steps:
1. Install all the dependencies
`pnpm install`
2. Start the PostgresDB using Podman
`podman compose up`
3. Deploy prisma migrations
`pnpx prisma migrate deploy`
4. Generate the prisma files
`pnpx prisma generate`
5. Start the backend
`pnpm run start:dev`



## Frontend

Pre-requisites:

Package Manager: `pnpm`

| Dependency | Version |
| ---------- | ------- |
| node       | 24.12.0 |
| pnpm       | 10.28.0 |

### Environment Variables;

The example env files, exists in `.env.example`
`DATABASE_URL`
`PORT` : Default 3000


`cd .\client`

First steps:
1. Install all the dependencies
`pnpm install`
2. Start the frontend
`pnpm run dev`

## Troubleshooting

1.  Running `pnpm run start:dev` raises this error:

    Error: `src/lib/prisma.service.ts:3:30 - error TS2307: Cannot find module '../../generated/prisma/client' or its corresponding type declarations.
	 Issue:  
		 1. prisma migration may not have been deploy
		 2. pirsma generation files are not generate
	Resolve:
		- Run prisma migration deploy and generate files
		- `pnpx prisma migrate deploy`
		- `pnpx prisma generate`

1. Running `pnpx prisma migrate deploy` raises this error:
   Error: ``` The datasource.url property is required in your Prisma config file when using prisma migrate deploy.```
   Issue:
   1. `DATABASE_URL`: Add the missing `.env` variables
   Resolve:
   - Add the missing  variables `DATABASE_URL` in `.env`
   Error: ```Error: P1000: Authentication failed against database server, the provided database credentials for `user` are not valid```
   Issue:
   1. The `user` and `password` for the `DATABASE_URL` is incorrect
   2. Postgres DB container not running/started
   3. Check the ports in the compose file, and the Database URL
   Resolve:
   - Add the correct `user` and `password`
   - Start the Postgres container
   - Analyzing the exposed incoming and outgoing ports in your local machine and the docker container, and match them in the Database_URL
