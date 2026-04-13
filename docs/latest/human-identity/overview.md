# Human Identity Overview

**Human Identity by Wallarm** is a client-side solution that detects and blocks automated behavior targeting your web and mobile applications. It verifies that each request to a protected action originates from a real user — not a bot, script, or emulator.

## How it works

Human Identity operates as an agent on the client side — a JavaScript library in the browser or a native SDK in a mobile app. It collects environment signals, sends them to the Human Identification Server (hosted and managed by Wallarm), and receives a signed verdict.

The verdict can then be enforced by Wallarm's modules or by your own backend logic.

## Two products

Human Identity covers two platforms, each with its own detection approach:

| | [Web Antibot](web-antibot.md) | [Mobile Antibot](mobile-antibot.md) |
| --- | --- | --- |
| **Where it runs** | Browser (JavaScript + WASM) | Native iOS / Android app (SDK) |
| **What it verifies** | Browser environment, rendering, behavior | Hardware integrity, device attestation |
| **Detection method** | Browser signal analysis, environment fingerprinting | Hardware-backed attestation (Android Key Attestation, iOS App Attest) |
| **Integration** | Add a JS snippet to your page | Integrate the SDK into your app |
| **Device identity** | `hid` — browser fingerprint | `device_hfp` — hardware device fingerprint |

Both products share the same goal: verify the client before the action is processed. The difference is how they achieve it — browser signals for web, hardware attestation for mobile.

## Use cases

Human Identity is most effective for protecting high-value actions:

* **Account takeover (ATO)** — credential stuffing, brute force attacks on login endpoints
* **Fake account creation** — automated registration at scale
* **Checkout and inventory abuse** — automated purchasing, hoarding
* **Password reset abuse** — automated reset flow exploitation
* **Any critical action** — forms, coupons, voting, and other sensitive operations

## Enforcement

Human Identity does not block requests on its own — it provides a verdict. You choose how to enforce it:

* **Wallarm modules** — pass the device identity through a [session context parameter](../api-sessions/overview.md) and use Wallarm's [Brute Force Protection](../admin-en/configuration-guides/protecting-against-bruteforce.md), [Session Denylist](../api-sessions/blocking.md), [API Abuse Prevention](../api-abuse-prevention/overview.md), and other mechanisms to block by device fingerprint
* **Your own backend** — verify the token and apply your own logic (block, step-up authentication, tagging)

## Get started

* [Web Antibot](web-antibot.md) — protect browser-based actions with a JavaScript library
* [Mobile Antibot](mobile-antibot.md) — protect native iOS/Android apps with hardware-backed device attestation

To enable Human Identity, contact [sales@wallarm.com](mailto:sales@wallarm.com?subject=Human%20Identity%20inquiry).
