# API Policies Enforcement

The **API Policies Enforcement** module allows aplying security policies regarding your APIs basing on your API specifications: you upload one or several specifications to Wallarm and configure the system to:

* Find inconsistencies between endpoint description in your specification and actual requests. Requests may violate your specification by:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

* Perform action in case of found inconsistency:

    * Mark request as malicious (put it in the **Events** section as monitored)
    * Block request (block and put in the **Events** as blocked)

Benefit of **API Policies Enforcement** is that it mitigates challenges related to the traditional negative security models for API protection, which define what to block instead of what to allow, due to the need for constant tuning. These approaches rely on predefined rules and signatures, requiring frequent updates that consume valuable time and resources, and can miss attacks for which a rule or signature doesn’t exist.

Instead of tunining and constant updating of the negative rules, the OpenAPI specification uloaded with **API Policies Enforcement** specifies what is allowed and thus create the universal rule. This proactive approach, blocking anything that isn’t explicitly allowed, provides a shift-left for API security in production. By connecting developers with production security through a defined specifications, it minimizes the risk of costly breaches and downtime.