# Client‑Side Human Identification for Mobile

**Human Identity by Wallarm** is a client-side service that verifies whether requests to your applications come from real users or automated tools. It covers web and mobile platforms — this article describes the **Mobile Antibot** component.

## Overview

Mobile Antibot is a native SDK (iOS / Android) that verifies device integrity using hardware-backed attestation. It proves that each API request originates from a genuine, untampered application running on a real physical device — not from an emulator, a rooted phone, or a repackaged app binary.

Depending on your setup, the result can be enforced by Wallarm's modules or by your own backend logic.

## Where mobile antibot adds value

Native mobile applications face threats that browser-based detection cannot address. Bots run on emulator farms, rooted devices, repackaged app binaries, and scripted API clients that bypass the app entirely.

These threats lead to:

* Account takeover via credential stuffing from emulator farms
* Fake account creation at scale from scripted environments
* Checkout and inventory abuse from automated API clients
* API probing from tampered app binaries

Mobile Antibot solves these problems by verifying the device hardware before the action is processed. Deploy it in your **native iOS / Android application** to protect high-value actions:

| Use case                | What happens                                                    |
| ----------------------- | --------------------------------------------------------------- |
| **Login**               | Verifies that each authentication attempt comes from a real device, not an emulator farm. |
| **Checkout**            | Prevents automated purchases from scripted environments.         |
| **Account creation**    | Blocks fake account registration from emulators and tampered apps. |
| **Any API call**        | Ensures the request originates from the genuine, unmodified version of your app. |

## How it works

The SDK communicates with the Human Identification Server in two steps: first it requests a challenge, then it submits a hardware attestation proof.

### Step-by-step flow

1. **Challenge**
   The SDK sends a challenge request to the Human Identification Server (`POST /v1/m/hid/c`) with the app ID, device ID, and platform. The server returns a nonce and a key status: `new` (first time) or `existing` (returning device).

1. **Attestation or key proof**
    * **New device**: the SDK generates a key pair inside the device's hardware security module (Secure Enclave on iOS, StrongBox/TEE on Android). The private key never leaves the hardware. The SDK requests a hardware attestation certificate from the OS and submits it to the server (`POST /v1/m/hid/v` with `type: "attestation"`).
    * **Returning device**: the SDK proves it still holds the previously registered private key by signing the challenge nonce (`POST /v1/m/hid/v` with `type: "key_proof"`). No full re-attestation needed.

1. **Server verification**
   The Human Identification Server (hosted and managed by Wallarm) validates the attestation:
    * **Android**: verifies the certificate chain, parses Key Attestation Extension, checks security level (StrongBox/TEE), bootloader lock status, and nonce.
    * **iOS**: verifies the App Attest attestation object, validates the AAGUID, and checks the nonce.

1. **Token issuance**
   On success, the server returns a signed JWT and the SDK makes it available to your code. On failure, the SDK returns an empty token (`isPresent = false` on Android, or throws an error on iOS) so your app can handle it accordingly.

1. **Per-request signing**
   Beyond the initial token, the SDK can sign each API request body with the hardware-protected private key. This produces a per-request signature proving the device still holds the key — preventing token theft and replay.

1. **Enforce**
   How you enforce depends on your setup. If you use a Wallarm Node inline, the token and signature headers are forwarded automatically. If you use your own backend, verify the JWT and optionally the per-request signature.

### SDK functions

=== "Android (Kotlin)"

    | Function | What it does |
    | --- | --- |
    | `HumanIDSDK.init(context, config)` | Initializes the SDK. Returns a `HumanIDSession`. |
    | `session.getToken()` | Performs the full challenge-response attestation and returns a `HumanIDToken`. |
    | `session.signRequestBody(body)` | Signs the request body with the hardware-protected key. Returns a base64-encoded signature string for the `X-HID-Signature` header. |
    | `session.deleteKey()` | Removes the hardware-backed key from the device. |

    **HumanIDToken:**

    | Property | Type | Description |
    | --- | --- | --- |
    | `value` | String | The JWT token string. |
    | `expiresAtEpochSec` | Long | Token expiration as Unix timestamp. |
    | `isPresent` | Boolean | `false` if token acquisition failed. |

