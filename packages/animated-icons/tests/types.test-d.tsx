// Compile-time only (checked by `pnpm typecheck`): variants are unique per icon.
import { Bell, BellIcon, Message } from "../src"
import { defineIconConfig } from "../src/config"

export const ok = [<Bell key="a" variant="shake" />, <Message key="b" variant="typing" />]

// @ts-expect-error "typing" belongs to message, not bell
export const wrongVariant = <Bell variant="typing" />

defineIconConfig({
  icons: {
    bell: { variant: "ring" },
    // @ts-expect-error unknown bell variant in global config
    message: { variant: "ring" },
    "not-installed-yet": { trigger: "auto" },
  },
})

// every icon is also exported as `<Name>Icon`, the same component, for name collisions
export const alias: typeof Bell = BellIcon
export const aliasKeepsVariants = <BellIcon variant="shake" />
// @ts-expect-error the alias carries the same variant types
export const aliasWrongVariant = <BellIcon variant="typing" />

// size is a global/per-icon setting, but an icon's own defaults can't carry it
defineIconConfig({ size: 20, icons: { bell: { size: "1.25em" } } })
export const sized = <Bell size={16} />
