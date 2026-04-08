# Client‑Side Human Identification for Web

**Client‑Side Human Identification by Wallarm** cryptographically verifies that each request to your web application originates from a real browser operated by a human.

## Overview

**Client-Side Human Identification by Wallarm** uses a **Verify-then-Submit** architecture to ensure that critical actions are performed by real users.

Instead of relying on traffic patterns or signatures, it verifies the browser environment at the moment of action and provides a signed verdict (`human`, `suspicious`, or `bot`) for your backend to enforce.

**Layered protection**

| Level                               | What it does                                        | What it stops                           |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------- |
| **Level 1: Browser verification**   | Verifies the browser environment during the action. | Automated bots and scripts              |
| **Level 2: Browser identity (HID)** | Assigns a stable device identifier across sessions. | Repeated activity from the same browser |

## Role of Human Identity in the security stack

Human Identity introduces a capability for client-side verification of a real browser environment with cryptographic proof.

Public web applications always receive automated traffic. Bots interact with pages like real users — they load content, execute JavaScript, and click actions such as **Login**, **Sign up**, or **Checkout**.

These actions are not harmless. Bots use them to:

* Attempt account takeover (credential stuffing)
* Create fake accounts at scale
* Abuse checkout and inventory
* Probe endpoints to prepare attacks, etc.

Even when they do not complete the flow, they still create problems: security risks, increased costs, and distorted analytics (e.g., fake clicks on critical actions).

### Why existing defenses are not enough

WAF and API security tools each address a part of this problem: WAFs block known attack signatures, and API Abuse Prevention detects behavioral anomalies over time. But neither can verify on the first request whether the client is a real browser or a bot — especially when the bot uses a real browser engine.

**Human identification fills this gap** by cryptographically verifying the browser execution environment before the action is processed.

### Where human identification adds value

Human Identity can be used anywhere in your application, but is most effective for high-value actions:

| Use case                | What happens                                                    |
| ----------------------- | --------------------------------------------------------------- |
| **Login**               | Blocks credential stuffing before authentication is processed.   |
| **Checkout**            | Prevents automated purchases and inventory abuse.                |
| **Account creation**    | Stops large-scale fake account registration.                     |
| **Password reset**      | Prevents abuse of reset flows.                                   |
| **Any critical action** | Protects forms, coupons, voting, and other sensitive operations. |

Typical integration pattern:

* Call `start()` on page load
* Call `verify()` on the protected action
* Attach the JWT and validate it on the backend

## How it works

At a high level: a JavaScript library collects browser signals, a WASM engine processes and encrypts them, the server evaluates the result and returns a signed JWT, and your backend makes the final decision.

![How client‑side human identification works](../images/human-identity/human-identity-web.png)

### Step-by-step flow

1. **Load & start collection**
   Your page loads the `human-id.js` library asynchronously. It initializes a WASM engine, loads application-specific bytecode, and starts collecting browser signals (environment, rendering, behavior) in the background.

1. **Verify on user action**
   When the user triggers a protected action (e.g., login), your code calls `verify()`. The library finalizes collection, encrypts the signals, and sends them to the Human Identity server.

1. **Analysis & decision**
   The server runs detection checks in parallel, computes a risk score, and assigns a verdict: `human`, `suspicious`, or `bot`.

1. **Token issuance**
   The result is returned as a signed JWT (ES256) containing the verdict, score, and a stable device identifier (`hid`). The token is bound to the user-agent and IP to prevent replay.

1. **Submit & enforce**
   Your frontend attaches the JWT to the request. Your backend verifies the signature (via JWKS), checks expiration, and decides whether to allow, block, or step up authentication.

### Token

The Human Identity service does not enforce decisions — it returns a **signed JWT** that your backend must verify and act on.

The Human Identity JWT is signed with **ECDSA P-256 (ES256)** and contains the following claims:

| Claim | Type | Description |
| --- | --- | --- |
| `verdict` | string | `"human"`, `"suspicious"`, or `"bot"`. |
| `score` | float | Numeric risk score (0.0 = definitely human, higher = more suspicious). |
| `hid` | string | SHA-1 device fingerprint hash — stable across visits for the same browser/device. |
| `monitoring` | boolean | Present when the system is in monitoring mode (tokens issued even for bots). |
| `iat`, `exp` | timestamp | Token issue time and expiration. Tokens are short‑lived (~1 minute for login use case) to prevent relay and replay attacks. |

