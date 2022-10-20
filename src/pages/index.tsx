import type { NextPage } from "next";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const {
    data: bananas,
    isLoading,
    isError,
  } = trpc.banana.getBananas.useQuery();

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {bananas.map((banana) => (
        <div key={banana.id}>
          <h2>{banana.id}</h2>
          <Image
            src={banana.imageUrl}
            alt="A bruised banana"
            width={200}
            height={300}
          />
        </div>
      ))}
    </>
  );
};

export default Home;
