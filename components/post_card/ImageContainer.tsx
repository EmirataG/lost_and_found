import Image from "next/image";
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const ImageContainer = ({ urls }: { urls: string[] }) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [arrowsShown, setArrowsShown] = useState<boolean>(false);
  const lastIndex = urls.length - 1;
  const currentImage = urls[imageIndex];

  return (
    <>
      <div
        className="relative h-[300px] w-full overflow-hidden rounded-lg bg-black/70 sm:h-[350px] lg:h-[400px]"
        onMouseEnter={() => setArrowsShown(true)}
        onMouseLeave={() => setArrowsShown(false)}
      >
        <div className="absolute inset-0 z-0 rounded-lg bg-black/60" />

        <Image
          src={currentImage}
          alt="post image"
          fill
          className="z-10 cursor-pointer object-cover select-none"
          onClick={() => setExpanded(true)}
        />

        {urls.length > 1 ? (
          <>
            <FaArrowAltCircleLeft
              size={32}
              color="white"
              className={`absolute top-1/2 left-2 z-20 -translate-y-1/2 cursor-pointer transition-all duration-300 ${arrowsShown ? "opacity-100" : "pointer-events-none opacity-0"} `}
              onClick={(event) => {
                event.stopPropagation();
                setImageIndex((prev) => (prev <= 0 ? lastIndex : prev - 1));
              }}
            />

            <FaArrowAltCircleRight
              size={32}
              color="white"
              className={`absolute top-1/2 right-2 z-20 -translate-y-1/2 cursor-pointer transition-all duration-300 ${arrowsShown ? "opacity-100" : "pointer-events-none opacity-0"} `}
              onClick={(event) => {
                event.stopPropagation();
                setImageIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));
              }}
            />
          </>
        ) : null}
      </div>

      {/* Expanded fullscreen modal */}
      {expanded && (
        <ExpandedImageContainer
          urls={urls}
          currentIndex={imageIndex}
          close={() => setExpanded(false)}
        />
      )}
    </>
  );
};

const ExpandedImageContainer = ({
  urls,
  currentIndex,
  close,
}: {
  urls: string[];
  currentIndex: number;
  close: () => void;
}) => {
  const [imageIndex, setImageIndex] = useState<number>(currentIndex);
  const lastIndex = urls.length - 1;
  const currentImage = urls[imageIndex];
  return (
    <div
      className="absolute top-0 left-0 z-50 flex h-screen w-screen items-center justify-between gap-6 bg-black/70 p-6 backdrop-blur-sm"
      onClick={close}
    >
      <FaArrowAltCircleLeft
        size={36}
        color="white"
        className={`cursor-pointer hover:scale-105 active:scale-95 ${
          urls.length <= 1 ? "invisible" : ""
        }`}
        onClick={(event) => {
          event.stopPropagation();
          setImageIndex((prevImageIndex) =>
            prevImageIndex <= 0 ? lastIndex : prevImageIndex - 1,
          );
        }}
      />
      <div className="flex overflow-hidden bg-amber-100 shadow-lg">
        <Image
          src={currentImage}
          alt={"post image"}
          width={500}
          height={500}
          className="flex-1 select-none"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
      <FaArrowAltCircleRight
        size={36}
        color="white"
        className={`cursor-pointer hover:scale-105 active:scale-95 ${
          urls.length <= 1 ? "invisible" : ""
        }`}
        onClick={(event) => {
          event.stopPropagation();
          setImageIndex((prevImageIndex) =>
            prevImageIndex >= lastIndex ? 0 : prevImageIndex + 1,
          );
        }}
      />
    </div>
  );
};

export default ImageContainer;
