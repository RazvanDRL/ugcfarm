import { ReactNode } from "react";
import localFont from 'next/font/local';

const Satoshi = localFont({
  src: './Satoshi-Variable.woff2',
  weight: '100 900',
  variable: '--font-satoshi',
});

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className={`text-4xl lg:text-5xl font-bold text-left ${Satoshi.className}`}>
      {children}
    </h1>
  );
}