=== "iOS (Swift)"

    | Function | What it does |
    | --- | --- |
    | `SDK(configuration:)` | Creates and configures the SDK instance. |
    | `sdk.authenticate()` | Performs the full challenge-response attestation and returns an `AuthenticationToken`. |
    | `sdk.signRequestBody(body)` | Signs the request body with the hardware-protected key. Returns the `X-HID-Signature` header value. |

    **AuthenticationToken:**

    | Property | Type | Description |
    | --- | --- | --- |
    | `jwt` | String | The JWT token string. |
    | `expiresIn` | Int | Token lifetime in seconds. |

### Request headers

The SDK attaches two headers to protected API requests:

| Header | Description |
| --- | --- |
| `X-HID-Token` | The JWT from `getToken()` / `authenticate()`. |
| `X-HID-Signature` | Per-request body signature from `signRequestBody()`. Proves the device still holds the hardware key. |

### Platform details

| | iOS | Android |
| --- | --- | --- |
| **Min version** | iOS 14+ | Android 9+ (API level 28) |
| **Attestation mechanism** | App Attest via Secure Enclave | Key Attestation via StrongBox or TEE |
| **Security levels** | Production / Development (AAGUID-based) | StrongBox (highest) → TEE (default) → Software (rejected by default) |
| **Key storage** | Secure Enclave | StrongBox (dedicated HSM) or TEE (ARM TrustZone) |

## Setup

### Step 1: Get your credentials and SDK

Contact [sales@wallarm.com](mailto:sales@wallarm.com?subject=Human%20Identity%20for%20Mobile%20inquiry) to enable Human Identity. Provide the application(s) you plan to protect and the platforms you need (iOS, Android, or both).

The Wallarm team will provide:

