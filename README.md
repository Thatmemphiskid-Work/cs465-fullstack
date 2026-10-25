# CS 465 Travlr Getaways

Randall Jaskolski | Module Eight Portfolio Journal

The final application is in [`travlr/`](travlr/). It combines an Express and Handlebars customer website, an Angular administrator SPA, a REST API, and a MongoDB database. The default `final-project` branch contains the final implementation; `module1` through `module7` retain the course milestones. The repository root also retains an earlier Express scaffold, so use the application and setup instructions inside `travlr/`.

- [Application source and setup instructions](travlr/README.md)
- [Trip and authentication API](travlr/app_api/)
- [Customer MVC application](travlr/app_server/)
- [Angular administrator SPA](travlr/app_admin/)

The following responses address the Module Eight journal prompts.

## Architecture

In my Travlr Getaways project, the customer website and administrator interface use different frontend approaches. Express handles the customer site's routes and controllers, while Handlebars templates generate HTML from trip data retrieved through the API. The browser receives a rendered page. HTML defines the page structure, CSS controls its appearance, and JavaScript provides behavior and request processing. The Angular administrator interface is a single-page application: components, client-side routes, and services let staff view, add, and edit trips without requesting a new complete HTML page for each action. Both interfaces share the same backend and MongoDB trip catalog.

MongoDB fits the project because trips and users can be stored as documents whose fields map naturally to JavaScript objects and JSON responses. Mongoose provides schemas, required-field validation, and model methods, so using a NoSQL database does not mean giving up data structure. The Trip model stores package details, and the User model stores staff identity and password-hash information. This approach supports the catalog's document-based data without requiring relational joins for the implemented workflows.

## Functionality

JSON is a text-based data format; JavaScript is a programming language that can execute functions and application logic. JSON cannot contain executable functions or comments, and its property names use double quotes. In this project, Express receives and returns JSON over HTTP. Angular's HttpClient converts responses into objects used by the components. The customer travel controller also reads API JSON and passes it to Handlebars. This common data format connects the interfaces to the same backend. A start date travels as a JSON string even though Mongoose stores it as a Date.

Refactoring improved both reuse and reliability. Moving the public Travel page from static HTML to a Handlebars loop lets the database supply the catalog. Shared header and footer partials keep navigation consistent. Angular's TripCard renders each package through one reusable component, and TripData centralizes API calls. The JWT interceptor supplies authentication headers instead of repeating that logic in every component. Replacing a fixed login delay with handling of the actual HTTP response also removed a timing dependency. These changes reduce duplication and make updates easier to maintain.

## Testing

An HTTP method describes the requested operation, while an endpoint identifies the resource or action. GET /api/trips retrieves the collection, GET /api/trips/:tripCode retrieves one package, POST /api/trips creates a trip, and PUT /api/trips/:tripCode updates one. Testing must check response status, returned data, and persistence. For example, the Randall Tahiti Getaway was added at $1,899.00 and updated to $1,799.00. A separate GET and the refreshed SPA confirmed the saved change rather than relying only on the form's displayed value.

Security adds more cases to test. Login must accept valid credentials and reject invalid ones, while protected writes must reject missing, forged, and expired tokens. Angular guards redirect unauthenticated Add/Edit navigation, but server-side JWT validation remains essential because a caller can bypass the browser interface. The final verification passed 21 API and security checks, and the Angular production build succeeded with a bundle-size warning. Staff registration now requires authentication, preventing public self-registration from granting catalog-maintenance access. Testing positive and negative paths helped distinguish a working interface from an API that actually enforces access rules.

## Reflection

My goal is to work as a Test Engineer, and this course helped me understand the systems I will be responsible for testing. Building the frontend, API, and database showed me how a defect in one layer can affect the entire application. I developed practical skills in API testing, checking HTTP status codes, validating returned data, and confirming database persistence. Understanding Express routes, Angular components, Mongoose models, and JWT authentication helps me choose meaningful test cases and investigate whether a failure comes from the interface, server, database, or access controls.

The project also gave me experience with positive and negative test cases, repeatable API verification, and documenting expected behavior. Checking invalid credentials, missing fields, unknown trips, and expired tokens reinforced that successful user flows are only part of test coverage. These skills make me a stronger Test Engineer candidate because I can connect a test result to the underlying implementation and explain a defect clearly. My next steps are to expand automated regression coverage, use isolated test data, and strengthen browser automation and continuous integration skills. This repository demonstrates both my understanding of a full stack application and my growing ability to verify it systematically.

## AI assistance acknowledgment

OpenAI Codex assisted with source inspection, application refactoring, test execution, screenshot and diagram preparation, and drafting and formatting this README and journal reflection. The technical examples refer to the implemented Travlr project and its recorded verification results.
