import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  externals: ['ethers', '@safe-global/relay-kit', '@safe-global/safe-core-sdk-types'],
  outDir: 'dist',
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    emitCJS: true,
  },
})
