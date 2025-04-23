
import { LucideProps } from "lucide-react";
import { BsGoogle } from "react-icons/bs";
import { ComponentType } from "react";

export type Icon = ComponentType<LucideProps>;

export const Icons = {
  google: BsGoogle as unknown as Icon,
};
