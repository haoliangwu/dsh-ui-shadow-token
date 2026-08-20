window.__ModuleLoader__.load({
	id: "dsh-ui-shadow-token",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/haoliang.wu/lyon/learn/dsh/dsh-ui-shadow-token/src/client/ShadowAssistantView.module.css.mjs
		const css = ".E6RFvq_wrap{padding-top:28px;position:relative}.E6RFvq_body{flex-direction:column;gap:6px;display:flex}.E6RFvq_badge{z-index:1;text-overflow:ellipsis;white-space:nowrap;max-width:40%;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;position:absolute;top:8px;right:8px;overflow:hidden}.E6RFvq_reasoning{color:var(--dsw-alias-label-tertiary);font-size:12px}.E6RFvq_toolCall{font-family:var(--dsw-font-mono,monospace);color:var(--dsw-alias-label-secondary);font-size:12px}.E6RFvq_image{color:var(--dsw-alias-label-secondary);font-size:12px}.E6RFvq_other{color:var(--dsw-alias-label-tertiary);font-size:12px}";
		const tagId = "dsh-ui-shadow-token/ShadowAssistantView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-shadow-token";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var ShadowAssistantView_module_css_default = {
			"other": "E6RFvq_other",
			"badge": "E6RFvq_badge",
			"body": "E6RFvq_body",
			"toolCall": "E6RFvq_toolCall",
			"image": "E6RFvq_image",
			"wrap": "E6RFvq_wrap",
			"reasoning": "E6RFvq_reasoning"
		};
		//#endregion
		//#region src/client/AssistantNodeView.tsx
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
		/** Frame-throttled visual update, inlined from ui-conversation. */
		function useThrottledVisualUpdate(update, intervalFrames = 3) {
			const updateRef = (0, react.useRef)(update);
			updateRef.current = update;
			const pendingRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => () => {
				if (pendingRef.current !== null) cancelAnimationFrame(pendingRef.current);
			}, []);
			return (0, react.useMemo)(() => {
				let remaining = intervalFrames;
				return () => {
					if (pendingRef.current !== null) return;
					remaining = intervalFrames;
					const advance = () => {
						remaining -= 1;
						if (remaining > 0) {
							pendingRef.current = requestAnimationFrame(advance);
							return;
						}
						pendingRef.current = null;
						updateRef.current();
					};
					pendingRef.current = requestAnimationFrame(advance);
				};
			}, [intervalFrames]);
		}
		function firstLine(text) {
			const nl = text.indexOf("\n");
			return nl === -1 ? text : text.slice(0, nl);
		}
		function latestLine(text) {
			const visible = text.trimEnd();
			const nl = visible.lastIndexOf("\n");
			return nl === -1 ? visible : visible.slice(nl + 1);
		}
		function ReasoningRow({ text, running, t }) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const summaryRef = (0, react.useRef)(null);
			const summary = running ? latestLine(text) : firstLine(text);
			const schedule = useThrottledVisualUpdate(() => {
				const el = summaryRef.current;
				if (el === null) return;
				el.scrollLeft = running ? el.scrollWidth - el.clientWidth : 0;
			});
			(0, react.useEffect)(() => {
				schedule();
			}, [
				running,
				schedule,
				summary
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-variant": "think",
				"data-state": running ? "running" : "ok",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14, { size: 14 }),
					title: "Think",
					open: expanded,
					expandable: true,
					expandOnRowClick: true,
					onToggle: () => {
						setExpanded((v) => !v);
					},
					collapsedContent: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						style: { margin: "0 6px" }
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						ref: summaryRef,
						style: {
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						"data-follow-end": running || void 0,
						children: summary
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							whiteSpace: "pre-wrap",
							fontSize: 12,
							color: "var(--dsw-alias-label-secondary)"
						},
						children: text
					})
				}), running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						position: "absolute",
						width: 1,
						height: 1,
						overflow: "hidden",
						clip: "rect(0,0,0,0)"
					},
					children: t("row.running") ?? ""
				})]
			});
		}
		/** Renderer that matches the in-repo AssistantMarkdown behavior for distribution parity. */
		const AssistantMarkdown = (0, react.memo)(function AssistantMarkdown({ blocks, streaming, interrupted, renderMessageImages, mentions, t }) {
			const codeLabels = (0, react.useMemo)(() => ({
				copyLabel: t("copy") ?? "copy",
				copiedLabel: t("copied") ?? "copied"
			}), [t]);
			const last = blocks.length - 1;
			if (!(streaming || interrupted === true || blocks.some((b) => b.kind !== "tool-call"))) return null;
			const rendered = [];
			for (let i = 0; i < blocks.length; i++) {
				const block = blocks[i];
				if (block === void 0) continue;
				switch (block.kind) {
					case "text":
						rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
							text: block.text,
							streaming,
							codeLabels,
							fileMentions: mentions
						}, i));
						break;
					case "reasoning":
						rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReasoningRow, {
							text: block.text,
							running: streaming && i === last,
							t
						}, i));
						break;
					case "image": {
						const start = i;
						const group = [block];
						while (i + 1 < blocks.length) {
							const next = blocks[i + 1];
							if (next === void 0 || next.kind !== "image") break;
							group.push(next);
							i += 1;
						}
						if (typeof renderMessageImages === "function") rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: renderMessageImages({
							images: group.map(({ attachment }) => ({ attachment })),
							align: "start"
						}) }, start));
						else rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ShadowAssistantView_module_css_default.image,
							children: "🖼 image attachment"
						}, start));
						break;
					}
					case "tool-call": break;
					default: rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.JsonBlock, {
						label: t("message.unknownBlock") ?? "unknown block",
						payload: block.block,
						truncatedLabel: (total) => t("json.truncated", { total }) ?? `truncated ${total}`
					}, i));
				}
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ShadowAssistantView_module_css_default.body,
				"data-streaming": streaming || void 0,
				children: [rendered, interrupted && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [" ", t("message.stopped") ?? "stopped"] })]
			});
		});
		/** Delegated assistant view — mirrors ui-conversation's AssistantNodeView for external hosts. */
		const AssistantNodeView = (0, react.memo)(function AssistantNodeView(props) {
			const p = props;
			const data = p.node.data;
			const turn = p.node.location.kind === "turn" || p.node.location.kind === "step" ? p.node.location.turn : void 0;
			const tail = typeof p.useTurnData === "function" ? p.useTurnData("turn-tail") : void 0;
			const owner = (0, react.useMemo)(() => {
				if (turn?.status !== "closed" || data.finalNode === void 0) return void 0;
				if (tail?.closing?.finalNode?.seq !== data.finalNode.seq) return void 0;
				return turn !== void 0 && data.finalNode !== void 0 ? {
					turn,
					seq: data.finalNode.seq,
					openFile: p.openFile
				} : void 0;
			}, [
				data.finalNode,
				p.openFile,
				tail,
				turn
			]);
			const mentions = (0, react.useMemo)(() => owner === void 0 || typeof p.fileMentions !== "function" ? void 0 : p.fileMentions(owner), [owner, p.fileMentions]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssistantMarkdown, {
				blocks: data.blocks,
				streaming: data.status === "running",
				interrupted: data.status === "interrupted",
				renderMessageImages: p.renderMessageImages,
				mentions,
				t: p.t
			});
		});
		//#endregion
		//#region src/client/ShadowAssistantView.tsx
		/**
		* Shadow renderer for the `assistant-step` kind: delegates to the full
		* AssistantNodeView (local copy for external distribution) inside a wrapper
		* that adds a per-message token badge when usage is available.
		*
		* Props mirror the in-repo @deepseek-ai/dsh-ui-shadow-token wrapper:
		* readUsage with inputTokens/outputTokens (+ promptTokens/completionTokens,
		* input/output, totalTokens fallbacks) and t('tokens', {input,output}).
		*/
		/**
		* Extract token counts from provider usage shapes.
		* @param usage - raw usage object from finalNode or node data.
		* @returns normalized counts or undefined when absent.
		*/
		function readUsage(usage) {
			if (usage === null || usage === void 0) return void 0;
			if (typeof usage !== "object") return void 0;
			const u = usage;
			const input = typeof u.inputTokens === "number" ? u.inputTokens : typeof u.promptTokens === "number" ? u.promptTokens : typeof u.input === "number" ? u.input : void 0;
			const output = typeof u.outputTokens === "number" ? u.outputTokens : typeof u.completionTokens === "number" ? u.completionTokens : typeof u.output === "number" ? u.output : void 0;
			const total = typeof u.totalTokens === "number" ? u.totalTokens : typeof u.total_tokens === "number" ? u.total_tokens : typeof u.total === "number" ? u.total : input !== void 0 && output !== void 0 ? input + output : void 0;
			if (input === void 0 && output === void 0 && total === void 0) return void 0;
			return {
				input,
				output,
				total
			};
		}
		/** The shadowed assistant-step renderer with the token badge — delegates to the full view. */
		const ShadowAssistantView = (0, react.memo)(function ShadowAssistantView(props) {
			const data = props.node.data;
			const usage = readUsage(data.finalNode?.usage ?? data.usage);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ShadowAssistantView_module_css_default.wrap,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AssistantNodeView, { ...props }), usage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: ShadowAssistantView_module_css_default.badge,
					title: props.t("tooltip"),
					children: props.t("tokens", {
						input: usage.input ?? 0,
						output: usage.output ?? 0
					})
				})]
			});
		});
		//#endregion
		//#region src/client/locales.ts
		/** `shadow-token` namespace dictionaries. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"tokens": "in {input} / out {output}",
			"tooltip": "每条 assistant 消息的 token 消耗（来自节点 usage 数据）"
		};
		/** English dictionary mirroring the Chinese key set. */
		const en = {
			"tokens": "in {input} / out {output}",
			"tooltip": "Per-message token usage read from the node data"
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "shadow-token";
		/** Required services: the slot registry and the badge's copy. */
		const inject = ["slots", "locale"];
		/**
		* Client plugin body: register the dictionaries and the shadow entry for the
		* `assistant-step` kind at priority -1 (below the default's 0).
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-shadow-token: dictionaries");
			ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
				name: "conversation.chat.node",
				key: "assistant-step",
				priority: -1,
				locale: NS
			}, ShadowAssistantView));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map