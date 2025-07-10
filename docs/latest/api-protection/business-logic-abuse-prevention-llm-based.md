# AI Business Logic Abuse Prevention <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Modern applications rely heavily on complex business logic to manage workflows, data, and user interactions. **Unlike traditional vulnerabilities** such as SQL injection or misconfigurations, **business logic abuse** exploits design flaws in how applications operate. These attacks manipulate application workflows, state transitions, and decision-making processes to gain unauthorized access, bypass restrictions, or disrupt operations. This article describes means provided by Wallarm to mitigate this type of threats.

## OWASP top 10 for business logic abuse

To get a better view of what the possible flaws in application logic may be, get familiar with [OWASP Top 10 for Business Logic Abuse](https://owasp.org/www-project-top-10-for-business-logic-abuse/).

From this, you can get some ideas of writing appropriate instructions for [**Detection prompt**](#detection-prompt) when configuring Wallarm's LLM-based prevention of business logic abuse.

## Creating and applying mitigation control

To mitigate attacks that try to manipulate application business logic, Wallarm provides the **AI business logic abuse prevention** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

!!! tip ""
    Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

### How control works

!!! info "Generic information on mitigation controls"
    Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope**, **Scope filters** and **Mitigation mode** are set for any mitigation control.

Once you define **Scope** and - optionally - **Scope filters**, the control only considers request from the scope, ignoring the others. Once any request match filtered scope, the control:

1. Identifies the [session](../api-sessions/overview.md) this request belongs to.
1. Takes this request and `x` requests in session preceding it:

    * It does not matter if these `x` match the control's scope and filters. Any are taken.
    * How many will be this `x` is defined by parameters in **Context window for analysis**: number and time is specified there - what comes first: for example, if you specified `10 requests` and `5 mins`, if all 10 are inside 5 mins, all will be taken, if only 7 inside the time, only seven will be taken.

1. Combines all taken requests with you instruction from **Detection prompt**.
1. Sends this combined thing to selected **LLM provider**.
1. Whatever **LLM provider** responds, it provides background `Yes/No` decision to the question "Is it an attack?"
1. If it is an attack, mitigation control takes action in accordance with **Mitigation mode**.

### Detection prompt

You write your own textual instructions for selected **LLM provider** on what and how to do, for example, write:

* "Detect if the user is trying to trigger an unintended refund or discount."
* "Detect if the message contains requests to bypass user identity checks."

### Configuring control

To configure LLM-based protection from business logic abuse:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **Business logic abuse prevention (LLM-based)**.
1. Describe the **Scope** to apply the mitigation control to.
1. If necessary, define advanced conditions in **Scope filters**.
1. Set **Context window for analysis**.
1. Type [**Detection prompt**](#detection-prompt).
1. Select **LLM provider**.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

<!--details TBD-->

<!--#### Mitigation control examples

TBD

### Viewing detected attacks in API Sessions

TBD-->
