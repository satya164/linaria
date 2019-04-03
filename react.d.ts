// TypeScript Version: 2.9

import * as React from 'react';

type CSSProperties = {
  [key: string]: string | number | CSSProperties;
};

type StyledComponent<T> = React.FunctionComponent<T & { as?: React.ElementType }>;

type StyledTag<T> = <Props = T>(
  strings: TemplateStringsArray,
  ...exprs: Array<string | number | CSSProperties | ((props: Props) => string | number)>
) => StyledComponent<Props>;

type StyledJSXIntrinsics = {
  readonly [P in keyof JSX.IntrinsicElements]: StyledTag<JSX.IntrinsicElements[P]>
};

export const styled: StyledJSXIntrinsics & {
  <T>(component: React.ElementType<T>): StyledTag<T>;

  readonly [key: string]: StyledTag<{
    children?: React.ReactNode;
    [key: string]: any;
  }>;
};
