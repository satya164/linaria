/* @flow */

export type NodePath = {
  node: Object,
  parent: Object,
  parentPath: NodePath,
  traverse: (visitor: { [key: string]: Function }) => void,
};

export type BabelTaggedTemplateElement = {
  value: {
    raw: string,
    cooked: string,
  },
};

export type BabelTaggedTemplateExpression = {
  tag: BabelIdentifier | BabelCallExpression | Object,
  quasi: {
    expressions: Object[],
    quasis: BabelTaggedTemplateElement[],
  },
};

export type BabelIdentifier = {
  name: string,
};

export type BabelMemberExpression = {
  object: BabelIdentifier,
  property: BabelIdentifier,
};

export type BabelCallExpression = {
  callee: BabelIdentifier,
  arguments: BabelStringLiteral[] | BabelIdentifier[],
};

export type BabelVariableDeclarator = {
  id: BabelIdentifier | Object,
  init: BabelCallExpression | Object,
};

export type BabelStringLiteral = {
  value: string,
};

export type BabelIsTypeFunction<T> = (value: T | Object) => boolean;
export type BabelNodeFactory<T> = (...args: mixed[]) => T;

export type BabelTypes = {
  templateElement: BabelNodeFactory<BabelTaggedTemplateElement>,
  callExpression: BabelNodeFactory<BabelCallExpression>,
  identifier: BabelNodeFactory<BabelIdentifier>,
  stringLiteral: BabelNodeFactory<BabelStringLiteral>,
  memberExpression: BabelNodeFactory<BabelMemberExpression>,
  isTaggedTemplateExpression: BabelIsTypeFunction<
    BabelTaggedTemplateExpression
  >,
  isCallExpression: BabelIsTypeFunction<BabelCallExpression>,
  isMemberExpression: BabelIsTypeFunction<BabelMemberExpression>,
  isIdentifier: BabelIsTypeFunction<BabelIdentifier>,
};

export type ImportStatement = {
  source: string,
  isDefault: boolean,
  name: string,
  esmInterop?: boolean,
};

export type State = {
  imports: ImportStatement[],
  filename: string,
  file: Object,
};
