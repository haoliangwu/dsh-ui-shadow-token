# dsh-ui-shadow-token

DSH web chat plugin: shows each assistant message's input/output token usage
as a small badge in the message's top-right corner.

It shadows the keyed `conversation.chat.node` slot's `assistant-step` entry at
slot priority `-1` — the same key, a lower absolute priority, so the default
renderer stays in the ledger as an inert fallback and this entry wins every
render. The stock assistant content is preserved; only the token badge is
added.

## Install

```sh
dsh plugin --profile web add github:haoliangwu/dsh-ui-shadow-token
dsh web
```

The plugin is pure client rendering: the host half is an empty `apply`, all
behavior lives in `./client`. No model-visible input, no session-log events.

## Development

```sh
pnpm install
pnpm build       # tsdown: lib/index.js (node half) + lib/client.js (browser bundle)
pnpm typecheck   # tsc --noEmit
```

For a local mount without publishing:

```sh
ln -s "$PWD" ~/.dsh/profiles/web/node_modules/dsh-ui-shadow-token
dsh web --patch ./cordis.patch.yml
```

(The patch row's `name` is a bare package name; the profile must be able to
resolve it from `~/.dsh/profiles/web/node_modules`. Remove the symlink to
uninstall.)
