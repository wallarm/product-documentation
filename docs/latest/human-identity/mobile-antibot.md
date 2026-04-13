# Client-Side Human Identification for Mobile

**Client-side human identification by Wallarm** for mobile verifies that API requests to your backend originate from a genuine, untampered mobile application running on a real physical device — not from an emulator, a rooted phone, or a repackaged app binary.

Integration requires adding a native SDK to your iOS or Android application. No proxy, no infrastructure changes — just an SDK initialization and a token attachment to your API calls. Your backend verifies the resulting JWT and decides how to act.

## What task does Human Identity for Mobile solve

| Layer | What it does | What it does not do |
| --- | --- | --- |
| **WAF / WAAP** | Blocks known attack signatures, provides rate limiting and IP filtering for API traffic. | Cannot verify whether the request comes from a real device or an emulator with a spoofed user-agent. |
| **[API Abuse Prevention](../api-abuse-prevention/overview.md)** | Detects bots by analyzing behavioral patterns across sessions server-side. | Cannot act on the first request. Cannot verify device integrity or app binary authenticity. |
| **[Human identification for Web](web-antibot.md)** | Verifies real browser execution via JS/WASM challenges. | Does not work inside native mobile apps — only in browsers. |
| **Human identification for Mobile** | Verifies device integrity via hardware attestation (Secure Enclave / StrongBox). Issues a cryptographic proof that the request comes from a genuine app on a genuine device. | Does not analyze traffic patterns. Does not work in mobile browsers — only in native apps with the SDK integrated. |

### Where Human Identity for Mobile adds value

Deploy in your **native iOS / Android application** to protect high-value actions:

* **Account Takeover (ATO) prevention** — verify that each login attempt comes from a real device, not an emulator farm.
* **API abuse prevention** — ensure every API call originates from the genuine, unmodified version of your app.
* **Fraud prevention** — block fake account creation and promotion abuse from scripted environments.

### How it differs from human identification for Web

These are **two separate products** that solve the same problem (proving the client is real) using fundamentally different approaches:

| | Web | Mobile |
| --- | --- | --- |
| **Where it runs** | In the browser (any device) | In a native iOS / Android app |
| **How it verifies** | JS/WASM challenge — analyzes browser environment, mouse movements, canvas, WebGL | Hardware attestation — cryptographic proof from device's Secure Enclave (iOS) or StrongBox/TEE (Android) |
| **What it proves** | "This is a real browser, not headless automation" | "This is a real device with the genuine, unmodified app" |
| **Obfuscation** | Yes — per-session unique bytecode | Not needed — security is rooted in hardware |
| **Key persistence** | None — each verification is independent | Yes — ECDSA key pair is generated in hardware and reused across sessions |
| **Request signing** | No | Yes — each API request is signed with the hardware-protected private key |
| **Protocol** | 1 request (`POST /app/:appID/verify`) | 2–3 requests (challenge → attestation → optional security checks) |

## How it works

The protocol follows a **challenge-response** model with hardware attestation:

```
                         +-----------------+
   User opens app  ----->| Your Mobile App |
                         | + Wallarm SDK   |
                         +-------+---------+
                                 |
                  1. SDK requests challenge
                                 |
                         +-------v---------+
                         | Human Identity   |
                         | Server           |
                         | POST /v1/m/hid/c |
                         +-------+---------+
                                 |
                  2. Server returns nonce +
                     key status (new/existing)
                                 |
                         +-------v---------+
                         | Device Hardware  |
                         | Secure Enclave / |
                         | StrongBox        |
                         +-------+---------+
                                 |
                  3. Hardware generates/proves
                     ECDSA key + attestation
                                 |
                         +-------v---------+
                         | Human Identity   |
                         | Server           |
                         | POST /v1/m/hid/v |
                         +-------+---------+
                                 |
                  4. Server verifies attestation,
                     returns JWT token
                                 |
                         +-------v---------+
                         | Your Backend     |
                         | (verify JWT via  |
                         |  JWKS endpoint)  |
                         +-------+---------+
                                / \
                      human   /     \   bot
                            /       \
                    +------v-+    +--v--------+
                    | Allow  |    | Block /   |
                    | request|    | step-up   |
                    +--------+    +-----------+
```

### Step-by-step flow

1. **Challenge** — the SDK sends a challenge request to the Human Identity server (`POST /v1/m/hid/c`) with the app ID, device ID, and platform. The server returns a cryptographic nonce and a key status: `new` (first time) or `existing` (returning device).

