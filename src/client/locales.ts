/** `shadow-token` namespace dictionaries. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'tokens': 'in {input} / out {output}',
  'tooltip': '每条 assistant 消息的 token 消耗（来自节点 usage 数据）',
} satisfies Record<string, string>

/** English dictionary mirroring the Chinese key set. */
export const en: Record<keyof typeof zh, string> = {
  'tokens': 'in {input} / out {output}',
  'tooltip': 'Per-message token usage read from the node data',
}

/** The shadow-token namespace key union. */
export type TokenBadgeKey = keyof typeof zh
