# SUEDWEBS

Ensure you have [node](https://nodejs.org/) installed.

Ensure you have [pnpm](https://pnpm.io/) installed.

If you are using nix, make sure you have flakes enabled and use `nix develop` to enter the dev shell (for each terminal).

Terminal 1

```
cd client
cp .env.template .env
pnpm i
pnpm run dev
```

Terminal 2

```
cd server
pnpm i
pnpm run dev
```

Ensure the .env file is pointing to the port that is running in server.
