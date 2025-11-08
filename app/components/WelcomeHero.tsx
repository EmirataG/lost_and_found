"use client";
import { TypeAnimation } from "react-type-animation";

const WelcomeHero = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex text-3xl">
        <p>Is your&nbsp;</p>
        <div className="flex-1">
          <TypeAnimation
            sequence={[
              "suite key",
              2500,
              "water bottle",
              2500,
              "student ID",
              2500,
              "charger",
              2500,
              "hoodie",
              2500,
              "wallet",
              2500,
              "umbrella",
              2500,
              "binder",
              2500,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-yaleBlue font-bold"
          />
        </div>
      </div>
      <h1 className="text-6xl font-semibold">
        Lost @ <span className="text-yaleBlue font-bold">Yale</span>?
      </h1>
      <p className="text-2xl">Maybe someone found it 🙏</p>
    </div>
  );
};

export default WelcomeHero;
