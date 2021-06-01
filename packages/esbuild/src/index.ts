/**
 * This file contains an esbuild loader for Linaria.
 * It uses the transform.ts function to generate class names from source code,
 * returns transformed code without template literals and attaches generated source maps
 */

import path from 'path';
import fs from 'fs';
import type { PluginOptions, Preprocessor } from '@linaria/babel-preset';
import { slugify, transform } from '@linaria/babel-preset';
import esbuild, { Plugin, TransformOptions } from 'esbuild';

type EsbuildPluginOptions = {
  sourceMap?: boolean;
  preprocessor?: Preprocessor;
  esbuildOptions?: TransformOptions;
} & Partial<PluginOptions>;

export default function linaria({
  sourceMap,
  preprocessor,
  esbuildOptions,
  ...rest
}: EsbuildPluginOptions = {}): Plugin {
  return {
    name: 'linaria',
    setup(build) {
      const cssLookup = new Map<string, string>();

      build.onResolve({ filter: /\.linaria\.css$/ }, (args) => {
        return {
          namespace: 'linaria',
          path: args.path,
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'linaria' }, (args) => {
        return {
          contents: cssLookup.get(args.path),
          loader: 'css',
        };
      });

      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, (args) => {
        const rawCode = fs.readFileSync(args.path, 'utf8');
        const { ext, name: filename } = path.parse(args.path);
        const { code } = esbuild.transformSync(rawCode, {
          ...esbuildOptions,
          loader: ext.replace(/^\./, '') as 'js' | 'jsx' | 'ts' | 'tsx',
        });
        const result = transform(code, {
          filename: args.path,
          preprocessor,
          pluginOptions: rest,
        });

        if (!result.cssText)
          return {
            loader: 'tsx',
            contents: code,
          };

        let { cssText } = result;

        const slug = slugify(cssText);
        const cssFilename = `${filename}_${slug}.linaria.css`;

        if (sourceMap && result.cssSourceMapText) {
          const map = Buffer.from(result.cssSourceMapText).toString('base64');
          cssText += `/*# sourceMappingURL=data:application/json;base64,${map}*/`;
        }

        cssLookup.set(cssFilename, cssText);

        return {
          contents: `
        import ${JSON.stringify(cssFilename)};
        ${result.code}`,
          loader: 'tsx',
        };
      });
    },
  };
}
