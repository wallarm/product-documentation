#!/usr/bin/env python3
"""Assert _redirects stays inside Cloudflare's dynamic-rule budget.

Cloudflare caps a _redirects file at 100 "dynamic" rules and rejects the ENTIRE
deployment past it, not just the overflow:

    Maximum number of dynamic _redirects rules limit of 100 exceeded [100324]

The trap is what counts as dynamic. It is not "rules containing a wildcard" —
it is every rule appearing AFTER the first wildcard rule, whatever that rule
itself looks like. So one wildcard added high in the file silently reclassifies
hundreds of plain rules and breaks the deploy.

That is not visible in a diff, only in the whole file, so a human reviewer will
miss it. It has already happened once: six wildcard rules added mid-file took
the count from 34 to 155.

Keep plain path-to-path rules above the wildcard block at the end of the file.

Usage: scripts/check_redirects_budget.py docs/6.x/_redirects
"""
import re
import sys

CAP = 100
WARN_AT = 80


def is_dynamic(from_path: str) -> bool:
    return "*" in from_path or re.search(r":[A-Za-z]", from_path) is not None


def main() -> int:
    path = sys.argv[1] if len(sys.argv) > 1 else "docs/6.x/_redirects"
    try:
        lines = open(path).read().split("\n")
    except OSError as e:
        print(f"error: {e}", file=sys.stderr)
        return 2

    rules = [(n, l.strip()) for n, l in enumerate(lines, 1)
             if l.strip() and not l.strip().startswith("#")]

    first_dyn = next((i for i, (_, r) in enumerate(rules) if is_dynamic(r.split()[0])), None)
    if first_dyn is None:
        print(f"redirects budget: {len(rules)} rules, no wildcards, 0 charged")
        return 0

    charged = rules[first_dyn:]
    stragglers = [(n, r) for n, r in charged if not is_dynamic(r.split()[0])]

    print(f"redirects budget: {len(rules)} rules, {len(charged)} charged against "
          f"the cap of {CAP} (first wildcard at line {charged[0][0]})")

    if len(charged) > CAP:
        print(
            f"\nOver Cloudflare's limit by {len(charged) - CAP}. The deployment would be\n"
            f"rejected outright with error 100324.\n\n"
            f"{len(stragglers)} plain rules sit after the first wildcard and are being\n"
            f"charged as dynamic. Move the wildcard rules down to the block at the end\n"
            f"of the file, or move these plain rules above it:\n",
            file=sys.stderr)
        for n, r in stragglers[:15]:
            print(f"  line {n}: {r[:96]}", file=sys.stderr)
        if len(stragglers) > 15:
            print(f"  … and {len(stragglers) - 15} more", file=sys.stderr)
        return 1

    if len(charged) >= WARN_AT:
        print(f"warning: {CAP - len(charged)} of the budget left", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
