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
        className="
          relative w-full h-[300px] sm:h-[350px] lg:h-[400px]
          rounded-lg overflow-hidden
          bg-black/70
        "
        onMouseEnter={() => setArrowsShown(true)}
        onMouseLeave={() => setArrowsShown(false)}
      >
        <div className="absolute inset-0 bg-black/60 z-0 rounded-lg" />

        <Image
          src={currentImage}
          alt="post image"
          fill
          className="object-cover select-none cursor-pointer z-10"
          onClick={() => setExpanded(true)}
        />

        {urls.length > 1 ? (
          <>
            <FaArrowAltCircleLeft
              size={32}
              color="white"
              className={`
            absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer
            transition-all duration-300 z-20
            ${arrowsShown ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
              onClick={(event) => {
                event.stopPropagation();
                setImageIndex((prev) => (prev <= 0 ? lastIndex : prev - 1));
              }}
            />

            <FaArrowAltCircleRight
              size={32}
              color="white"
              className={`
            absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer
            transition-all duration-300 z-20
            ${arrowsShown ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
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
      className="p-6 gap-6 flex justify-between items-center absolute top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/70 z-50"
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
            prevImageIndex <= 0 ? lastIndex : prevImageIndex - 1
          );
        }}
      />
      <div className="bg-amber-100 overflow-hidden flex shadow-lg">
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
            prevImageIndex >= lastIndex ? 0 : prevImageIndex + 1
          );
        }}
      />
    </div>
  );
};

export default ImageContainer;
