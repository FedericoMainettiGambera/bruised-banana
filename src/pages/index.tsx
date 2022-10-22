import { Banana } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { calcPercentage } from "../utils/calcPercentage";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const bananaPairQuery = trpc.banana.bananaPair.useQuery();
  const voteMutation = trpc.banana.fight.useMutation({
    onSuccess: () => {
      bananaPairQuery.refetch();
      if (!votingContainer) {
        return;
      }

      votingContainer.scrollLeft =
        (votingContainer.scrollWidth - window.innerWidth) / 2;
    },
  });

  const [votingContainer, setVotingContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [votingScroll, setVotingScroll] = useState(0);
  const firstChoosing = useRef<HTMLDivElement>(null);
  const secondChoosing = useRef<HTMLDivElement>(null);
  const [firstBananaScrollPercentage, setFirstBananaScrollPercentage] =
    useState(0);
  const [secondBananaScrollPercentage, setSecondBananaScrollPercentage] =
    useState(0);

  const setVotingContainerRef = useCallback((node: HTMLDivElement) => {
    if (!node || !window) {
      return;
    }
    node.scrollLeft = (node.scrollWidth - window.innerWidth) / 2;
    node.addEventListener("scroll", () => {
      setVotingScroll(node.scrollLeft);
    });
    setVotingContainer(node);
  }, []);

  useEffect(() => {
    if (
      !votingContainer ||
      !secondChoosing.current ||
      !firstChoosing.current ||
      !window
    ) {
      return;
    }

    if (votingScroll > firstChoosing.current.scrollWidth) {
      setFirstBananaScrollPercentage(0);
    } else {
      setFirstBananaScrollPercentage(
        calcPercentage(
          firstChoosing.current.scrollWidth - votingScroll,
          0,
          firstChoosing.current.scrollWidth
        )
      );
    }

    const second0Value =
      votingContainer.scrollWidth -
      secondChoosing.current?.scrollWidth -
      window.innerWidth;
    const second1Value = votingContainer.scrollWidth - window.innerWidth;
    setSecondBananaScrollPercentage(
      calcPercentage(votingScroll, second0Value, second1Value)
    );
  }, [votingScroll]);

  useEffect(() => {
    if (firstBananaScrollPercentage === 1) {
      voteFirst();
    }

    if (secondBananaScrollPercentage === 1) {
      voteSecond();
    }
  }, [firstBananaScrollPercentage, secondBananaScrollPercentage]);

  if (bananaPairQuery.isError) {
    return <div>Something went wrong</div>;
  }
  if (bananaPairQuery.isLoading) {
    return <div>Loading Bananas...</div>;
  }
  const { firstBanana, secondBanana } = bananaPairQuery.data;

  const voteFirst = () => {
    voteMutation.mutate({
      winnerId: firstBanana.id,
      loserId: secondBanana.id,
    });
  };
  const voteSecond = () => {
    voteMutation.mutate({
      winnerId: secondBanana.id,
      loserId: firstBanana.id,
    });
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-center py-3">
        <span className="pr-1">IN QUALE IL</span>
        <Image src="/banana.png" alt="pixel banana" width={30} height={30} />
        <span>È PIÙ BRUTTO?</span>
      </div>
      <div
        className="flex flex-row items-center overflow-x-scroll"
        ref={setVotingContainerRef}
      >
        <div
          className="whitespace-nowrap bg-yellow-banana text-right"
          style={{
            minWidth: "100vw",
            backgroundColor: `rgba(254, 218, 30, ${firstBananaScrollPercentage})`,
          }}
          onClick={voteFirst}
          ref={firstChoosing}
        >
          choosing {(firstBananaScrollPercentage * 100).toFixed(0)}%
        </div>
        <BananaItem banana={firstBanana} />
        <BananaItem banana={secondBanana} />
        <div
          className="whitespace-nowrap bg-yellow-banana text-left"
          style={{
            minWidth: "100vw",
            backgroundColor: `rgba(254, 218, 30, ${secondBananaScrollPercentage})`,
          }}
          onClick={voteSecond}
          ref={secondChoosing}
        >
          choosing {(secondBananaScrollPercentage * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

const BananaItem: React.FC<{
  banana: Banana;
  className?: string;
}> = ({ banana, className }) => {
  return (
    <div
      className={`${className} rounded-2xl bg-yellow-banana`}
      style={{
        width: `${window.innerWidth}px`,
        minWidth: `${window.innerWidth}px`,
        height: `${(window.innerWidth * 3) / 2}px`,
        minHeight: `${(window.innerWidth * 3) / 2}px`,
        position: "relative",
      }}
    >
      <Image
        src={banana.imageUrl}
        alt="A bruised banana"
        layout={"fill"}
        objectFit={"contain"}
      />
    </div>
  );
};

export default Home;
