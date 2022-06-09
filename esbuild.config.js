import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

export default ({ watch = false, production = false } = {}) =>
  build({
    bundle: true,
    entryPoints: ['./src/blade-runner.js', './src/blade-runner.scss'],
    outdir: 'dist',
    format: 'esm',
    logLevel: 'info',
    sourcemap: !production ? 'inline' : false,
    ignoreAnnotations: !production,
    minifyWhitespace: true,
    minifySyntax: true,
    drop: production ? ['console', 'debugger'] : [],
    watch,
    plugins: [
      sassPlugin({
        logger: {
          warn: () => '',
        },
      }),
      {
        name: 'external-files',
        setup(inBuild) {
          inBuild.onResolve({ filter: /(\.\/assets|\.\/fonts|\/systems|\/svg)/ }, () => {
            return { external: true };
          });
        },
      },
    ],
  });
