import { Banana } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { calcPercentage } from "../utils/calcPercentage";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const bananaPairQuery = trpc.banana.bananaPair.useQuery();
  const voteMutation = trpc.banana.fight.useMutation({
    onSuccess: () => {
      bananaPairQuery.refetch();

      scrollToCenter();
    },
  });

  const scrollToCenter = () => {
    if (!votingContainer) {
      return;
    }
    votingContainer.scrollLeft =
      (votingContainer.scrollWidth - window.innerWidth) / 2;
  };

  useEffect(() => {
    scrollToCenter();
  }, [bananaPairQuery.fetchStatus]);

  const [votedBanana, setVotedBanana] = useState<Banana | null>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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

  const calcBackgroundColorOnPercentage = (percentage: number) => {
    const yellowBanana = { red: 254, green: 218, blue: 30 };
    const orange = { red: 254, green: 183, blue: 30 };

    return `rgb(${
      yellowBanana.red * (1 - percentage) + orange.red * percentage
    }, ${yellowBanana.green * (1 - percentage) + orange.green * percentage}, ${
      yellowBanana.blue * (1 - percentage) + orange.blue * percentage
    })`;
  };

  useEffect(() => {
    if (voteMutation.isLoading) {
      return;
    }

    if (firstBananaScrollPercentage >= 0.98) {
      voteFirst();
    }

    if (secondBananaScrollPercentage >= 0.98) {
      voteSecond();
    }
  }, [firstBananaScrollPercentage, secondBananaScrollPercentage]);

  if (bananaPairQuery.isError) {
    return (
      <div>
        Something went wrong. I have no time to fix stupid problems. Reload the
        page.
      </div>
    );
  }
  if (bananaPairQuery.isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-yellow-banana">
        <Image src="/banana.png" alt="pixel banana" width={80} height={80} />
        <div className="pt-4 text-xl">LOADING...</div>
      </div>
    );
  }

  if (voteMutation.isLoading) {
    if (!votedBanana) {
      return <div />;
    }
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-green-success">
        <BananaItem banana={votedBanana} />
        <div className="pt-4 text-4xl">VOTING</div>
      </div>
    );
  }

  const { firstBanana, secondBanana } = bananaPairQuery.data;

  const voteFirst = () => {
    setVotedBanana(firstBanana);
    voteMutation.mutate({
      winnerId: firstBanana.id,
      loserId: secondBanana.id,
    });
  };
  const voteSecond = () => {
    setVotedBanana(secondBanana);
    voteMutation.mutate({
      winnerId: secondBanana.id,
      loserId: firstBanana.id,
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        background: `linear-gradient(90deg, ${calcBackgroundColorOnPercentage(
          firstBananaScrollPercentage
        )}, #FEDA1E 35%, #FEDA1E 65%, ${calcBackgroundColorOnPercentage(
          secondBananaScrollPercentage
        )} 100%)`,
      }}
    >
      <div className="flex flex-col items-center justify-center" ref={titleRef}>
        <div
          className="flex w-full flex-row items-center justify-between"
          style={{ borderBottom: "2px solid black" }}
        >
          <div className="whitespace-nowrap pl-3 text-2xl">
            % {(firstBananaScrollPercentage * 100).toFixed(0)}
          </div>
          <div className="flex flex-row items-center justify-center py-3 text-xl">
            <span className="whitespace-nowrap">IN QUALE IL</span>
            <span className="flex items-center justify-center px-2">
              <Image
                src="/banana.png"
                alt="pixel banana"
                width={30}
                height={30}
              />
            </span>
            <span className="whitespace-nowrap">È PIÙ BRUTTO?</span>
          </div>
          <div className="whitespace-nowrap pr-3 text-2xl">
            {(secondBananaScrollPercentage * 100).toFixed(0)} %
          </div>
        </div>
        <div className="pt-2 text-xl">&lt; &lt; SWIPE TO CHOSE &gt; &gt;</div>
      </div>
      <div
        className="flex items-center justify-center"
        style={{
          height: `${
            window.innerHeight -
            (titleRef.current?.scrollHeight || 0) -
            (footerRef.current?.scrollHeight || 0)
          }px`,
        }}
      >
        <div
          className="my-auto flex flex-row items-center items-stretch overflow-x-scroll"
          ref={setVotingContainerRef}
        >
          {bananaPairQuery.isFetching ? (
            ""
          ) : (
            <div
              className="flex flex-row justify-between whitespace-nowrap"
              style={{
                minWidth: "80vw",
              }}
              ref={firstChoosing}
            >
              <span className="flex w-full items-center justify-between pr-1 text-2xl">
                <Image
                  src="/banana.png"
                  alt="pixel banana"
                  width={60}
                  height={60}
                />
                {firstBananaScrollPercentage < 0.18 ? (
                  <span>&lt; &lt; &lt;</span>
                ) : firstBananaScrollPercentage < 0.33 ? (
                  <span>&lt; &lt; &lt; CHOSE</span>
                ) : firstBananaScrollPercentage < 0.55 ? (
                  <span>&lt; &lt; &lt; ALMOST THERE</span>
                ) : firstBananaScrollPercentage < 0.8 ? (
                  <span>&lt; &lt; &lt; KEEP SCROLLING</span>
                ) : (
                  <span>&lt; &lt; YOU ARE ABOUT TO VOTE</span>
                )}
              </span>
            </div>
          )}
          <BananaItem
            className="mr-4"
            banana={firstBanana}
            isLoading={bananaPairQuery.isFetching}
          />
          <BananaItem
            className="ml-4"
            banana={secondBanana}
            isLoading={bananaPairQuery.isFetching}
          />
          {bananaPairQuery.isFetching ? (
            ""
          ) : (
            <div
              className="flex flex-row justify-between whitespace-nowrap"
              style={{
                minWidth: "80vw",
              }}
              ref={secondChoosing}
            >
              <span className="flex w-full items-center justify-between pl-1 text-2xl">
                {secondBananaScrollPercentage < 0.18 ? (
                  <span>&gt; &gt; &gt;</span>
                ) : secondBananaScrollPercentage < 0.33 ? (
                  <span>CHOSE &gt; &gt; &gt;</span>
                ) : secondBananaScrollPercentage < 0.55 ? (
                  <span>ALMOST THERE &gt; &gt; &gt;</span>
                ) : secondBananaScrollPercentage < 0.8 ? (
                  <span>KEEP SCROLLING &gt; &gt; &gt;</span>
                ) : (
                  <span>YOU ARE ABOUT TO VOTE &gt; &gt;</span>
                )}
                <Image
                  src="/banana.png"
                  alt="pixel banana"
                  width={60}
                  height={60}
                />
              </span>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex w-full flex-row items-center justify-center"
        ref={footerRef}
      >
        <Link href="/results">
          <a className="pb-2 text-xl">RESULTS</a>
        </Link>
      </div>
    </div>
  );
};

const BananaItem: React.FC<{
  banana: Banana;
  className?: string;
  isLoading?: boolean;
}> = ({ banana, className, isLoading = false }) => {
  const calcWidth = () => {
    const isMobile = window.innerWidth < window.innerHeight;

    if (isMobile) {
      return window.innerWidth * 0.8;
    }

    return window.innerWidth * 0.3;
  };
  return (
    <div
      className={`${className} bg-black`}
      style={{
        width: `${calcWidth()}px`,
        minWidth: `${calcWidth()}px`,
        height: `${(calcWidth() * 3) / 2}px`,
        minHeight: `${(calcWidth() * 3) / 2}px`,
        position: "relative",
        border: "5px solid rgb(254, 183, 30)",
      }}
    >
      <Image
        src={isLoading ? "/banana.png" : banana.imageUrl}
        alt="A bruised banana"
        layout={"fill"}
        objectFit={"contain"}
      />
    </div>
  );
};

export default Home;
