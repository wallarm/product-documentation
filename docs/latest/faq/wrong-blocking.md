# Legitimate request is blocked

If your user reports a legitimate request being blocked despite the Wallarm measures, you can review and evaluate their requests as this articles explains.

To resolve the issue of a legitimate request being blocked by Wallarm, follow these steps:

1. Request the user to provide **as text** (not screenshot) the information related to the blocked request, which is one of the following:

    * Information provided by the Wallarm [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) if it is configured (may include user’s IP address, request UUID and other pre-configured elements).

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "Blocking page usage"
            If you do not use the default or customized Wallarm blocking page, it is highly recommended to [configure](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) it to get the appropriate info from user. Remember that even a sample page collects and allows easy copying of meaningful information related to the blocked request. Additionally, you can customize or fully rebuild such page to return users the informative blocking message.
    
    * Copy of user's client request and response. Browser page source code or terminal client textual input and output suits well.

1. In Wallarm Console → [**Attacks**](../user-guides/events/check-attack.md) or [**Incidents**](../user-guides/events/check-incident.md) section, [search](../user-guides/search-and-filters/use-search.md) for the event related to the blocked request. For example, [search by request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. Examine the event to determine if it indicates a wrong or legitimate blocking.
1. If it is a wrong blocking, solve the issue by applying one or a combination of measures: 

    * Measures against [false positives](../user-guides/events/check-attack/#false-positives)
    * Re-configuring [rules](../user-guides/rules/rules.md)
    * Re-configuring [triggers](../user-guides/triggers/triggers.md)
    * Modifying [IP lists](../user-guides/ip-lists/overview.md)

1. If the information initially provided by the user is incomplete or you are not sure about measures that can be safely applied, share the details with [Wallarm support](mailto:support@wallarm.com) for further assistance and investigation.
