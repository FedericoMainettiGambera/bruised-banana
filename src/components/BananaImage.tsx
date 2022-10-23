import { Banana } from "@prisma/client";
import Image from "next/image";

const BananaImage: React.FC<{
  banana: Banana;
  className?: string;
  isLoading?: boolean;
  halfWidth?: boolean;
}> = ({ banana, className, isLoading = false, halfWidth = false }) => {
  const calcWidth = () => {
    const isMobile = window.innerWidth < window.innerHeight;

    if (isMobile) {
      return (window.innerWidth * 0.8) / (halfWidth ? 2 : 1);
    }

    return (window.innerWidth * 0.3) / (halfWidth ? 2 : 1);
  };
  return (
    <div
      className={`border-black ${className}`}
      style={{
        width: `${calcWidth()}px`,
        minWidth: `${calcWidth()}px`,
        height: `${(calcWidth() * 3) / 2}px`,
        minHeight: `${(calcWidth() * 3) / 2}px`,
        position: "relative",
        borderWidth: `5px`,
        backgroundColor: "rgba(0,0,0,0.6)",
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

export default BananaImage;
