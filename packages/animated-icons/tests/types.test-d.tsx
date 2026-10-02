// Compile-time only (checked by `pnpm typecheck`): variants are unique per icon.
import { BellIcon, MessageIcon } from "../src"
import { defineIconConfig } from "../src/config"

export const ok = [<BellIcon key="a" variant="shake" />, <MessageIcon key="b" variant="typing" />]

// @ts-expect-error "typing" belongs to message, not bell
export const wrongVariant = <BellIcon variant="typing" />

defineIconConfig({
  icons: {
    bell: { variant: "ring" },
    // @ts-expect-error unknown bell variant in global config
    message: { variant: "ring" },
    "not-installed-yet": { trigger: "auto" },
  },
})
