import Container from "@/components/container";
import ThemeSwitch from "@/components/themeSwitch";
import Image from "next/image";
import VercelLogo from "../public/img/vercel.svg";

export default function Footer(props) {
  return (
    <Container className="mt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="text-center text-sm">
        Copyright © {new Date().getFullYear()} {props?.copyright}. All
        rights reserved.
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="mt-5">
        
        </div>
        <ThemeSwitch />
      </div>
    </Container>
  );
}