2. **Attestation or key proof** — depending on the key status:
    * **New device**: the SDK generates an ECDSA key pair inside the device's hardware security module (Secure Enclave on iOS, StrongBox/TEE on Android). The private key **never leaves the hardware** — it cannot be extracted even by the device owner. The SDK then requests a hardware attestation certificate from the OS and submits it to the server (`POST /v1/m/hid/v` with `type: "attestation"`).
    * **Returning device**: the SDK proves it still holds the previously registered private key by signing the challenge nonce (`POST /v1/m/hid/v` with `type: "key_proof"`). No full re-attestation needed.

3. **Server verification** — the server validates the attestation:
    * **Android**: verifies the X.509 certificate chain up to Google's root, parses the Key Attestation Extension (OID `1.3.6.1.4.1.11129.2.1.17`), checks security level (StrongBox/TEE), bootloader lock status, and nonce.
    * **iOS**: verifies the App Attest attestation object, validates the AAGUID (production vs. development), and checks the nonce.

4. **Token issuance** — on success, the server returns a signed JWT. On failure, the server issues a **blocked token** (rather than an error) so your backend can distinguish "verified as bot" from "never attempted verification".

5. **Request signing** — for subsequent API calls, the SDK signs each request body with the hardware-protected private key. Your backend receives two headers:
    * `X-HID-Token` — the JWT from step 4
    * `X-HID-Signature` — per-request signature proving the device still holds the private key

6. **Backend verification** — your backend verifies the JWT signature via the JWKS endpoint and optionally verifies the per-request signature.

### Optional: additional security checks

For applications that require deeper device analysis beyond hardware attestation, the server can respond with status `"pending"` and an encrypted payload of security checks for the SDK to execute on the device. The SDK runs these checks, encrypts the results, and submits them back (`POST /v1/m/hid/v` with `type: "check_results"`). This is configured per-application via server-side policy.

### Key technical properties

| Property | Details |
| --- | --- |
| **Hardware-rooted security** | Verification relies on the device's Secure Enclave (iOS) or StrongBox/TEE (Android). The attestation certificate is signed by Apple/Google — it cannot be faked by software. |
| **Persistent key registration** | The ECDSA key pair is generated once in hardware and reused across sessions. Returning devices only need to prove key ownership, not re-attest — faster and lighter. |
| **Per-request signing** | Beyond the initial attestation, each API request is signed with the hardware-protected private key, preventing token theft and replay attacks. |
| **Hardware Device Fingerprint (HFP)** | A SHA-256 hash of the attestation certificate chain's intermediate public key. Detects device spoofing when attackers fake `device_id` but share the same underlying hardware. |
| **Blocked tokens on failure** | Even when verification fails, a token with a "blocked" verdict is issued. This allows your backend to distinguish between "this device failed verification" and "this device never attempted verification". |
| **Zero PII collection** | The SDK collects only hardware attestation signals. No usernames, passwords, location data, or personal information. |

### Platform details

| | iOS | Android |
| --- | --- | --- |
| **Attestation mechanism** | App Attest via Secure Enclave | Key Attestation via StrongBox or TEE |
| **Security levels** | Production / Development (AAGUID-based) | StrongBox (highest) → TEE (default) → Software (rejected by default — key is publicly known in AOSP) |
| **What hardware proves** | App is genuine, device is real | App is genuine, device is real, bootloader is locked, OS integrity verified |
| **Key storage** | Secure Enclave — hardware-isolated | StrongBox (dedicated HSM) or TEE (ARM TrustZone) |

## What your backend receives

Human Identity for Mobile does not block anything itself. It returns a **signed JWT token** that your backend uses to make decisions.

### Token format

The JWT is signed with **ECDSA P-256 (ES256)** and contains:

| Claim | Description |
| --- | --- |
| `verdict` | `"human"` (attestation passed) or `"blocked"` (attestation failed) |
| `hid` | Device fingerprint — stable across sessions for the same device |
| `iat`, `exp` | Token issue time and expiration |

### What to do with the token

| Scenario | What your backend does |
| --- | --- |
| **Block bots** | Check `verdict` — reject requests with `"blocked"` verdict (emulators, rooted devices, tampered apps). |
| **Track devices** | Use `hid` as a stable device identifier — group requests by device, detect brute force from the same hardware even across IP rotations. |
| **Monitor first** | Start in monitoring mode — log verdicts without blocking to understand your traffic before enforcing. The server issues tokens for all requests including bots. |

!!! info "Blocked tokens"
    When device verification fails, the server **still issues a JWT** — but with a `"blocked"` verdict. This is intentional: it allows your backend to distinguish between "this device failed verification" (blocked token present) and "this device never attempted verification" (no token at all). Handle both cases in your backend logic.

!!! warning "Current limitation"
    In the current implementation, Human Identity operates in **monitoring mode only**. Blocking must be implemented on your backend by verifying the JWT and acting on the `verdict` claim. Native enforcement via the Wallarm Node is planned for a future release.

