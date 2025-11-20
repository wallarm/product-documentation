* **Requesting an undefined endpoint** - a request targets the endpoint not presented in your specification
* **Requesting endpoint with undefined parameter** - a request contains the parameter not presented for this endpoint in your specification
* **Requesting endpoint without required parameter** - a request does not contain the parameter or its value that are marked as required in your specification
* **Requesting endpoint with invalid parameter value** - a request parameter's value in not in correspondence with its type/format defined by your specification
* **Requesting endpoint without authentication method** - a request does not contain the information about the authentication method
* **Requesting endpoint with invalid JSON** - a request contains a JSON object not in correspondence with the [schema object](https://swagger.io/docs/specification/v3_0/data-models/data-models/) in specification that defines the structure and rules for the JSON data expected

The system can perform the following actions in case of found inconsistency:

* **Block** - block a request and put in the [**Attacks**](../user-guides/events/check-attack.md) section as blocked

    !!! info "Filtration mode"
        The Wallarm node will block requests only when the blocking [filtration mode][waf-mode-instr] is enabled for target endpoint - otherwise, **Monitor** action will be performed.

* **Monitor** - mark a request as incorrect, but do not block, put it in the **Attacks** section as monitored
* **Not tracked** - do nothing

Note that several specifications can be used for setting policies. In case when one request falls on two different specifications (the same policy and different actions in different specifications), the following will happen:

* **Block** and **Block** - the request will be blocked and two events will be added to the **Attacks** section with status `Blocked` pointing at the reason of blocking and at the fact that the request violated two different specifications.
* **Monitor** and **Block** - the request will be blocked and one event will be added to the **Attacks** section with status `Blocked` explaining the reason of blocking.
* **Monitor** and **Monitor** - the request will not be blocked and two events will be added to the **Attacks** section with status `Monitoring` pointing at the fact that specific policy was violated.