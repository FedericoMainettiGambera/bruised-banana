import type { NextPage } from "next";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, refetch, isLoading, isError } =
    trpc.banana.getBananas.useQuery();

  const { mutate: vote } = trpc.banana.voteBanana.useMutation();

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { firstBanana, secondBanana } = data;

  return (
    <>
      <div>Quale banana è più brutta?</div>
      <div
        onClick={() => {
          vote({
            votedForId: firstBanana.id,
            votedAgainstId: secondBanana.id,
          });
          refetch();
        }}
      >
        <Image
          src={firstBanana.imageUrl}
          alt="A bruised banana"
          width={200}
          height={300}
        />
      </div>
      <div
        onClick={() => {
          vote({
            votedForId: secondBanana.id,
            votedAgainstId: firstBanana.id,
          });
          refetch();
        }}
      >
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
