import { HTMLAttributes } from "react";
import ClockIcon from "./clock";
import PinIcon from "./pin";
import SpinIcon from "./spin";
import LoopIcon from "./loop";
import ArrowIcon from "./arrow";
import TrashIcon from "./trash";
import CloseIcon from "./close";
import DownloadIcon from "./download";
import CheckIcon from "./check";

type IconName =
  | "clock"
  | "close"
  | "pin"
  | "spin"
  | "loop"
  | "arrow"
  | "trash"
  | "download"
  | "check";

interface IconProps extends HTMLAttributes<SVGElement> {
  variant: IconName;
}

const Icon: React.FC<IconProps> = ({ variant, ...rest }) => {
  const icons: {
    [x: string]: React.FC<HTMLAttributes<SVGElement>>;
  } = {
    clock: ClockIcon,
    pin: PinIcon,
    spin: SpinIcon,
    loop: LoopIcon,
    arrow: ArrowIcon,
    trash: TrashIcon,
    close: CloseIcon,
    download: DownloadIcon,
    check: CheckIcon,
  };

  const IconComponent = icons[variant];

  return <IconComponent {...rest} />;
};

export default Icon;
