# Client‑Side Human Identification for Web

**Client‑Side Human Identification by Wallarm** verifies that each request to your web application originates from a real browser operated by a human.

## Overview

Human Identity is an agent-based (client-side JS) solution that detects and blocks automated behavior in web browsers. It verifies the browser environment at the moment of a user action and provides a signed verdict (`human`, `suspicious`, or `bot`).

Depending on your setup, the verdict can be enforced by a Wallarm Node or by your own backend logic.

## Where human identification adds value

Public web applications always receive automated traffic. Bots load content, execute JavaScript, and interact with pages like real users — clicking login, sign up, checkout, and other actions.

These actions are not harmless. Bots use them to:

* Attempt account takeover (credential stuffing)
* Create fake accounts at scale
* Abuse checkout and inventory
* Probe endpoints to prepare attacks, etc.

Even when they do not complete the flow, they still create problems: security risks, increased costs, and distorted analytics (e.g., fake clicks on critical actions).

Human Identity solves these problems by verifying the browser execution environment before the action is processed. It can be used anywhere in your application, but is most effective for high-value actions:

| Use case                | What happens                                                    |
| ----------------------- | --------------------------------------------------------------- |
| **Login**               | Blocks credential stuffing before authentication is processed.   |
| **Checkout**            | Prevents automated purchases and inventory abuse.                |
| **Account creation**    | Stops large-scale fake account registration.                     |
| **Password reset**      | Prevents abuse of reset flows.                                   |
| **Any critical action** | Protects forms, coupons, voting, and other sensitive operations. |

## How it works

At a high level: a JavaScript library collects browser signals, the Human Identification Server (hosted and managed by Wallarm) evaluates them and returns a signed JWT with a verdict. The verdict is then enforced — either by Wallarm's modules or by your own backend logic.

![How client‑side human identification works](../images/human-identity/human-identity-web.png)

### Step-by-step flow

1. **Load & collect signals**
   Your page loads the `engine.js` library asynchronously. It initializes a WASM engine, loads application-specific bytecode, and starts collecting browser signals (environment, rendering, behavior) in the background.

1. **Verify on user action**
   When the user triggers a protected action (e.g., login), your code calls `evaluate()`. The library finalizes collection and sends the signals to the Human Identification Server (hosted and managed by Wallarm).

1. **Analysis & decision**
   The server runs detection checks, computes a risk score, and assigns a verdict: `human`, `suspicious`, or `bot`.

1. **Token issuance**
   The result is returned as a signed JWT containing the verdict, score, and a stable device identifier (`hid`).

1. **Submit & enforce**
   Your frontend attaches the JWT to the request. The verdict can be enforced by Wallarm modules (brute force protection, API Abuse Prevention, session denylist — all scoped by the `hid` session parameter) or by your own backend logic.

### Token

The Human Identity service does not enforce decisions — it returns a **signed JWT**. The JWT contains the following claims:

| Claim | Type | Description |
| --- | --- | --- |
| `verdict` | string | `"human"`, `"suspicious"`, or `"bot"`. |
| `score` | float | Numeric risk score (0.0 = definitely human, higher = more suspicious). |
| `hid` | string | Device fingerprint — stable across visits for the same browser/device. |
| `monitoring` | boolean | Present when the solution is in monitoring mode (tokens issued even for bots). |
| `iat`, `exp` | timestamp | Token issue time and expiration. Tokens are short‑lived (~1 minute for login use case) to prevent relay and replay attacks. |

