# Legitimate request is blocked with the "Malicious activity blocked" message

If a user reports a legitimate request being blocked:

1. Review and evaluate the provided information.
1. Request details displayed on the [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) returned to the user.

    ![!Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

1. To check the blocking data, go to Wallarm Console → **Events** section, search for the event by [request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    `attacks incidents request_id:<requestId>`

1. Analyze event details to understand the reason for blocking.
1. If this does not help, contact [Wallarm's technical support](mailto:support@wallarm.com) team.

!!! info "Providing full information"
    When contacting Wallarm's technical support, provide all the collected information about the blocked request.
