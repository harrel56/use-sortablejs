import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  external: ['react', 'sortablejs'],
  sourcemap: 'external',
  plugins: [
    dts()
  ],
})

await Bun.write("./build/README.md", Bun.file("../README.md"))
await Bun.write("./build/LICENSE", Bun.file("../LICENSE"))