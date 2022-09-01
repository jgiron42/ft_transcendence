# ft_transcendance

## Online Pong game with social network features.
    ft_transcendance is the final 42 school Common Core's project.
    It is a webapp with enforced NestJS for backend and PostgresSQL as only database.
    Frontend framework is left to be chosen by participants.
    For our implementation, we went with NuxtJS (Vue 2) and TailwindCSS.


Access our AWS hosted production instance at https://transcendance.nollium.com/

## Features:
- Online PVP Pong with rollback netcode:
    - Matchmaking.
    - Game spectating.
    - Playing against smart bots.
    - Match history
    - ELO ranking.
    - Leaderboard.
    - Touch screen support.


- Complete chat system:
    - Channels (with administation features)
    - Direct messages.
    - Friend list.
    - Game invites.
    - User status (connected, disconnected, playing a match, ...)
    - User search.

- User profile:
    - Uploadable profile picture.
    - Changeable username.

- Authentication and security:
    - OAuth using 42 Intranet's implementation
    - 2FA using TOTP (Google Authenticator and others). 
- Responsive and original self-made web design.
## Preliminary:
Ensure `api/src/gamemodes` and `client/gamemodes` are stricly identical.


Those folders contains all the game code and configuration, both client and API need it to ensure proper synchronisation through _rollback netcode_. 

## Development:
Create the development dotenv files from the supplied samples:

Examples:


.env:

```
NODE_ENV=development
API_URL=http://localhost/api
API_BASE_URL=http://localhost/api
WSS_BASE_URL=http://localhost
BASE_URL=http://localhost
BROWSER_BASE_URL=http://localhost/api/
```
api.env:
```
API_CORS=*
API_SESSION_TIMEOUT=60000
API_BASE_URL=http://localhost/api
BASE_URL=http://localhost/
BROWSER_BASE_URL=http://localhost/
WSS_BASE_URL=ws://localhost/
API_SESSION_SECRET=replace-this
INTRA42_UID=replace-this
INTRA42_SECRET=replace-this
# must be absolute
API_UPLOADS_PATH=/uploads
```
db.env:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ft_db
```

### Launch the app:
`docker-compose up --build`

### Misc:
API and Client are served by a NGINX reverse-proxy to ensure best performance and same-host URL.

Client is accesible at webroot (`/`) and API under the `/api/` route.
