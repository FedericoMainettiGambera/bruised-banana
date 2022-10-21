import { NextPage } from "next";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const ResultsPage: NextPage = () => {
  const { data: bananas, isLoading, isError } = trpc.banana.results.useQuery();

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>error</div>;
  }

  return (
    <div>
      <h1>Results</h1>
      {bananas.map((banana) => (
        <div key={banana.id}>
          <div>{banana.id}</div>
          <div>{banana.rating} ELO</div>
          <Image
            src={banana.imageUrl}
            alt="A bruised banana"
            width={40}
            height={60}
          />
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
