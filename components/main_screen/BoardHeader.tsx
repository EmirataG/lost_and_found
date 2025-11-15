import { AiOutlineMenuUnfold } from "react-icons/ai";

const BoardHeader = () => {
  return (
    <header className="shadow-lg sticky top-0 bg-white p-4 flex justify-center items-center z-10">
      <h1 className="text-3xl font-semibold text-center">
        Lost @ <span className="text-yaleBlue font-bold">Yale</span>
      </h1>
    </header>
  );
};

export default BoardHeader;