Enforcement is handled separately: by Wallarm modules (when the [`hid` is configured as a session context parameter](#step-3-enforce-the-verdict)) or by your own backend.

## Setup

### Step 1: Get your credentials

Contact [sales@wallarm.com](mailto:sales@wallarm.com?subject=Human%20Identity%20for%20Web%20inquiry) to enable Human Identity. The Wallarm team will provision a server instance for your account and provide:

* **Human Identification Server (HID) endpoint** — the base URL depends on the chosen [Wallarm Cloud](../about-wallarm/overview/#cloud) region:

    * `https://human-id.us-hi.wallarm.com/` for the US Cloud
    * `https://human-id.eu-hi.wallarm.com/` for the EU Cloud
* **Application ID** — identifies your application in the HIS and links requests to your configuration.

You will use these credentials when initializing the Wallarm JavaScript library.

### Step 2: Integrate the library and protect an action

Add the `engine.js` library to your page and wire it to the action you want to protect.

The library exports two main functions:

* `start(url, appID, options)` — initializes the WASM engine and begins collecting browser signals in the background. Call it when the page loads. The user sees nothing.
* `evaluate()` — finalizes signal collection, sends the data to the Human Identification Server, and returns a JWT token with the verdict (or `null` on failure). Call it when the user triggers the protected action (e.g., clicks "Login").

Below are 2 integration examples:

=== "HTML form submission"

    The simplest integration — the token is placed in a hidden form field and submitted with the form:

    ```html
    <form id="login-form" action="/login" method="POST">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="hidden" name="hid_token" id="hid-token">
        <button type="button" id="login-btn">Log In</button>
    </form>

    <script type="module">
    import { start, evaluate } from 'https://<HIS_URL>/app/<YOUR_APP_ID>/js/engine.js';

    await start('https://<HIS_URL>', '<YOUR_APP_ID>', { timeout: 10000 });

    document.getElementById('login-btn').addEventListener('click', async () => {
        const token = await evaluate();
        document.getElementById('hid-token').value = token || '';
        document.getElementById('login-form').submit();
    });
    </script>
    ```

=== "JS fetch with retry"

    For single-page applications — the token is sent as JSON, and if login fails, the library reinitializes for another attempt:

    ```html
    <form>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="button" id="login-btn">Log In</button>
        <p id="error" hidden></p>
    </form>

    <script type="module">
    import { start, evaluate } from 'https://<HIS_URL>/app/<YOUR_APP_ID>/js/engine.js';

    const reinit = () => start('https://<HIS_URL>', '<YOUR_APP_ID>', { timeout: 10000 });
    await reinit();

    document.getElementById('login-btn').addEventListener('click', async () => {
        const token = await evaluate();

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                hid_token: token
            }),
            signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            document.getElementById('error').textContent = 'Invalid credentials';
            document.getElementById('error').hidden = false;
            await reinit();
        }
    });
    </script>
    ```

* `<HIS_URL>` is your Human Identity endpoint provided by the Wallarm team
* `<YOUR_APP_ID>` is your Application ID provided by the Wallarm team

In both examples, the token is sent to your backend along with the login request — as a hidden form field or a JSON body property. From there, it can be enforced by Wallarm's modules or by your own backend logic.

### Step 3: Enforce the verdict

There are two approaches — choose based on your infrastructure:

=== "Wallarm modules"

    If your traffic passes through a [Wallarm Node](../installation/supported-deployment-options.md), you can use the `hid` from the token as a [session context parameter](../api-sessions/overview.md) — enabling enforcement by device fingerprint across Wallarm's modules.

    Set up session tracking by `hid`:

    1. **Store the JWT in a cookie.**

        Add the following code to your page alongside the code from Step 2. After calling `evaluate()`, store the full JWT in a cookie so that it is included in subsequent requests passing through the Node:

        ```javascript
        const token = await evaluate();
        if (token) {
            document.cookie = `wallarm_hid_token=${token}; path=/; secure; samesite=strict`;
        }
        ```

    1. **Add `hid` as a session context parameter.**

        In Wallarm Console, go to **API Sessions** → **Session context parameters** and [add](../api-sessions/setup.md#session-context) a new parameter. Set the path to the `hid` claim inside the JWT, e.g.:

        ![hid session context parameter in API sessions](../images/api-sessions/hid-context-parameter.png)

        Enable **Group sessions by this key** so that sessions are grouped by device fingerprint rather than by IP alone.

    Once `hid` is configured as a session context parameter, it becomes available across Wallarm's enforcement mechanisms. They can scope enforcement by `hid` — blocking by device fingerprint, not just by IP:

    * **Visibility**: in **API Sessions**, filter and inspect sessions grouped by `hid`. This reveals patterns invisible when grouping by IP — for example, the same browser rotating through multiple IPs.

        ![hid parameter in API session](../images/api-sessions/hid-parameter-in-session.png)
    * **Session denylist**: block a specific `hid` session via [Session Denylist](../api-sessions/blocking.md).
    * **API Abuse Prevention**: [API Abuse Prevention](../api-abuse-prevention/overview.md) analyzes behavioral patterns within sessions and blocks sessions by `hid`. When sessions are grouped by `hid`, the module can detect and block distributed bot campaigns that use a single browser across many IP addresses.
    * **Brute force protection**: configure a [Brute Force Protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) rule that limits login attempts per `hid`. If the same browser fingerprint exceeds the threshold, the session is blocked.

=== "Your own backend"

    Your backend verifies the token and decides how to handle the request.

    For each protected request:

    1. Fetch the JWKS public key from the Human Identification Server:

        * US Cloud: `GET https://human-id.us-hi.wallarm.com/.well-known/jwks.json`
        * EU Cloud: `GET https://human-id.eu-hi.wallarm.com/.well-known/jwks.json`
    1. Verify the JWT signature.
    1. Check the `exp` claim — tokens are short‑lived (~1 minute).
    1. Read the `verdict` claim and act accordingly:

        * `"human"` — allow the request.
        * `"suspicious"` — allow but consider step‑up authentication (e.g., MFA).
        * `"bot"` — reject the request.
    1. Optionally, extract the `hid` claim (device fingerprint) to track repeat offenders by browser identity rather than by IP.

### Step 4: Test the integration

**Verify that tokens are issued correctly:**

1. Open your protected page in a browser and complete the protected action (e.g., login).
1. In the browser DevTools (Network tab), verify that the `evaluate` request succeeds and returns a JWT.
1. Check that the JWT is attached to your login request.
1. Test with a headless browser or automation tool — the `verdict` in the returned token should be `"bot"`.

**Verify that enforcement works:**

* **Wallarm Node**: check that the `hid` cookie appears in requests passing through the Node. In Wallarm Console → **API Sessions**, confirm that sessions are grouped by `hid`. Then trigger a blocking rule (e.g., exceed the brute force threshold) and verify that the session is added to the Session Denylist and subsequent requests are blocked.
* **Your own backend**: send a request with a `"bot"` verdict token and confirm your backend rejects it. Send a request with a `"human"` verdict token and confirm it passes.

