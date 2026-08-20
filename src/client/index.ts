/**
 * dsh-ui-shadow-token, browser half: shadows the keyed
 * `conversation.chat.node` slot's `assistant-step` entry at priority -1,
 * wrapping the stock assistant rendering with a per-message token badge.
 *
 * Why priority -1: keyed slot occupancy throws on same-key same-priority
 * duplicates (ui-slots register), while a lower absolute priority shadows the
 * default (lowest renders). The default `assistant-step` entry registers at
 * priority 0; our entry at -1 wins every render, and the default stays in
 * the ledger as an inert fallback.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ui-conversation SlotMap merge (the chat.node seat) and
// the ChatNodeViewProps<Kind> contract.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { ShadowAssistantView } from './ShadowAssistantView.tsx'
import { en, zh, type TokenBadgeKey } from './locales.ts'

export type { TokenBadgeKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The shadow token badge copy. */
    'shadow-token': TokenBadgeKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'shadow-token'

/** Required services: the slot registry and the badge's copy. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the dictionaries and the shadow entry for the
 * `assistant-step` kind at priority -1 (below the default's 0).
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-shadow-token: dictionaries')

  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register(
    { name: 'conversation.chat.node', key: 'assistant-step', priority: -1, locale: NS },
    ShadowAssistantView,
  ))
}
