# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Node.js/Express backend for reel_zomato application.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 5.x
- **Dev Tools**: nodemon

## Common Commands

### Development
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Testing
```bash
npm test
```

## Project Architecture

This is a new project with minimal structure. As the codebase grows, typical Express patterns should be followed:

- **Routes**: API endpoint definitions
- **Controllers**: Request handling logic
- **Models**: Data models and database schemas
- **Middleware**: Authentication, validation, error handling
- **Config**: Environment and application configuration

## Development Notes

- nodemon is installed for development - configure it to watch relevant file extensions
- No test framework is currently configured - consider adding Jest, Mocha, or similar when writing tests
- No linting or formatting tools are configured yet
