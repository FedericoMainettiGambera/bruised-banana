import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const AMOUNT_OF_BANANA_IMAGES = 24;

const getTwoRandomBananaImagesIds = () => {
  const firstBananaId = getRandomBanana();
  let secondBananaId = getRandomBanana();
  while (secondBananaId === firstBananaId) {
    secondBananaId = getRandomBanana();
  }
  return { firstBananaId, secondBananaId };
};

const getRandomBanana = () => {
  const min = 0;
  const max = AMOUNT_OF_BANANA_IMAGES - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const bananaRouter = router({
  getBananas: publicProcedure.query(() => {
    const { firstBananaId, secondBananaId } = getTwoRandomBananaImagesIds();
    return {
      firstBanana: {
        id: firstBananaId,
        imageUrl: `/bananaImages/${firstBananaId}.jpg`,
      },
      secondBanana: {
        id: secondBananaId,
        imageUrl: `/bananaImages/${secondBananaId}.jpg`,
      },
    };
  }),
  voteBanana: publicProcedure
    .input(
      z.object({
        votedForId: z.number(),
        votedAgainstId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voteInDb = await ctx.prisma.vote.create({ data: { ...input } });
      return { succes: true, voteInDb };
    }),
});
