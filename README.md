[![Actions Status](https://github.com/shootismoke/backend/workflows/pr/badge.svg)](https://github.com/shootismoke/backend/actions)
![GitHub](https://img.shields.io/github/license/shootismoke/backend.svg)
[![David](https://img.shields.io/david/shootismoke/backend.svg)](https://david-dm.org/shootismoke/backend)
[![Maintainability](https://api.codeclimate.com/v1/badges/dfeff2fb9de150607af9/maintainability)](https://codeclimate.com/github/shootismoke/backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dfeff2fb9de150607af9/test_coverage)](https://codeclimate.com/github/shootismoke/backend/test_coverage)

# ⚠️ This repo is deprecated in favor of https://github.com/shootismoke/webapp

# @shootismoke/backend

Backend for the [Sh\*\*t! I Smoke](https://shootismoke.github.io) mobile app.

## Deploying to Production

1. Upload newest GraphQL schema to Apollo Graph Manager

```bash
yarn graphql:schema
yarn graphql:manager --key "<ENGINE_API_KEY>"
```

2. Deploy to Vercel `backend-production`

```bash
yarn vercel:prod
```

3. Set alias of latest deployed `backend-production` to correct URL

```bash
yarn vercel:prod --prod
```
