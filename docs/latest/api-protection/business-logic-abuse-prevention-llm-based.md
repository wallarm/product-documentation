# Business Logic Abuse Prevention (LLM-based) <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

<!--intro TBD-->

Wallarm provides the **Business logic abuse prevention (LLM-based)** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

## Creating and applying mitigation control

Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope**, **Scope filters** and **Mitigation mode** are set for any mitigation control.

To configure LLM-based protection from business logic abuse:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **Business logic abuse prevention (LLM-based)**.
1. Describe the **Scope** to apply the mitigation control to.
1. If necessary, define advanced conditions in **Scope filters**.
1. Set **Context window for analysis**. <!--unclear, working on that-->
1. Type [**Detection prompt**](#detection-prompt).
1. Select **LLM provider**.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

#### Detection prompt

You write you own textual instructions for selected **LLM provider** on what and how to do, for example, write:

* "Detect if the user is trying to trigger an unintended refund or discount."
* "Detect if the message contains requests to bypass user identity checks."

<!--details TBD-->

<!--#### Mitigation control examples

TBD

### Viewing detected attacks in API Sessions

TBD-->
