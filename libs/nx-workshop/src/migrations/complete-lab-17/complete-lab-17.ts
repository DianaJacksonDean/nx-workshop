/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree, formatFiles } from '@nrwl/devkit';

export default async function update(host: Tree) {
  host.write(
    '.github/workflows/ci.yml',
    `
name: Run CI checks

on: [pull_request]

env:
  NX_BRANCH: \${{ github.event.number }}
  NX_RUN_GROUP: \${{ github.run_id }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Building affected apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - run: npm run nx affected -- --target=build --base=origin/master --parallel
  test:
    runs-on: ubuntu-latest
    name: Testing affected apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - run: npm run nx affected -- --target=test --base=origin/master --parallel
  lint:
    runs-on: ubuntu-latest
    name: Linting affected apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - run: npm run nx affected -- --target=lint --base=origin/master --parallel
  e2e:
    runs-on: ubuntu-latest
    name: E2E testing affected apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - run: npm run nx affected -- --target=e2e --base=origin/master --parallel
`
  );
  await formatFiles(host);
}
