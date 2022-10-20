import type { NextPage } from "next";
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
          <img src={banana.imageUrl} alt="A bruised banana" />
        </div>
      ))}
    </>
  );
};

export default Home;