* **Human Identification Server endpoint** — the base URL depends on the chosen [Wallarm Cloud](../about-wallarm/overview/#cloud) region:

    * `https://human-id.us-hi.wallarm.com/` for the US Cloud
    * `https://human-id.eu-hi.wallarm.com/` for the EU Cloud
* **Application ID** — identifies your application in the HIS and links requests to your configuration.
* **Mobile SDK package**:

    * iOS: XCFramework
    * Android: `.aar` library

The SDK is provided directly by the Wallarm team during onboarding — it is not available in public package registries.

**Supported platforms**: iOS 14+ / Android 9+ (API level 28).

### Step 2: Add the SDK to your project

=== "iOS"

    Add the provided `.xcframework` to your Xcode project:

    1. Drag the `.xcframework` file into your project navigator.
    1. In your target's **General** → **Frameworks, Libraries, and Embedded Content**, ensure it is set to **Embed & Sign**.

=== "Android"

    Add the provided `.aar` file to your project:

    1. Place the `.aar` file in your module's `libs/` directory.
    1. In your `build.gradle.kts`:

        ```kotlin
        dependencies {
            implementation(files("libs/wallarm-antibot.aar"))
        }
        ```

### Step 3: Initialize the SDK and get a token

=== "Android (Kotlin)"

    ```kotlin
    import com.wallarm.humanid.HumanIDConfig
    import com.wallarm.humanid.HumanIDSDK

    // 1. Initialize at app startup
    val config = HumanIDConfig(
        clientIDKey = "YOUR_APP_ID",
        serverUrl = "https://human-id.us-hi.wallarm.com"  // or EU Cloud URL
    )
    val session = HumanIDSDK.init(context = applicationContext, config = config)

    // 2. Before a protected action, get the token
    val token = session.getToken()

    if (token.isPresent) {
        // 3. Sign the request body
        val bodyBytes = requestJson.toByteArray()
        val signature = session.signRequestBody(bodyBytes)

        // 4. Attach both headers to your API request
        request.addHeader("X-HID-Token", token.value)
        request.addHeader("X-HID-Signature", signature)
    }
    ```

=== "iOS (Swift)"

    ```swift
    import WallarmMobileAntibotSDK

    // 1. Initialize at app startup
    let config = Configuration(
        cloud: .us,          // or .eu, or .custom(url: "https://...")
        appId: "YOUR_APP_ID"
    )
    let sdk = SDK(configuration: config)

    // 2. Before a protected action, get the token
    let token = try await sdk.authenticate()

    // 3. Sign the request body
    let signature = try await sdk.signRequestBody(bodyData)

    // 4. Attach both headers to your API request
    request.setValue(token.jwt, forHTTPHeaderField: "X-HID-Token")
    request.setValue(signature, forHTTPHeaderField: "X-HID-Signature")
    ```

!!! tip "Network layer integration"
    For apps using a centralized network layer (Alamofire, Retrofit, OkHttp interceptors), add the token and signature in a single interceptor rather than in every API call.

### Step 4: Enforce

There are 2 approaches — choose based on your infrastructure:

=== "Wallarm modules"

    If you have a [Wallarm Node](../installation/supported-deployment-options.md) deployed inline — receiving all traffic after the Mobile Antibot SDK has attached the headers — you can use the device identity from the token as a [session context parameter](../api-sessions/overview.md), enabling enforcement by device fingerprint across Wallarm's modules.

    **Set up session tracking by device identity:**

    1. **Ensure the `X-HID-Token` header reaches the Node.** The SDK attaches it automatically. If your mobile app communicates with your backend through the Wallarm Node, no additional code is needed.

    1. **Add the device identifier as a session context parameter.** In Wallarm Console, go to **API Sessions** → **Session context parameters** and [add](../api-sessions/setup.md#session-context) a new parameter. Set the path to the device identity claim inside the JWT in the `X-HID-Token` header, e.g.:

        `Request` → `Header` → `X-HID-Token` → `JWT` → `jwt_payload` → `PROPERTY` → `hid`

        ![hid session context parameter in API sessions](../images/api-sessions/hid-context-parameter.png)

        Enable **Group sessions by this key** so that sessions are grouped by device fingerprint rather than by IP alone.

    Once configured, this becomes available across Wallarm's enforcement mechanisms:

    * **Visibility**: in **API Sessions**, filter and inspect sessions grouped by device identity. This reveals patterns invisible when grouping by IP — for example, the same device rotating through multiple IPs.

        ![hid parameter in API session](../images/api-sessions/hid-parameter-in-session.png)
    * **Anonymous session tracking**: the device identity from the token identifies the device before the user logs in. Without it, pre-authentication traffic has no stable identifier — only IP, which attackers rotate. With device identity as a grouping key, Wallarm builds sessions from anonymous requests, and all enforcement mechanisms listed below can be applied to these sessions.
    * **Session denylist**: block a specific device session via [Session Denylist](../api-sessions/blocking.md).
    * **API Abuse Prevention**: when [API Abuse Prevention](../api-abuse-prevention/overview.md) is configured with the **Denylist session** reaction and sessions are grouped by device identity, the module analyzes behavioral patterns within sessions. If bot behavior is detected, the session is added to the [Session Denylist](../api-sessions/blocking.md) — blocking all subsequent requests from the same device, regardless of IP rotation.
    * **Brute force protection**: configure a [Brute Force Protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) rule that limits attempts per device identity. If the same device exceeds the threshold, the session is blocked.

=== "Your own backend"

    Your backend verifies the token and decides how to handle the request.

    For each protected request:

    1. Fetch the JWKS public key from the Human Identification Server:

        * US Cloud: `GET https://human-id.us-hi.wallarm.com/.well-known/jwks.json`
        * EU Cloud: `GET https://human-id.eu-hi.wallarm.com/.well-known/jwks.json`
    1. Verify the JWT signature.
    1. Check the token expiration.
    1. Optionally, verify the `X-HID-Signature` header against the request body to confirm the request was not tampered with in transit.

### Step 5: Test the integration

**Verify that tokens are issued correctly:**

1. Launch your app on a **real device** and trigger a protected action.
1. Verify that both `X-HID-Token` and `X-HID-Signature` headers are present in the API request.
1. Confirm that `token.isPresent == true` (Android) or `authenticate()` returns without error (iOS).
1. Test with an **emulator** — `token.isPresent` should be `false` (Android) or `authenticate()` should throw an error (iOS).

**Verify that enforcement works:**

* **Wallarm modules**: in Wallarm Console → **API Sessions**, confirm that sessions are grouped by device identifier. Trigger a configured enforcement rule and verify that the session is blocked.
* **Your own backend**: verify that requests with a valid JWT are accepted and requests without headers are rejected.

## Related resources

* [Human Identification for Web](web-antibot.md) — browser-based verification for web applications
* [API Abuse Prevention](../api-abuse-prevention/overview.md) — server-side behavioral bot detection
