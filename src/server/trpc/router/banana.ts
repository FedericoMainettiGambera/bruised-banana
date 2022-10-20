import { router, publicProcedure } from "../trpc";

export const bananaRouter = router({
  getBananas: publicProcedure.query(() => {
    return [
      {
        id: 1,
        imageUrl: "https://picsum.photos/200/300",
      },
      {
        id: 2,
        imageUrl: "https://picsum.photos/200/300",
      },
    ];
  }),
});
