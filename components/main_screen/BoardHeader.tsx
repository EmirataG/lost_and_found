import { AiOutlineMenuUnfold } from "react-icons/ai";

const BoardHeader = ({
  menuShown,
  OpenMenu,
}: {
  menuShown: boolean;
  OpenMenu: () => void;
}) => {
  return (
    <header className="shadow-lg sticky top-0 bg-white p-4 flex justify-between items-center z-10">
      <AiOutlineMenuUnfold
        size={28}
        className={`md:invisible hover:scale-105 active:scale-95 transition-all duration-400 ${
          menuShown ? "invisible" : ""
        }`}
        onClick={OpenMenu}
      />

      <h1 className="text-3xl font-semibold text-center">
        Lost @ <span className="text-yaleBlue font-bold">Yale</span>
      </h1>
      <AiOutlineMenuUnfold size={28} className="invisible" />
    </header>
  );
};

export default BoardHeader;
