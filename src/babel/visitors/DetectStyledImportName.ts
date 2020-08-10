/* eslint-disable no-param-reassign */
/**
 * This Visitor checks if import of `linaria/react` was renamed and stores that information in state
 */

import { types as t } from '@babel/core';
import type { ImportDeclaration } from '@babel/types';
import type { NodePath } from '@babel/traverse';
import type { State } from '../types';

export default function DetectStyledImportName(
  path: NodePath<ImportDeclaration>,
  state: State
) {
  if (!t.isLiteral(path.node.source, { value: 'linaria/react' })) {
    return;
  }

  path.node.specifiers.forEach((specifier) => {
    if (!t.isImportSpecifier(specifier)) {
      return;
    }
    if (specifier.local.name !== specifier.imported.name) {
      state.file.metadata.localName = specifier.local.name;
    }
  });
}
