//#region src/index.ts
/**
* dsh-ui-shadow-token, node half.
*
* Deliberately empty. The browser half (`./client`) registers a shadow entry
* of the keyed `conversation.chat.node` slot for the `assistant-step` kind at
* priority -1, adding a per-message token badge on top of the stock assistant
* rendering. The host half has nothing to do: this plugin is pure client.
*/
/** Host plugin body — this package is pure client rendering. */
function apply() {}
//#endregion
export { apply };
