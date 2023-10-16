# API Policy Enforcement Overview

The **API Policy Enforcement** is designed to apply security policies to your APIs basing on your uploaded specifications. Its primary function is to detect discrepancies between the endpoint descriptions in your specification and the actual requests made to your REST APIs. When such inconsistencies are identified, the system can take predefined actions to address them.

![API policy enforcement - diagram](../images/api-policies-enforcement/api-policy-enforcement-diagram.png)

## How it works

Requests may violate your specification by different positions:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API Policy Enforcement utilizes the positive security model - via specification it defines what is allowed, via the short set of policies it defines how to deal with all the rest. Thus, the specific restricting rules and their inevitable necessary updates are not required which saves time and resources. You also never miss attacks for which a direct restricting rule is not configured.

Note that API Policy Enforcement adds its regulation to a usual [attack detection](../about-wallarm/protecting-against-attacks.md) performed by the Wallarm node and does not replaces it, so your traffic will be checked both for the absense of the attack signs and for correspondence to your specification.

## Setup

To start protecting your APIs with API Policy Enforcement, upload your specification, and set policies as descibed [here](setup.md).
