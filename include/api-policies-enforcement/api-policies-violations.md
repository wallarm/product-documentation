* **Requesting an undefined endpoint** - a request targets the endpoint not presented in your specification
* **Requesting endpoint with undefined parameter** - a request contains the parameter not presented for this endpoint in your specification
* **Requesting endpoint without required parameter** - a request does not contain the parameter or its value that are marked as required in your specification
* **Requesting endpoint with invalid parameter value** - a request parameter's value in not in correspondence with its type/format defined by your specification
* **Requesting endpoint without authentication method** - a request does not contain the information about the authentication method
* **Requesting endpoint with invalid JSON** - a request contains an invalid JSON

The system can perform the following actions in case of found inconsistency:

* **Block** - block a request and put in the [**Attacks**](../user-guides/events/check-attack.md) section as blocked

    !!! info "Filtration mode"
        The Wallarm node will block requests only when the blocking [filtration mode][waf-mode-instr] is enabled for target endpoint - otherwise, **Monitor** action will be performed.

* **Monitor** - mark a request as incorrect, but do not block, put it in the **Attacks** section as monitored
* **Not tracked** - do nothing