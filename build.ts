import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  external: ['react', 'sortablejs'],
  sourcemap: 'external',
  plugins: [
    dts()
  ]
})