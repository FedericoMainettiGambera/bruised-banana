import { Banana } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import BananaImage from "../components/BananaImage";
import { calcPercentage } from "../utils/calcPercentage";
import { trpc } from "../utils/trpc";

const ResultsPage: NextPage = () => {
  const { data: bananas, isLoading, isError } = trpc.banana.results.useQuery();

  if (isError) {
    return (
      <div>
        Something went wrong. I have no time to fix stupid problems. Reload the
        page.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-yellow-banana">
        <Image src="/banana.png" alt="pixel banana" width={80} height={80} />
        <div className="pt-4 text-xl">LOADING...</div>
      </div>
    );
  }

  const highestRank = bananas[0]?.rating || 1200;
  const lowestRank = bananas[bananas.length - 1]?.rating || 1200;

  return (
    <div className="relative min-h-screen w-scree">
      <div
        className="fixed mb-4 flex w-full flex-row items-center justify-between bg-yellow-banana"
        style={{ borderBottom: "2px solid black", top: 0, zIndex: 10 }}
      >
        <div className="justify-center flex w-full flex-row items-center py-3 text-2xl">
          <Link href="/">
            <a>&lt; BACK TO VOTING</a>
          </Link>
        </div>
      </div>
      <div className="pt-10"/>
      {bananas.map((banana, index) => (
        <div key={banana.id}>
          <div className="mt-10 flex w-full flex-col items-center justify-center">
            {index === 0 ? (
              <span className="mb-2 flex flex-row items-center justify-center">
                <Image
                  src="/banana.png"
                  alt="pixel banana"
                  width={45}
                  height={45}
                />
                <span className="ml-2 text-4xl">N° {index + 1}</span>
              </span>
            ) : (
              ""
            )}
            <div className={`flex flex-${index !== 0 ? "row" : "col"}`}>
              <BananaImage banana={banana} halfWidth={index !== 0} />
              <div className={`flex flex-col ${index !== 0 ? "ml-3" : ""}`}>
                {index !== 0 ? (
                  <span className="mb-2 flex flex-row">
                    <Image
                      src="/banana.png"
                      alt="pixel banana"
                      width={30}
                      height={30}
                    />
                    <span className="ml-2 text-2xl">N° {index + 1}</span>
                  </span>
                ) : (
                  ""
                )}
                <span>
                  <span className="whitespace-nowrap text-2xl">
                    {(
                      calcPercentage(banana.rating, lowestRank, highestRank) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                  <span className="s">
                    {" "}
                    ({banana.rating} / {highestRank})
                  </span>
                </span>
                <span className="text-xl">
                  Totale scontri: {banana.totalFights}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
