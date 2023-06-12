# Legitimate request is blocked with the "Malicious activity blocked" message

If your user reports a legitimate request being blocked despite the Wallarm measures, you can review and evaluate their request as this articles explains.

To resolve the issue of a legitimate request being blocked by Wallarm, follow these steps:

1. Request the user to provide the following information related to the blocked request: the request itself, blocking code, user’s IP address, request UUID (if the custom [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) is used), etc.

    ![!Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

1. Investigate the blocked request by utilizing the [search](../user-guides/search-and-filters/use-search.md) functionality in the **Events** section of your Wallarm Console. For example, [search by request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    `attacks incidents request_id:<requestId>`

1. Examine the information provided in the [**Events**](../user-guides/events/check-attack.md)section to determine if it indicates a false positive or a legitimate blocking. If you conclude that it is a false positive, report that.
1. If possible, solve the wrong blocking issue by applying measures against [false positives](../user-guides/events/false-attack.md) and/or re-configuring [rules](../user-guides/rules/intro.md), [triggers](../user-guides/triggers/triggers.md), [IP lists](../user-guides/ip-lists/overview.md).
1. If the request is not found or further investigation is required, share the request details with [Wallarm support](mailto:support@wallarm.com) for further assistance and investigation.
