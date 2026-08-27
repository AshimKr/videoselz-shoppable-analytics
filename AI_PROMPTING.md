AI Prompting Log

This file records the major AI interactions used during the Videoselz Full Stack Developer take-home assignment.

Per the assignment instructions, the log focuses on major architecture decisions, features, debugging sessions, and complex implementation tasks. The prompts below are reproduced from the actual prompts/messages used during this assignment.

Note: Some debugging interactions were submitted primarily as screenshots rather than typed text. Where there was no additional typed prompt, that is explicitly noted instead of inventing wording.

1. Phase 1 — Project Foundation

Tool Used

ChatGPT

Context / Task

Initialize the Videoselz take-home project and build the initial full-stack foundation.

Exact Prompt Used

lets start with Phase 1

Outcome & Adjustments

The project foundation was established with:

React + Vite frontend

Node.js + Express backend

SQLite + Prisma database

Root project structure

Development scripts

Basic Express /api/health endpoint

.gitignore

Initial README.md

Initial AI_PROMPTING.md

The implementation was tested locally and both the React page and /api/health endpoint were confirmed working.

2. Prisma 7 Migration Error

Tool Used

ChatGPT

Context / Task

Debugging a Prisma migration failure after installing Prisma 7.10.0.

Exact Prompt Used

D:\videoselz-shoppable-analytics\server>npx prisma migrate dev --name init
Loaded Prisma config from prisma7.config.ts.

Prisma schema loaded from prisma\schema.prisma.
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property url is no longer supported in schema files. Move connection URLs for Migrate to prisma.config.ts and pass either adapter for a direct database connection or accelerateUrl for Accelerate to the PrismaClient constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
-->  prisma\schema.prisma:7
|
6 |   provider = "sqlite"
7 |   url      = env("DATABASE_URL")
|

Validation Error Count: 1
[Context: getConfig]

Prisma CLI Version : 7.10.0

Outcome & Adjustments

The initial setup used a Prisma 6-style datasource configuration. The project was changed to Prisma 7 conventions:

Removed url from schema.prisma

Moved the database URL to prisma7.config.ts

Added Prisma 7 datasource configuration

Continued using SQLite

3. Prisma 7 Seed Command Not Configured

Tool Used

ChatGPT

Context / Task

Fixing the Prisma 7 seed configuration after migration succeeded.

Exact Prompt Used

D:\videoselz-shoppable-analytics\server>npx prisma db seed
Loaded Prisma config from prisma7.config.ts.

⚠️ No seed command configured

To seed your database, add a seed property to the migrations section in your Prisma config file.

Example

// prisma7.config.ts
export default defineConfig({
migrations: {
seed: 'bun·./prisma/seed.ts',
},
datasource: {
url: '[your database URL]',
},
})

D:\videoselz-shoppable-analytics\server>

Outcome & Adjustments

The seed command was moved into the Prisma 7 migrations.seed configuration:

migrations: {
  path: "prisma/migrations",
  seed: "node prisma/seed.js"
}

The project was later updated to use a TypeScript seed file with tsx.

4. Prisma 7 Seed Import / Client Compatibility Error

Tool Used

ChatGPT

Context / Task

The seed process failed because the old @prisma/client import pattern was incompatible with the installed Prisma 7 setup.

Exact Prompt Used

D:\videoselz-shoppable-analytics\server>npx prisma db seed
Loaded Prisma config from prisma7.config.ts.

Running seed command node prisma/seed.js ...
file:///D:/videoselz-shoppable-analytics/server/prisma/seed.js:1
import { PrismaClient } from "@prisma/client";
^^^^^^^^^^^^
SyntaxError: Named export 'PrismaClient' not found. The requested module '@prisma/client' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

at ModuleJob._instantiate (node:internal/modules/esm/module_job:228:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:121:5)
at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:665:26)
at async asyncRunEntryPointWithESMLoader (node:internal/modules/esm/loader:708:5) {

code: 'ERR_MODULE_NOT_FOUND'
...

as we are using this version so check the above issue and give fix according to this: "dependencies": {
"@prisma/client": "^7.10.0",
"cors": "^2.8.6",
"dotenv": "^17.4.2",
"express": "^5.2.1",
"prisma": "^7.10.0"
},

Outcome & Adjustments

The Prisma 7-compatible SQLite architecture was introduced:

Installed @prisma/adapter-better-sqlite3

Installed better-sqlite3

Changed the generator to prisma-client

Generated the client under src/generated/prisma

Configured PrismaBetterSqlite3

Constructed PrismaClient with the adapter

5. Generated Client .js Import Error

Tool Used

ChatGPT

Context / Task

The generated Prisma client was present as TypeScript source (client.ts), but the JavaScript seed script tried to import client.js.

Exact Prompt Used

[Screenshot shared showing the generated Prisma client files and the seed command error]

Outcome & Adjustments

The seed setup was changed from JavaScript to TypeScript:

Installed tsx

Renamed prisma/seed.js to prisma/seed.ts

Changed Prisma seed configuration to:
seed: "tsx prisma/seed.ts"

Imported the generated Prisma client from the generated TypeScript module

Kept the Better SQLite3 adapter

After the changes, Prisma generation and seeding worked.

6. Prisma Runtime Verification

Tool Used

ChatGPT

Context / Task

Verify that the Prisma 7 database client worked not only in seeding but also inside the Express API.

Exact Prompt Used

http://localhost:5000/api/health is returning {   "success": true,   "message": "Videoselz Analytics API is running",   "database": "connected" }                 lets start with phase 3

Outcome & Adjustments

The application was verified using Prisma 7 in the Express runtime. The API health endpoint confirmed both:

Express server availability

SQLite database connectivity

7. Phase 3 — Backend APIs

Tool Used

ChatGPT

Context / Task

Implement the backend APIs required by the Videoselz assignment.

Exact Prompt Used

lets start with phase 3

Outcome & Adjustments

Implemented:

POST /api/events

GET /api/analytics/videos

Event validation

Video existence validation

Pagination

Aggregated views, clicks, and add-to-cart metrics

Centralized error middleware

Service/controller/route separation

The analytics endpoint was designed so videos with no events remain visible by using a LEFT JOIN.

8. Analytics SQL Column Error

Tool Used

ChatGPT

Context / Task

Debugging the analytics query after SQLite rejected snake_case column names.

Exact Prompt Used

this api "http://localhost:5000/api/analytics/videos" is giving is response: {"success","message":"Internal server error"},                     this is the server log: D:\videoselz-shoppable-analytics\server>npm run dev

videoselz-analytics-server@1.0.0 dev
tsx watch src/server.js

◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
Server running on http://localhost:5000
PrismaClientKnownRequestError:
Invalid prisma.$queryRaw() invocation:

Raw query failed. Code: SQLITE_ERROR. Message: no such column: v.video_url
...
clientVersion: '7.10.0'

Outcome & Adjustments

The raw SQL used snake_case names such as video_url, product_id, video_id, and event_type, while the current Prisma schema generated columns using camelCase field names.

The query was corrected to use:

v.videoUrl

v.productId

e.videoId

e.eventType

No unnecessary migration was introduced. The existing schema and seeded database were retained.

9. Package Script / Prisma Workflow Discussion

Tool Used

ChatGPT

Context / Task

Clarifying whether database lifecycle scripts should be added to the backend package.json.

Exact Prompt Used

I'm using "scripts": {

"dev": "tsx watch src/server.js",

"start": "node src/server.js",

"postinstall": "prisma skills sync || exit 0"

},    do I need to add "db": "prisma db seed",
"db": "prisma studio",
"db": "prisma migrate dev"

