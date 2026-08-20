/**
 * Shadow renderer for the `assistant-step` kind: renders the stock assistant
 * content (text blocks via MarkdownText, others as fallback rows) inside a
 * wrapper that adds a per-message token badge when usage is available.
 *
 * Props arrive through the four shares exactly like the default
 * AssistantNodeView — ChatNodeViewProps<Kind> is the exported contract from
 * ui-conversation's `/client` entry. `node.data` is AssistantChatData:
 * status/turn/step/blocks/time/usage?/finalNode?. `usage` is typed `unknown`
 * and carries a TokenUsage at runtime; read it with the same defensive
 * narrowing the in-repo turn-metrics.ts uses.
 */
import { memo } from 'react'
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { AssistantBlock } from '@deepseek-ai/dsh-client-runtime/client'
import css from './ShadowAssistantView.module.css'

/**
 * Full props of the shadowed `assistant-step` entry. ChatNodeViewProps bakes
 * PropsLocale<'conversation'> (the default entry's namespace); this entry
 * registers under its own `shadow-token` namespace, so compose the same
 * shares with the matching locale.
 */
type ShadowTokenProps = PropsRuntime<'conversation.chat.node', 'assistant-step'> & PropsLocale<'shadow-token'>

/** Defensive token usage read, mirroring ui-conversation turn-metrics.ts. */
interface UsageLike {
  inputTokens?: number
  outputTokens?: number
}

function readUsage(usage: unknown): UsageLike | undefined {
  if (typeof usage !== 'object' || usage === null) return undefined
  const value = usage as UsageLike
  return typeof value.inputTokens === 'number' && typeof value.outputTokens === 'number'
    ? value
    : undefined
}

/** Render one assistant block; text uses MarkdownText, the rest are fallback rows. */
function BlockRow({ block, streaming }: { block: AssistantBlock; streaming: boolean }) {
  switch (block.kind) {
    case 'text':
      return <MarkdownText text={block.text} streaming={streaming} />
    case 'reasoning':
      return <div className={css.reasoning}>reasoning · {block.text.length} chars</div>
    case 'tool-call':
      return <div className={css.toolCall}>🛠 {block.name}</div>
    case 'image':
      return <div className={css.image}>🖼 image attachment</div>
    default:
      return <div className={css.other}>unknown block</div>
  }
}

/** The shadowed assistant-step renderer with the token badge. */
export const ShadowAssistantView = memo(function ShadowAssistantView({
  node, t,
}: ShadowTokenProps) {
  const data = node.data
  const usage = readUsage(data.finalNode?.usage ?? data.usage)
  return (
    <div className={css.wrap}>
      <div className={css.body}>
        {data.blocks.map((block, index) => (
          <BlockRow key={index} block={block} streaming={data.status === 'running'} />
        ))}
      </div>
      {usage !== undefined && (
        <div className={css.badge} title={t('tooltip')}>
          ⚡ {t('tokens', { output: usage.outputTokens, input: usage.inputTokens })}
        </div>
      )}
    </div>
  )
})
