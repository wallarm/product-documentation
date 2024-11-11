# API Sessions Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md) include the built-in rules for the session identification and requires only enabled Wallarm [node](../about-wallarm/overview.md#how-wallarm-works) to start working. Optionally, you can fine-tune API Sessions under your needs as described in this article.

## Session context

Context in API sessions is information that enriches request data by grouping them into logical sessions and adding metadata to provide deeper insights into session activity. Configuring context allows you to specify which aspects or additional data should be tracked and associated with each session.

Set session context by adding extra parameters, associating sessions with sensitive business flows and highlighting parameters that can be used for user and user role identification.

### Extra parameters

In **API Sessions**, within session, the request details by default include: 

* Parameter that worked for [session grouping](#session-grouping) - yours or the one from the built-in set.
* For malicious requests - full request content.

You can add any additional (context) [parameters](../user-guides/rules/request-processing.md) that you need to understand the session content: what and in what order the actor did. To do so, add these parameters in Wallarm Console → **API Sessions** → **Session context parameters**. Once added, Wallarm will export them to the Wallarm Cloud and [display](#data-protection) in Wallarm Console, in details of your session requests.

![!API Sessions - context parameters](../images/api-sessions/api-sessions-context-parameters.png)

### Sensitive business flows

You can associate sessions with sensitive business flows. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter and select **Context** for it.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)

### User and role

You can highlight session parameters, that should be used for naming the session actor (user) and its role. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter, then from **Type**, select `User` or `Role`.

![!API Sessions - user and user role](../images/api-sessions/api-sessions-user-role-select.png)

## Session grouping

Wallarm groups requests of your applications' traffic into user sessions based on selected headers/parameters of the requests. All the requests having the same value of the selected header/parameter are grouped into one session.

By default, sessions are identified with the **built-in set** of such parameters (not displayed in Wallarm Console). Its logic is to try most common identification parameters, such as `PHPSESSID` or `SESSION-ID` headers, and if they do not work - form session based on the combination of `request source IP and user-agent` (or at least IP if user-agent is not presented).

You can add your own identification parameters based on your applications' logic. To do so, go to Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter and select **Group sessions by this key** for it.

![!API Sessions - Configuration](../images/api-sessions/api-sessions-settings.png)

You can add several grouping keys, they are tried in specified order - next is tried only if previous did not work. Drag to change the order. You own keys are always tried before the built-in ones.

!!! info "Impact of `Mask sensitive data` rule"
    For the parameter to work as a grouping key, it should not be affected by the the [Mask sensitive data](../user-guides/rules/sensitive-data-rule.md) rule.

## Data protection

For API Sessions, from node to the Cloud, Wallarm only exports parameters selected by you. If they contain sensitive data, be sure to hash it before exporting. Note that hashing will transform the actual value into unreadable - the presence of parameter and particular but unknown value will provide the limited information for the analysis.

To hash the sensitive parameters, once they are added in Wallarm Console → **API Sessions** → **Session context parameters**, select the **Hashing (secret)** option for them.

Wallarm hashes the selected parameters before export using the [MD5 hashing algorithm](https://en.wikipedia.org/wiki/MD5).

## Analyzed traffic

API Sessions analyze all traffic that Wallarm node is enabled to secure to organize it into sessions. You can contact the [Wallarm support team](mailto:support@wallarm.com) to request limiting analysis to the selected applications/hosts.

## Storage period

The **API Sessions** section stores and displays sessions for the last week. The older sessions are deleted to provide an optimal performance and resource consumption.