Outcome & Adjustments

Added/confirmed the following scripts:

db:migrate

db:seed

db:studio

The existing dev, start, and postinstall scripts were retained.

10. Phase 4 — React Frontend

Tool Used

ChatGPT

Context / Task

Build the React analytics dashboard and integrate it with the backend.

Exact Prompt Used

okay can we start next phase that is phase 4

Outcome & Adjustments

Implemented:

Dashboard layout

KPI cards

Video analytics table

Frontend conversion-rate calculation

Loading state

Error state

Pagination

Simulate Traffic functionality

Modular CSS

Responsive behavior

Tailwind CSS was intentionally not used because the assignment prohibits it.

11. Phase 5 — Production Polish

Tool Used

ChatGPT

Context / Task

Improve the dashboard and backend after the main features were functional.

Exact Prompt Used

lets start with phase 5

Outcome & Adjustments

Improved:

Dashboard-wide summary metrics

Simulation feedback

Backend validation

Request body limits

CORS configuration

Accessibility

API 404 handling

Error middleware

Frontend request timeout

Metadata and UI polish

12. Phase 6 — Testing

Tool Used

ChatGPT

Context / Task

Add automated backend integration tests before final submission.

Exact Prompt Used

lets continue with next phase

Outcome & Adjustments

Added a Vitest + Supertest test suite covering:

Health endpoint

Analytics endpoint

Pagination validation

Event creation

Invalid event types

Missing event fields

Nonexistent videos

API 404 behavior

13. Vitest Failure — Empty Test Suite

Tool Used

ChatGPT

Context / Task

Debugging an automated test run where all tests passed in app.test.js, but Vitest still failed because an empty test file was discovered.

Exact Prompt Used

D:\Projects\videoselz-shoppable-analytics\server>npm test

videoselz-analytics-server@1.0.0 test
vitest run

RUN  v4.1.11 D:/Projects/videoselz-shoppable-analytics/server

❯ src/routes/analytics.test.js (0 test)
stderr | src/app.test.js > Engagement Event API > rejects a nonexistent video
Error: Video not found
...

✓ src/app.test.js (8 tests) 302ms

Failed Suites 1
FAIL  src/routes/analytics.test.js [ src/routes/analytics.test.js ]
Error: No test suite found in file D:/Projects/videoselz-shoppable-analytics/server/src/routes/analytics.test.js
...

Test Files  1 failed | 1 passed (2)
Tests  8 passed (8)

Outcome & Adjustments

Identified that:

The actual API tests were passing (8/8)

src/routes/analytics.test.js was an empty test file

Vitest considered the empty file a failed test suite

The empty test file was removed. A test for unknown API routes was also added so the implemented 404 handler was covered.

14. Final Submission Preparation

Tool Used

ChatGPT

Context / Task

Prepare the project for submission and produce the final README and AI prompting log.

Exact Prompt Used

now lets submit this project, also give me proper README.md and AI_PROMPTING.md with all the prompts including errors solving

Outcome & Adjustments

Prepared:

A complete submission README

A structured AI prompting log based on the real prompts/messages used during the assignment

Setup, migration, seeding, testing, API, architecture, and submission documentation

Placeholders for the final public GitHub repository, public repository contributions, YouTube pitch, Loom/screen recording, and screenshots

AI Usage Principles Followed

The AI was used primarily for:

Architecture planning

Implementation assistance

Debugging

Prisma 7 migration/configuration guidance

API/query design

React component structure

Test design

Documentation

Code was reviewed and adjusted during development, particularly when actual runtime errors exposed mismatches between generated Prisma client behavior, Prisma 7 configuration, SQLite column naming, and the project's JavaScript/TypeScript execution setup.

The final implementation should be manually reviewed before submission so that every important design choice and major code path can be explained during the technical interview.