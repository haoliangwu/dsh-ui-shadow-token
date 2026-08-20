/**
 * Package-owned invariant companion for `dsh-ui-shadow-token`.
 * @module dsh-ui-shadow-token/invariant
 */

import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-ui-shadow-token'

/** Cordis companion plugin name. */
export const name = 'ui-shadow-token-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the shadowed slot registration is an effect owned and
 * observed by the slot registry; disposal is exercised through the public
 * slot system.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns The installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
