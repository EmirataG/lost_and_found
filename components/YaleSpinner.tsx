import Image from "next/image";
import yaleLogo from "@/public/images/yale_logo.png";

const YaleSpinner = ({ width = 64 }) => {
  return (
    <Image
      src={yaleLogo}
      alt="Yale logo"
      width={width}
      className="animate-spin"
    />
  );
};

export default YaleSpinner;
