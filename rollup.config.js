import esbuild, { minify } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import size from 'rollup-plugin-size'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: `build/lib/index.js`,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [esbuild(), size(), minify()],
    external: ['rxjs'],
  },
  {
    input: 'src/index.ts',
    output: {
      file: `build/lib/index.esm.js`,
      format: 'es',
      sourcemap: true,
    },
    plugins: [esbuild(), size(), minify()],
    external: ['rxjs'],
  },
  {
    input: 'src/index.ts',
    output: {
      file: `build/lib/index.mjs`,
      format: 'es',
      sourcemap: true,
    },
    plugins: [esbuild(), size(), minify()],
    external: ['rxjs'],
  },
  {
    input: 'src/index.ts',
    output: {
      file: `build/lib/index.d.ts`,
      format: 'es',
      sourcemap: true,
    },
    plugins: [esbuild(), dts(), size()],
    external: ['rxjs'],
  },
]
