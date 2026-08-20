/**
 * Self-contained copy of the official assistant renderer for external distribution.
 * Mirrors packages/client/ui-conversation/src/client/chat/AssistantNodeView.tsx +
 * AssistantMarkdown.tsx + ReasoningRow.tsx so dsh-ui-shadow-token remains
 * fully equivalent when the host does not provide @deepseek-ai/dsh-client-ui-conversation.
 *
 * Imports stay within the healed profile baseline (react, runtime, primitives,
 * ui-slots) so the built lib/client.js requires no external runtime beyond the
 * platform table. Styling reuses ShadowAssistantView.module.css to avoid extra
 * CSS modules.
 */
import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react'
import type { AssistantBlock } from '@deepseek-ai/dsh-client-runtime/client'
import { DisclosureRow, IconThinkOutline14, JsonBlock, MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import css from './ShadowAssistantView.module.css'

type ShadowTokenProps = PropsRuntime<'conversation.chat.node', 'assistant-step'> & PropsLocale<'shadow-token'>

/** Frame-throttled visual update, inlined from ui-conversation. */
function useThrottledVisualUpdate(update: () => void, intervalFrames = 3): () => void {
  const updateRef = useRef(update)
  updateRef.current = update
  const pendingRef = useRef<number | null>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- stabilize cleanup
  useEffect(() => () => {
    if (pendingRef.current !== null) cancelAnimationFrame(pendingRef.current)
  }, [])
  return useMemo(() => {
    let remaining = intervalFrames
    return () => {
      if (pendingRef.current !== null) return
      remaining = intervalFrames
      const advance = (): void => {
        remaining -= 1
        if (remaining > 0) {
          pendingRef.current = requestAnimationFrame(advance)
          return
        }
        pendingRef.current = null
        updateRef.current()
      }
      pendingRef.current = requestAnimationFrame(advance)
    }
  }, [intervalFrames])
}

function firstLine(text: string): string {
  const nl = text.indexOf('\n')
  return nl === -1 ? text : text.slice(0, nl)
}

function latestLine(text: string): string {
  const visible = text.trimEnd()
  const nl = visible.lastIndexOf('\n')
  return nl === -1 ? visible : visible.slice(nl + 1)
}

function ReasoningRow({ text, running, t }: { text: string; running: boolean; t: (key: string, params?: Record<string, unknown>) => string }) {
  const [expanded, setExpanded] = useState(false)
  const summaryRef = useRef<HTMLSpanElement>(null)
  const summary = running ? latestLine(text) : firstLine(text)
  const schedule = useThrottledVisualUpdate(() => {
    const el = summaryRef.current
    if (el === null) return
    el.scrollLeft = running ? el.scrollWidth - el.clientWidth : 0
  })
  useEffect(() => { schedule() }, [running, schedule, summary])
  return (
    <div data-variant="think" data-state={running ? 'running' : 'ok'}>
      <DisclosureRow
        icon={<IconThinkOutline14 size={14} />}
        title="Think"
        open={expanded}
        expandable
        expandOnRowClick
        onToggle={() => { setExpanded(v => !v) }}
        collapsedContent={(
          <>
            <span aria-hidden style={{ margin: '0 6px' }} />
            <span ref={summaryRef} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} data-follow-end={running || undefined}>{summary}</span>
          </>
        )}
      >
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--dsw-alias-label-secondary)' }}>{text}</div>
      </DisclosureRow>
      {running && <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{(t as unknown as (k:string)=>string)('row.running') ?? ''}</span>}
    </div>
  )
}

