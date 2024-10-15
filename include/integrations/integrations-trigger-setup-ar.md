Besides the notifications you have already set up through the integration card, Wallarm triggers allow you to select additional events for notifications:

* Number of [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) or incidents per time interval (day, hour, etc.) exceeds the set number

    !!! info "What is not counted"
        * For attacks: 
            * The experimental attacks based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).
        * For hits:
            * The experimental hits based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).
            * Hits not saved in the [sample](../../../user-guides/events/analyze-attack.md#sampling-of-hits).

* [Changes in API](../../../api-discovery/track-changes.md) took place
* IP address was [denylisted](../../../user-guides/ip-lists/overview.md)
* New [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) was detected
* New user was added to the company account

For condition detailing, you can add one or more filters. As soon, as condition and filters are set, select the integration through which the selected alert should be sent. You can select several integrations simultaneously.

![Choosing an integration](../../../images/user-guides/triggers/select-integration.png)