# Legitimate request is blocked

If your user reports a legitimate request being blocked despite the Wallarm measures, you can review and evaluate their request as this articles explains.

To resolve the issue of a legitimate request being blocked by Wallarm, follow these steps:

1. Request the user to provide the following information related to the blocked request: the request itself, blocking code, user’s IP address, request UUID (if the custom [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) is used), etc.

    ![!Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

1. In Wallarm Console → [**Events**](../user-guides/events/check-attack.md) section, [search](../user-guides/search-and-filters/use-search.md) for the event related to the blocked request. For example, [search by request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. Examine the event to determine if it indicates a wrong or legitimate blocking.
1. If it is a wrong blocking, solve the issue by applying one or a combination of measures: 

    * Measures against [false positives](../user-guides/events/false-attack.md)
    * Re-configuring [rules](../user-guides/rules/intro.md)
    * Re-configuring [triggers](../user-guides/triggers/triggers.md)
    * Modifying [IP lists](../user-guides/ip-lists/overview.md)

1. If the information initially provided by the user is incomplete or you are not sure about measures that can be safely applied, share the details with [Wallarm support](mailto:support@wallarm.com) for further assistance and investigation.