/** Renderer that matches the in-repo AssistantMarkdown behavior for distribution parity. */
const AssistantMarkdown = memo(function AssistantMarkdown({
  blocks, streaming, interrupted, renderMessageImages, mentions, t,
}: {
  blocks: readonly AssistantBlock[]
  streaming: boolean
  interrupted?: boolean | undefined
  renderMessageImages: ((owner: { images: readonly { attachment: unknown }[]; align: 'start' | 'end' }) => unknown) | undefined
  mentions: unknown
  t: (key: string, params?: Record<string, unknown>) => string
}) {
  const codeLabels = useMemo(() => ({ copyLabel: t('copy') ?? 'copy', copiedLabel: t('copied') ?? 'copied' }), [t])
  const last = blocks.length - 1
  const hasVisible = streaming || interrupted === true || blocks.some(b => (b as { kind: string }).kind !== 'tool-call')
  if (!hasVisible) return null
  const rendered: unknown[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as AssistantBlock & { kind: string; text?: string; block?: unknown; attachment?: unknown; name?: string }
    if (block === undefined) continue
    switch (block.kind) {
      case 'text':
        rendered.push(
          <MarkdownText
            key={i}
            text={(block as { text: string }).text}
            streaming={streaming}
            codeLabels={codeLabels}
            fileMentions={mentions as never}
          />,
        )
        break
      case 'reasoning':
        rendered.push(<ReasoningRow key={i} text={(block as { text: string }).text} running={streaming && i === last} t={t} />)
        break
      case 'image': {
        const start = i
        const group: typeof block[] = [block]
        while (i + 1 < blocks.length) {
          const next = blocks[i + 1] as typeof block | undefined
          if (next === undefined || next.kind !== 'image') break
          group.push(next)
          i += 1
        }
        if (typeof renderMessageImages === 'function') {
          rendered.push(
            <Fragment key={start}>
              {renderMessageImages({
                images: group.map(({ attachment }) => ({ attachment: attachment as never })),
                align: 'start',
              }) as never}
            </Fragment>,
          )
        } else {
          rendered.push(<div key={start} className={css.image}>🖼 image attachment</div>)
        }
        break
      }
      case 'tool-call':
        break
      default:
        rendered.push(
          <JsonBlock
            key={i}
            label={t('message.unknownBlock') ?? 'unknown block'}
            payload={(block as { block: unknown }).block}
            truncatedLabel={total => t('json.truncated', { total }) ?? `truncated ${total}`}
          />,
        )
    }
  }
  return (
    <div className={css.body} data-streaming={streaming || undefined}>
      {rendered as never}
      {interrupted && <span> {(t as unknown as (k:string)=>string)('message.stopped') ?? 'stopped'}</span>}
    </div>
  )
})

/** Delegated assistant view — mirrors ui-conversation's AssistantNodeView for external hosts. */
export const AssistantNodeView = memo(function AssistantNodeView(props: ShadowTokenProps) {
  const p = props as unknown as {
    node: { data: { blocks: readonly AssistantBlock[]; status: string; finalNode?: { seq: number } }; location: { kind: string; turn?: unknown } }
    t: (key: string, params?: Record<string, unknown>) => string
    useTurnData?: (key: string) => unknown
    openFile?: (path: string) => void
    renderMessageImages?: (owner: { images: readonly { attachment: unknown }[]; align: 'start' | 'end' }) => unknown
    fileMentions?: (owner: unknown) => unknown
  }
  const data = p.node.data
  const turn = p.node.location.kind === 'turn' || p.node.location.kind === 'step'
    ? (p.node.location as { turn?: unknown }).turn as { status?: string } | undefined
    : undefined
  const tail = typeof p.useTurnData === 'function' ? p.useTurnData('turn-tail') as { closing?: { finalNode?: { seq?: number } } } | undefined : undefined
  const owner = useMemo(() => {
    if (turn?.status !== 'closed' || data.finalNode === undefined) return undefined
    if ((tail as unknown as { closing?: { finalNode?: { seq: number } } })?.closing?.finalNode?.seq !== data.finalNode.seq) return undefined
    return turn !== undefined && data.finalNode !== undefined ? { turn: turn as never, seq: data.finalNode.seq, openFile: p.openFile as never } : undefined
  }, [data.finalNode, p.openFile, tail, turn])
  const mentions = useMemo(
    () => owner === undefined || typeof p.fileMentions !== 'function' ? undefined : (p.fileMentions(owner as never) as unknown),
    [owner, p.fileMentions],
  )
  return (
    <AssistantMarkdown
      blocks={data.blocks}
      streaming={data.status === 'running'}
      interrupted={data.status === 'interrupted'}
      renderMessageImages={p.renderMessageImages}
      mentions={mentions}
      t={p.t}
    />
  )
})
