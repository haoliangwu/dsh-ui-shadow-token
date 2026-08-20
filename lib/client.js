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
		const css = ".E6RFvq_wrap{position:relative}.E6RFvq_body{flex-direction:column;gap:6px;display:flex}.E6RFvq_badge{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);white-space:nowrap;border-radius:999px;align-items:center;gap:4px;padding:1px 8px;font-size:11px;line-height:16px;display:inline-flex;position:absolute;top:-8px;right:12px}.E6RFvq_reasoning{color:var(--dsw-alias-label-tertiary);font-size:12px}.E6RFvq_toolCall{font-family:var(--dsw-font-mono,monospace);color:var(--dsw-alias-label-secondary);font-size:12px}.E6RFvq_image{color:var(--dsw-alias-label-secondary);font-size:12px}.E6RFvq_other{color:var(--dsw-alias-label-tertiary);font-size:12px}";
		const tagId = "dsh-ui-shadow-token/ShadowAssistantView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-shadow-token";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var ShadowAssistantView_module_css_default = {
			"image": "E6RFvq_image",
			"toolCall": "E6RFvq_toolCall",
			"other": "E6RFvq_other",
			"wrap": "E6RFvq_wrap",
			"body": "E6RFvq_body",
			"badge": "E6RFvq_badge",
			"reasoning": "E6RFvq_reasoning"
		};
		//#endregion
		//#region src/client/ShadowAssistantView.tsx
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
		function readUsage(usage) {
			if (typeof usage !== "object" || usage === null) return void 0;
			const value = usage;
			return typeof value.inputTokens === "number" && typeof value.outputTokens === "number" ? value : void 0;
		}
		/** Render one assistant block; text uses MarkdownText, the rest are fallback rows. */
		function BlockRow({ block, streaming }) {
			switch (block.kind) {
				case "text": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
					text: block.text,
					streaming
				});
				case "reasoning": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ShadowAssistantView_module_css_default.reasoning,
					children: [
						"reasoning · ",
						block.text.length,
						" chars"
					]
				});
				case "tool-call": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ShadowAssistantView_module_css_default.toolCall,
					children: ["🛠 ", block.name]
				});
				case "image": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: ShadowAssistantView_module_css_default.image,
					children: "🖼 image attachment"
				});
				default: return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: ShadowAssistantView_module_css_default.other,
					children: "unknown block"
				});
			}
		}
		/** The shadowed assistant-step renderer with the token badge. */
		const ShadowAssistantView = (0, react.memo)(function ShadowAssistantView({ node, t }) {
			const data = node.data;
			const usage = readUsage(data.finalNode?.usage ?? data.usage);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ShadowAssistantView_module_css_default.wrap,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: ShadowAssistantView_module_css_default.body,
					children: data.blocks.map((block, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlockRow, {
						block,
						streaming: data.status === "running"
					}, index))
				}), usage !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ShadowAssistantView_module_css_default.badge,
					title: t("tooltip"),
					children: ["⚡ ", t("tokens", {
						output: usage.outputTokens,
						input: usage.inputTokens
					})]
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