## Setup

### Step 1: Get your credentials

Contact [sales@wallarm.com](mailto:sales@wallarm.com?subject=Human%20Identity%20for%20Mobile%20inquiry) to enable Human Identity. The Wallarm team will provision a server instance and provide:

* **Server URL** — the base URL of your Human Identity Mobile endpoint
* **Application ID** (`APP_ID`) — identifies your application in the system
* **SDK access** — credentials for the SDK package repository

**Supported platforms**: iOS 14+ / Android API level 24+ (Android 7.0+).

### Step 2: Add the SDK

=== "iOS (Swift)"

    Add the Wallarm SDK via Swift Package Manager or CocoaPods:

    ```swift
    // Swift Package Manager
    .package(url: "https://github.com/wallarm/human-identity-ios", from: "1.0.0")
    ```

=== "Android (Kotlin)"

    Add the Wallarm SDK via Gradle:

    ```kotlin
    // build.gradle.kts
    dependencies {
        implementation("com.wallarm:human-identity:1.0.0")
    }
    ```

### Step 3: Initialize the SDK

=== "iOS (Swift)"

    ```swift
    import WallarmHumanIdentity

    @main
    class AppDelegate: UIResponder, UIApplicationDelegate {
        func application(
            _ application: UIApplication,
            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
        ) -> Bool {
            WallarmHID.initialize(appId: "YOUR_APP_ID")
            return true
        }
    }
    ```

=== "Android (Kotlin)"

    ```kotlin
    import com.wallarm.hid.WallarmHID

    class MyApplication : Application() {
        override fun onCreate() {
            super.onCreate()
            WallarmHID.initialize(this, appId = "YOUR_APP_ID")
        }
    }
    ```

### Step 4: Get a token and attach it to requests

Before each protected API call, request a token from the SDK. The SDK handles the full challenge-response flow (challenge → attestation/key proof → token) internally:

=== "iOS (Swift)"

    ```swift
    func performLogin(username: String, password: String) async throws {
        let token = try await WallarmHID.getToken()

        var request = URLRequest(url: URL(string: "https://api.example.com/login")!)
        request.httpMethod = "POST"
        request.setValue(token, forHTTPHeaderField: "X-HID-Token")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(
            LoginRequest(username: username, password: password)
        )

        let (data, response) = try await URLSession.shared.data(for: request)
    }
    ```

=== "Android (Kotlin)"

    ```kotlin
    suspend fun performLogin(username: String, password: String) {
        val token = WallarmHID.getToken()

        val request = Request.Builder()
            .url("https://api.example.com/login")
            .post(
                """{"username":"$username","password":"$password"}"""
                    .toRequestBody("application/json".toMediaType())
            )
            .header("X-HID-Token", token)
            .build()

        val response = okHttpClient.newCall(request).execute()
    }
    ```

!!! tip "Network layer integration"
    For apps using a centralized network layer (Alamofire, Retrofit, OkHttp interceptors), add the token in a single interceptor rather than in every API call.

### Step 5: Verify the token on your backend

1. Fetch the JWKS public key: `GET <server_url>/.well-known/jwks.json`
1. Verify the JWT signature (ES256 / ECDSA P-256).
1. Check the `exp` claim.
1. Read the `verdict` claim:
    * `"human"` — allow the request.
    * `"blocked"` — reject or flag the request.
1. Optionally, extract the `hid` claim to track the device across sessions.

### Step 6: Test the integration

1. Launch your app on a **real device** and complete a protected action.
1. Verify that the `X-HID-Token` header is present in the API request.
1. Decode the JWT — the `verdict` should be `"human"`.
1. Test with an **emulator** — the `verdict` should be `"blocked"`.

## Limitations

* **Native apps only**: human identification for mobile works only inside native iOS and Android applications with the SDK integrated. It does not work in mobile browsers — for mobile web, use [human identification for Web](web-antibot.md).
* **Per-action verification**: each protected action requires a challenge-response cycle. The token is short-lived and designed for a single action (login, checkout), not for protecting all API calls across an entire user session.
* **Monitoring mode only**: in the current implementation, all enforcement must be implemented on your backend. The Wallarm Node cannot yet block requests based on the mobile human identification verdict.
* **No direct backend communication**: the human identification server does not push verdicts to your backend. Your app must relay the JWT, and your backend must verify it independently.
* **Hardware dependency**: attestation quality depends on the device hardware. Older Android devices without StrongBox fall back to TEE (less secure). Devices with software-only attestation are rejected by default.

## Related resources

* [Human Identification for Web](web-antibot.md) — browser-based JS/WASM verification for web applications
* [API Abuse Prevention](../api-abuse-prevention/overview.md) — server-side behavioral bot detection
