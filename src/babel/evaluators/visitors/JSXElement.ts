import type { NodePath } from '@babel/traverse';
import type { Function, JSXElement as JSXElementNode } from '@babel/types';
import { Core } from '../../babel';

function getFunctionName(
  { types: t }: Core,
  path: NodePath<Function>
): string | null {
  if (path.isClassMethod() && t.isIdentifier(path.node.key)) {
    return path.node.key.name;
  }

  return null;
}

export default function JSXElement(
  babel: Core,
  path: NodePath<JSXElementNode>
) {
  const { types: t } = babel;
  // JSX can be safely replaced on an empty fragment because it is unnecessary for styles
  const emptyFragment = t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    []
  );

  // We can do even more
  // If that JSX is a result of a function, we can replace the function body.
  const scopePath = path.scope.path;
  if (scopePath.isFunction()) {
    const emptyBody = t.blockStatement([t.returnStatement(emptyFragment)]);

    // Is it not just a function, but a method `render`?
    if (getFunctionName(babel, scopePath) === 'render') {
      const decl = scopePath.findParent((p) => p.isClassDeclaration());

      // Replace the whole component
      if (decl?.isClassDeclaration()) {
        decl.replaceWith(t.functionDeclaration(decl.node.id, [], emptyBody));

        return;
      }
    }

    const body = scopePath.get('body');
    if (Array.isArray(body)) {
      throw new Error(
        `A body of a function is expected to be a single element but an array was returned. It's possible if JS syntax has been changed since that code was written.`
      );
    }

    body.replaceWith(emptyBody);
  } else {
    path.replaceWith(emptyFragment);
  }
}
