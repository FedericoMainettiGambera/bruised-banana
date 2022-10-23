import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const AMOUNT_OF_BANANA_IMAGES = 74;

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
  bananaPair: publicProcedure.query(async ({ ctx }) => {
    const { firstBananaId, secondBananaId } = getTwoRandomBananaImagesIds();

    return {
      firstBanana: await ctx.prisma.banana.upsert({
        where: {
          id: firstBananaId,
        },
        update: {},
        create: {
          id: firstBananaId,
          imageUrl: `/bananas-images/${firstBananaId}.jpg`,
          rating: 1200,
        },
      }),
      secondBanana: await ctx.prisma.banana.upsert({
        where: {
          id: secondBananaId,
        },
        update: {},
        create: {
          id: secondBananaId,
          imageUrl: `/bananas-images/${secondBananaId}.jpg`,
          rating: 1200,
        },
      }),
    };
  }),
  fight: publicProcedure
    .input(
      z.object({
        winnerId: z.number(),
        loserId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const winnerBanana = await ctx.prisma.banana.findUnique({
        where: {
          id: input.winnerId,
        },
      });
      const loserBanana = await ctx.prisma.banana.findUnique({
        where: {
          id: input.loserId,
        },
      });

      if (!winnerBanana || !loserBanana) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wrong id",
        });
      }

      const { newWinnerRating, newLoserRating } = calcNewRatings(
        winnerBanana.rating,
        loserBanana.rating
      );

      await ctx.prisma.banana.update({
        where: {
          id: winnerBanana.id,
        },
        data: {
          totalFights: { increment: 1 },
          rating: newWinnerRating,
        },
      });

      await ctx.prisma.banana.update({
        where: {
          id: loserBanana.id,
        },
        data: {
          totalFights: { increment: 1 },
          rating: newLoserRating,
        },
      });

      return {
        winner: { id: input.winnerId, rating: newWinnerRating },
        loser: { id: input.loserId, rating: newLoserRating },
      };
    }),
  results: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.banana.findMany({
      orderBy: {
        rating: "desc",
      },
    });
  }),
});

const calcNewRatings = (winnerRating: number, loserRating: number, K = 60) => {
  const expectedScore =
    1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  const winnerScore = 1;
  const loserScore = 0;

  const newWinnerRating = Math.round(
    winnerRating + K * (winnerScore - expectedScore)
  );
  const newLoserRating = Math.round(
    winnerRating + K * (loserScore - expectedScore)
  );

  return {
    newWinnerRating,
    newLoserRating,
  };
};
