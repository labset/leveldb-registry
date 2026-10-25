## environment

I use **[mise](https://mise.jdx.dev/)** to manage the toolchain. It pins both
node and pnpm (see `.mise.toml`).

```bash
brew install mise
```

## development setup

- create a fork of the repo, clone it, and install the toolchain

```bash
cd leveldb-registry
mise install
```

- install the dependencies

```bash
pnpm install
```

- build it in watch mode

```bash
pnpm build --watch
```

## checks

```bash
pnpm test          # run the test suite
pnpm lint          # lint with eslint
pnpm format:check  # check formatting with prettier
```
