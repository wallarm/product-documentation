# API Policy Enforcement Overview

The **API Policy Enforcement** is designed to apply security policies to your APIs basing on your uploaded specifications. Its primary function is to detect discrepancies between the endpoint descriptions in your specification and the actual requests made to your REST APIs. When such inconsistencies are identified, the system can take predefined actions to address them.

![API policy enforcement - diagram](../images/api-policies-enforcement/api-policy-enforcement-diagram.png)

## Issues addressed by API Policy Enforcement

Your organization may use a number of applications exposed via API and a large number of external IPs, including automation tools, trying to access them. It is a resource consuming task to create restrictions specifically bound to some sources, targets or behaviors.

The API Policy Enforcement allows lowering the security effort by utilizing the positive security model - via specification it defines what is allowed, via the short set of policies it defines how to deal with all the rest.

**As you have your API inventory exhaustively described by API specification, you can**:

* Upload this specification to Wallarm.
* With several clicks, set policies towards requests to API elements, not presented or contradicting the specification.

And thus:

* Avoid creating of specific restricting rules.
* Avoid these rules inevitable necessary updates.
* Never miss attacks for which a direct restricting rule is not configured.

## How it works

Requests may violate your specification by different positions:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API Policy Enforcement has limits by time (50 ms) and request size (1024 KB) - when exceeding these limits, it stops processing the request and creates the **Specification processing overlimit** [event](viewing-events.md#overlimit-events) in the **Attacks** section, saying that one of this limits was exceeded.

!!! info "API Policy Enforcement and other protection measures"
    Note that if API Policy Enforcement stops processing the request, this does not mean it is not processed by other Wallarm protection procedures. Thus, if it is an attack, it will be registered or blocked in accordance with the Wallarm configuration.

To change limits or Wallarm behavior (from monitoring of overlimits to blocking such requests), contact [Wallarm Support](mailto:support@wallarm.com).

Note that API Policy Enforcement adds its regulation to a usual [attack detection](../about-wallarm/protecting-against-attacks.md) performed by the Wallarm node and does not replaces it, so your traffic will be checked both for the absence of the attack signs and for correspondence to your specification.

## Setup

To start protecting your APIs with API Policy Enforcement, upload your specification, and set policies as described [here](setup.md).
