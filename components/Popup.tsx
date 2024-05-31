import { FC, ReactNode } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export const Popup: FC<Props> = ({ children, onClose }) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000AA] h-screen w-screen overflow-hidden flex items-center justify-center p-10"
      onClick={handleOverlayClick}
    >
      <div className="bg-white text-black p-6 flex flex-col rounded max-w-[600px] min-h-64 min-w-64">
        <div className="flex flex-row justify-between">
          <div />
          <button type="button" onClick={onClose}>
            <Cross2Icon />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
