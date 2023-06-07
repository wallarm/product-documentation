# Legitimate request is blocked with "Malicious activity blocked" message

If a user's legitimate request was blocked and [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) was displayed to a user, the user collects information from the blocking page and send it to support.

![!Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

Support can:

1. Go to Wallarm Console → **Events** section, search for the event by [request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    `attacks incidents request_id:<requestId>`

1. Analyze event details to understand the reason for blocking.
1. If this does not help, contact [Wallarm's technical support](mailto:support@wallarm.com) team.
