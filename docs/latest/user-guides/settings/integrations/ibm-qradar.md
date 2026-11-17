# IBM QRadar (Early Access)

!!! info "Early access"
    The IBM QRadar integration is available as an early-access feature and is actively evolving. Your feedback helps shape it; contact [sales@wallarm.com](mailto:sales@wallarm.com) with questions or suggestions.

[IBM QRadar](https://www.ibm.com/products/qradar-siem) is a security information and event management (SIEM) platform. You can set up Wallarm to send detected attacks to a QRadar [HTTP Receiver](https://www.ibm.com/docs/en/dsm?topic=options-http-receiver-protocol-configuration) log source. Wallarm Cloud delivers events over HTTPS, authenticated with a token header.

## Requirements

* A QRadar HTTP Receiver endpoint that is publicly reachable from Wallarm Cloud
* An HTTPS server certificate signed by a certificate authority (CA) — self-signed certificates are not accepted

## Setting up integration

1. In QRadar, open **Admin** → **Log Sources** and create a log source with the **HTTP Receiver** protocol:

    | Parameter | Value |
    | --- | --- |
    | **Log Source Type** | Universal DSM, or a custom DSM for Wallarm |
    | **Listen Port** | A free port, for example `12469`. Wallarm Cloud must be able to reach it. |
    | **Communication Type** | **HTTPs** with a CA-signed server certificate |
    | **Use HTTP Authentication Token Header** | Enabled |
    | **Authentication Token Header Name** | `Authorization` |
    | **Authentication Token Value** | A secret string that you generate. You enter the same value in Wallarm Console. |
    | **Event Parsing Method** | **Event Per Line** |
    | **Max Payload Length (Byte)** | `32767` (advanced option) |
    | **Max POST method Request Length (MB)** | `5` or higher |

    QRadar compares the `Authorization` header value as is. Do not add a prefix such as `Basic` or `Bearer` unless it is part of the token value you configured.

1. Open Wallarm Console → **Integrations** and proceed to the **IBM QRadar** integration setup.
1. Enter an integration name.
1. Enter the HTTP Receiver URL with the listen port, for example `https://qradar.example.com:12469`. The URL must use `https://`.
1. Paste the **Authentication Token Value** configured in the log source. The value must not contain line breaks.
1. Choose event types to trigger notifications.

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the target system, and the notification format. Wallarm sends a sample attack to QRadar.
1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Event format

Wallarm sends attacks (hits) as newline-delimited JSON (NDJSON): one JSON event per line, in the body of a `POST` request with the `Content-Type: application/x-ndjson` header and the token in the `Authorization` header.

Example of an event:

```json
{"vendor":"Wallarm","product":"WAF","event_id":"sqli","time":"2026-10-12T10:15:30Z","src_ip":"203.0.113.5","src_port":0,"dst_ip":null,"dst_port":null,"domain":"api.example.com","method":"POST","url":"/api/v1/login","severity":5,"action":"blocked","request_id":"abc123","payload":"' OR 1=1--"}
```

All fields are always present:

| Field | Description |
| --- | --- |
| `vendor` | Always `Wallarm`. |
| `product` | Always `WAF`. |
| `event_id` | Attack type, for example `sqli`, `xss`, `rce`, `ptrav`. Map it to QRadar event IDs (QIDs) in QRadar. |
| `time` | Request time in ISO 8601 format, UTC. |
| `src_ip` | Attacker IP address: IPv4, or IPv6 when IPv4 is not available. |
| `src_port` | Attacker port. Can be `0`. |
| `dst_ip` | Always `null`. |
| `dst_port` | Always `null`. |
| `domain` | Requested host. |
| `method` | HTTP method. |
| `url` | Request path. |
| `severity` | Always `5`. |
| `action` | Action taken on the request, for example `blocked` or `monitored`. |
| `request_id` | Wallarm request ID. |
| `payload` | Malicious payloads, separated by line breaks. Can contain sensitive request data. |

Each line is limited to 32767 bytes. If an event is longer, Wallarm truncates `payload`, then `url`, then `domain`, and adds the `...` suffix to the truncated value. Each request is limited to 5,000,000 bytes. Wallarm splits larger batches into several requests.

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

If QRadar responds with `401` or `403`, Wallarm treats the token as rejected and the integration as misconfigured. Other non-2xx responses and network errors are retried.

--8<-- "../include/integrations/integration-not-working.md"
