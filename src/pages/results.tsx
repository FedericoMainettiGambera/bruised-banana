import { Banana } from "@prisma/client";
import type { GetServerSideProps } from "next";
import Image from "next/image";

const ResultsPage: React.FC<{
  bananas: Banana[];
}> = ({ bananas }) => {
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

const getAllBananas = async () => {
  return (
    (await (
      await prisma?.banana.findMany({
        orderBy: {
          rating: "desc",
        },
      })
    )?.map((banana) => ({
      id: banana.id,
      imageUrl: banana.imageUrl,
      rating: banana.rating,
    }))) || []
  );
};

export const getStaticProps: GetServerSideProps = async () => {
  return {
    props: { bananas: await getAllBananas() },
    revalidate: 60,
  };
};
