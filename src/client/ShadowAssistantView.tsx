/**
 * Shadow renderer for the `assistant-step` kind: delegates to the full
 * AssistantNodeView (local copy for external distribution) inside a wrapper
 * that adds a per-message token badge when usage is available.
 *
 * Props mirror the in-repo @deepseek-ai/dsh-ui-shadow-token wrapper:
 * readUsage with inputTokens/outputTokens (+ promptTokens/completionTokens,
 * input/output, totalTokens fallbacks) and t('tokens', {input,output}).
 */
import { memo } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { AssistantNodeView } from './AssistantNodeView.tsx'
import css from './ShadowAssistantView.module.css'

/**
 * Full props of the shadowed `assistant-step` entry. ChatNodeViewProps bakes
 * PropsLocale<'conversation'>; this entry registers under its own
 * `shadow-token` namespace, so compose the same shares with the matching locale.
 */
type ShadowTokenProps = PropsRuntime<'conversation.chat.node', 'assistant-step'> & PropsLocale<'shadow-token'>

/**
 * Extract token counts from provider usage shapes.
 * @param usage - raw usage object from finalNode or node data.
 * @returns normalized counts or undefined when absent.
 */
function readUsage(usage: unknown): { total: number | undefined; input: number | undefined; output: number | undefined } | undefined {
  if (usage === null || usage === undefined) return undefined
  if (typeof usage !== 'object') return undefined
  const u = usage as Record<string, unknown>
  const input = typeof u.inputTokens === 'number' ? u.inputTokens
    : typeof u.promptTokens === 'number' ? u.promptTokens
    : typeof u.input === 'number' ? u.input
    : undefined
  const output = typeof u.outputTokens === 'number' ? u.outputTokens
    : typeof u.completionTokens === 'number' ? u.completionTokens
    : typeof u.output === 'number' ? u.output
    : undefined
  const total = typeof u.totalTokens === 'number' ? u.totalTokens
    : typeof u.total_tokens === 'number' ? u.total_tokens
    : typeof u.total === 'number' ? u.total
    : input !== undefined && output !== undefined ? input + output
    : undefined
  if (input === undefined && output === undefined && total === undefined) return undefined
  return { input, output, total }
}

/** The shadowed assistant-step renderer with the token badge — delegates to the full view. */
export const ShadowAssistantView = memo(function ShadowAssistantView(props: ShadowTokenProps) {
  const data = (props as unknown as { node: { data: { finalNode?: { usage?: unknown }; usage?: unknown } } }).node.data
  const usage = readUsage((data as { finalNode?: { usage?: unknown }; usage?: unknown }).finalNode?.usage ?? (data as { usage?: unknown }).usage)
  return (
    <div className={css.wrap}>
      <AssistantNodeView {...(props as unknown as Parameters<typeof AssistantNodeView>[0])} />
      {usage !== undefined && (
        <span className={css.badge} title={(props.t as unknown as (k:string)=>string)('tooltip')}>
          {(props.t as unknown as (key: string, params?: Record<string, unknown>) => string)('tokens', { input: usage.input ?? 0, output: usage.output ?? 0 })}
        </span>
      )}
    </div>
  )
})