Your backend can verify the JWT signature using the public key available from the JWKS endpoint provided during integration setup.

### Mitigation and enforcement options

Once you verify the JWT on your backend, you can enforce any of the following actions:

| Action | Applies to | Description |
| --- | --- | --- |
| **Hard block** | `bot` verdict | Reject the request with `403 Forbidden`. |
| **Step‑up authentication** | `suspicious` verdict | Allow the request but require additional proof (MFA, CAPTCHA) before completing the action. |
| **Passive tagging** | All verdicts | Pass the request through. Attach the `verdict` and `score` to your internal request context for downstream logic (e.g., fraud scoring, audit logging). |
| **Monitoring mode** | All verdicts | Do not enforce anything. Tokens are issued for all requests (including bots) with a `monitoring` claim. Use this during initial rollout. |

## Setup

### Step 1: Get your credentials

Contact [sales@wallarm.com](mailto:sales@wallarm.com?subject=Human%20Identity%20for%20Web%20inquiry) to enable Human Identity. The Wallarm team will provision a server instance for your account and provide:

* **Human Identity endpoint** — the base URL depends on the chosen Wallarm Cloud region:

    * `https://human-id.us-hi.wallarm.com/` for the US Cloud
    * `https://human-id.eu-hi.wallarm.com/` for the EU Cloud
* **Application ID** (`APP_ID`) — identifies your application in the Human Identity system and links requests to your configuration.

You will use these credentials when initializing the Wallarm JavaScript library.

### Step 2: Add the Human Identity library to your pages

Add the `human-id.js` module to pages where you want to protect user actions:

=== "US Cloud"
    ```html
    <script type="module">
        import { start, stop, verify } from 'https://human-id.us-hi.wallarm.com/app/YOUR_APP_ID/js/engine.js';
        // Make functions available to your app
        window.__wallarmHID = { start, stop, verify };
    </script>
    ```
=== "EU Cloud"
    ```html
    <script type="module">
        import { start, stop, verify } from 'https://human-id.eu-hi.wallarm.com/app/YOUR_APP_ID/js/engine.js';
        // Make functions available to your app
        window.__wallarmHID = { start, stop, verify };
    </script>
    ```

Place the snippet in the `<head>` or before `</body>` on pages such as login, checkout, or account creation.

### Step 3: Start collecting browser signals

Before a user action can be verified, the system needs time to collect signals in the background.

Call `start()` when the user lands on a page where a protected action may happen (e.g., login or checkout).

=== "US Cloud"
    ```javascript
    await window.__wallarmHID.start(
        'https://human-id.us-hi.wallarm.com',   // Your Human Identity endpoint (US or EU)
        'YOUR_APP_ID',                // Application ID (UUID, provided by Wallarm)
        {
            timeout: 30000,            // Optional: request timeout in ms (default: 30000)
            quantum: 100,              // Optional: VM instructions per step (default: 100)
            getTokenFromServer: true   // Optional: return JWT (default: true)
        }
    );

    // Mouse movements and browser signals are now being collected in the background
    ```
=== "EU Cloud"
    ```javascript
    await window.__wallarmHID.start(
        'https://human-id.eu-hi.wallarm.com',   // Your Human Identity endpoint (US or EU)
        'YOUR_APP_ID',                // Application ID (UUID, provided by Wallarm)
        {
            timeout: 30000,            // Optional: request timeout in ms (default: 30000)
            quantum: 100,              // Optional: VM instructions per step (default: 100)
            getTokenFromServer: true   // Optional: return JWT (default: true)
        }
    );

    // Mouse movements and browser signals are now being collected in the background
    ```

From this point, the library runs silently — collecting environment and behavior signals while the user interacts with the page. There is no visible impact on the user experience.

### Step 4: Verify the action and attach the token

When the user performs a protected action (e.g., clicks "Login"), your code needs to do two things:

1. **Get the verdict from the Human Identity server** — call `verify()`. This sends the collected browser signals to the Human Identity server and returns a signed JWT with the verdict.
1. **Send the JWT to your backend** — attach the JWT to your regular request (e.g., the login request) so your backend can check the verdict and decide what to do.

