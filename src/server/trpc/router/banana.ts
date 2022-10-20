import { router, publicProcedure } from "../trpc";

const AMOUNT_OF_BANANA_IMAGES = 24;

const getTwoRandomBananaImagesIds = () => {
  const firstBanana = getRandomBanana();
  let secondBanana = getRandomBanana();
  while (secondBanana === firstBanana) {
    secondBanana = getRandomBanana();
  }
  return [firstBanana, secondBanana];
};

const getRandomBanana = () => {
  const min = 0;
  const max = AMOUNT_OF_BANANA_IMAGES - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const bananaRouter = router({
  getBananas: publicProcedure.query(() => {
    const [firstBananaId, secondBananaId] = getTwoRandomBananaImagesIds();
    return [
      {
        id: firstBananaId,
        imageUrl: `/bananaImages/${firstBananaId}.jpg`,
      },
      {
        id: secondBananaId,
        imageUrl: `/bananaImages/${secondBananaId}.jpg`,
      },
    ];
  }),
});
