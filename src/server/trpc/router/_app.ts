// src/server/router/_app.ts
import { router } from "../trpc";

import { bananaRouter } from "./banana";

export const appRouter = router({
  banana: bananaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
