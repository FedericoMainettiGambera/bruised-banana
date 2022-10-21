import type { NextPage } from "next";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const bananaPairQuery = trpc.banana.bananaPair.useQuery();

  const voteMutation = trpc.banana.round.useMutation({
    onSuccess: () => {
      bananaPairQuery.refetch();
    },
  });

  if (bananaPairQuery.isError) {
    return <div>Something went wrong</div>;
  }
  if (bananaPairQuery.isLoading) {
    return <div>Loading Bananas...</div>;
  }

  if (voteMutation.isError) {
    return <div>Error Voting</div>;
  }
  if (voteMutation.isLoading) {
    return <div>Voting...</div>;
  }

  const { firstBanana, secondBanana } = bananaPairQuery.data;

  return (
    <>
      <div>Quale banana è più brutta?</div>
      <div
        onClick={() => {
          voteMutation.mutate({
            winnerId: firstBanana.id,
            loserId: secondBanana.id,
          });
        }}
      >
        <h2>{firstBanana.rating}</h2>
        <Image
          src={firstBanana.imageUrl}
          alt="A bruised banana"
          width={200}
          height={300}
        />
      </div>
      <div
        onClick={() => {
          voteMutation.mutate({
            winnerId: secondBanana.id,
            loserId: firstBanana.id,
          });
        }}
      >
        <h2>{secondBanana.rating}</h2>
        <Image
          src={secondBanana.imageUrl}
          alt="A bruised banana"
          width={200}
          height={300}
        />
      </div>
    </>
  );
};

export default Home;
