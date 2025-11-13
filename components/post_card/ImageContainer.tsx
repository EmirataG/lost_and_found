import Image from "next/image";
import { useState } from "react";

import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

const ImageContainer = ({ urls }: { urls: string[] }) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [arrowsShown, setArrowsShown] = useState<boolean>(false);
  const lastIndex = urls.length - 1;
  const currentImage = urls[imageIndex];

  return (
    <>
      <div
        className="flex items-center justify-center relative bg-black/70 rounded-lg bg-cover bg-center bg-blend-overlay"
        onMouseEnter={() => setArrowsShown(true)}
        onMouseLeave={() => setArrowsShown(false)}
      >
        <div className="w-full h-full absolute z-0">
          <Image
            src={currentImage}
            alt={"post image"}
            width={500}
            height={500}
            className="object-cover blur-lg w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-black/60 z-0 rounded-lg" />
        <FaArrowAltCircleLeft
          size={32}
          color="white"
          className={`absolute cursor-pointer hover:scale-105 active:scale-95 left-2 z-2 transition-all duration-300 ${
            arrowsShown
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={(event) => {
            event.stopPropagation();
            setImageIndex((prevImageIndex) =>
              prevImageIndex <= 0 ? lastIndex : prevImageIndex - 1
            );
          }}
        />
        <div className="overflow-hidden flex size-110">
          <Image
            src={currentImage}
            alt={"post image"}
            width={500}
            height={500}
            className="cursor-pointer object-cover flex-1 select-none z-1"
            onClick={() => setExpanded(true)}
          />
        </div>
        <FaArrowAltCircleRight
          size={32}
          color={"white"}
          className={`absolute cursor-pointer hover:scale-105 active:scale-95 right-2 z-2 transition-all duration-300 ${
            arrowsShown
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={(event) => {
            event.stopPropagation();
            setImageIndex((prevImageIndex) =>
              prevImageIndex >= lastIndex ? 0 : prevImageIndex + 1
            );
          }}
        />
      </div>
      {expanded ? (
        <ExpandedImageContainer
          urls={urls}
          currentIndex={imageIndex}
          close={() => setExpanded(false)}
        />
      ) : null}
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
        className="cursor-pointer hover:scale-105 active:scale-95"
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
        className="cursor-pointer hover:scale-105 active:scale-95"
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