The Wallarm library does not trigger these steps automatically — **your code decides when to call `verify()`**. You typically add it to your existing form submit handler or button click listener.

Here is what this looks like in code:

```javascript
async function onLoginSubmit(event) {
    event.preventDefault();

    // Step 4a: Get the verdict from the Human Identity server
    const jwt = await window.__wallarmHID.verify();

    if (!jwt) {
        // The Human Identity server did not return a token — handle as needed
        console.error('Human Identity verification failed');
        return;
    }

    // Step 4b: Send the JWT along with your login request to YOUR backend
    // The URL below is your own backend endpoint — you define it
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-HID-Token': jwt
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    });
}
```

`/api/login` in the example above is **your backend URL** — replace it with your actual endpoint. The Human Identity server does not know about your backend; the JWT is simply passed along with your existing request.

### Step 5: Validate the request on your backend

Your backend verifies the token and decides how to handle the request.

For each protected request:

1. Fetch the JWKS public key from the Human Identity server — the same endpoint you used in Steps 2–3:
    
    * US Cloud: `GET https://human-id.us-hi.wallarm.com/.well-known/jwks.json`
    * EU Cloud: `GET https://human-id.eu-hi.wallarm.com/.well-known/jwks.json`
1. Verify the JWT signature (ES256 / ECDSA P-256).
1. Check the `exp` claim — tokens are short‑lived (~1 minute).
1. Read the `verdict` claim and act accordingly:
    
    * `"human"` — allow the request.
    * `"suspicious"` — allow but consider step‑up authentication (e.g., MFA).
    * `"bot"` — reject the request.
1. Optionally, extract the `hid` claim (device fingerprint) to track and block repeat offenders by browser identity rather than by IP.

### Step 6: Test the integration

1. Open your protected page in a browser and complete the protected action (e.g., login).
1. In the browser DevTools (Network tab), verify that the `verify` request succeeds and returns a JWT.
1. Check that the JWT is attached to your login request.
1. Test with a headless browser or automation tool — the `verdict` in the returned token should be `"bot"`.

## JavaScript library reference

### `start(baseUrl, appID, options?)`

Initializes the WASM engine, loads bytecode, and begins background signal collection.

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| `baseUrl` | Yes | — | Human Identity endpoint URL (US or EU Cloud). |
| `appID` | Yes | — | Application ID (UUID), provided during onboarding. |
| `options.timeout` | No | `30000` | Request timeout in milliseconds. |
| `options.quantum` | No | `100` | VM instructions per execution step. |
| `options.getTokenFromServer` | No | `true` | If `true`, `verify()` returns a signed JWT. If `false`, returns raw signal data. |

### `verify()`

Stops collection, encrypts signals, sends them to the server (`POST /app/:appID/verify`), and returns the result.

**Returns:** `Promise<string | null>` — signed JWT on success, `null` on failure.

### `stop()`

Stops collection without sending data. Use when the user navigates away or cancels the action.

## Using with Wallarm Node

If your traffic passes through a [Wallarm Node](../installation/supported-deployment-options.md), you can extend the Human Identity integration with additional capabilities.

### Token validation and enforcement

The Wallarm Node can validate the Human Identity JWT at the edge. If the token verdict indicates a bot, the Node applies the action according to its [filtration mode](../admin-en/configure-wallarm-mode.md) — reducing the need for custom verification logic on your backend.

### Anonymous session tracking

The `hid` (device fingerprint) from the Human Identity JWT can be used as a [session context parameter](../api-sessions/overview.md) to track anonymous sessions by device identity — even before the user logs in and even when the attacker rotates IP addresses.

Combined with [API Abuse Prevention](../api-abuse-prevention/overview.md), this allows detecting distributed bot patterns across sessions identified by browser fingerprint rather than by IP address alone.

## Limitations

* **Action‑based, not site‑wide**: human identification protects specific user actions (button clicks, form submissions) — not passive page views. You can deploy it on any page that has a call‑to‑action, but there is no "wall page" mode that blocks all access until verified. For site‑wide bot protection of all traffic, use [API Abuse Prevention](../api-abuse-prevention/overview.md).
* **Token is short‑lived**: the JWT expires in approximately 1 minute. There is no token refresh mechanism. Each protected action requires a new `start()` → `verify()` cycle.
