# API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** module of the Wallarm platform discovers and displays the user sessions in your applications' traffic. Within each discovered session, Wallarm collects information about its requests. This article gives an overview of **API Sessions**: issues addressed by it, its purpose and main possibilities.

For information on how to use the **API Sessions** module, refer to its [user guide](../user-guides/api-sessions.md).

## Issues addressed by API Sessions

The main issue the **API Sessions** module deals with is that when dealing only with attacks, presented in the **Events** section, you cannot see their full contexts: the logic sequence of requests that the attack is the part of. This context allows revealing of more general patterns in how your applications are being attacked as well as understanding of which business logic will be affected by the taken security measures.

**As you have the API sessions discovered by Wallarm, you can**:

* [Track user activity](#viewing-discovered-api-sessions) by displaying a list of requests made in a single session, so you can identify unusual patterns of behavior or deviations from typical usage.
* [Inspect shadow APIs](#inspecting-sessions-with-requests-to-shadow-apis) requested in user sessions.
* [Identify performance issues](#analyzing-session-performance-issues) and bottlenecks to optimize user experience.
* Know which API flow/business logic sequences will be affected before tuning a particular false positive, applying the virtual patch, adding rules, or enabling API Abuse controls.

## How API Sessions module works

The **API Sessions** module analyzes requests to your selected applications or their particular endpoints to join them into the user sessions and display these user sessions for security analysis.

### Default rule

By default, the module includes the default set of request parameters, basing on which values Wallarm will be able to join requests in the separate sessions. However, you always need to manually define the scope: applications and endpoints, for which the session discovery should be performed. You can also enable session discovery for all traffic.

### Custom rules

You can configure the **API Sessions** module to discover sessions basing on your own set of parameters and the rules built in their basis.

See [Configuring API Sessions →](../user-guides/api-sessions.md#configuring-api-sessions)

## Viewing discovered API sessions

The **API Sessions** section provides many options for analyzing the discovered API sessions.

![!API Sessions section - discovered sessions](../images/api-sessions/api-sessions.png)

These options are:

* Search and filters.
* Viewing request sequence inside each session.
* Getting response codes and attack types statistics.
* Getting information on user's IP(s).
* Viewing request details.

Learn more about available options from the [User guide](../user-guides/api-sessions.md).

## Inspecting sessions with requests to shadow APIs

You can [get a list of shadow API endpoints](../user-guides/api-discovery.md#displaying-shadow-api) using the **API Discovery** module. Then, in **API Sessions**, use search to get the list of sessions with requests to these endpoints.

## Analyzing session performance issues

You can analyze session performance issues by expanding the session and then sorting its requests by the **Response time** column.

## Enabling and configuring API Sessions

The **API Discovery** module is disabled by default.

To enable API Sessions:

1. Make sure your Wallarm node is of the 4.8 or higher [version](../updating-migrating/versioning-policy.md#version-list).
1. Make sure your [subscription plan](subscription-plans.md#subscription-plans) includes the **API Sessions** module. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. Make sure you are logged in under user with the **Administrator** or **Global Administrator** [role](../user-guides/settings/users.md#user-roles).
1. If you want to enable API Sessions only for the selected applications, ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.
1. Enable API Sessions for the required applications/endpoints in Wallarm Console → **API Sessions** → **Configure API Sessions**.

    ![!API Sessions - Settings](../images/api-sessions/api-sessions-settings.png)

Once the API Sessions module is enabled, it will start the analysis of the requests to your selected applications/endpoints and joining these requests into user sessions. The discovered sessions will be displayed in the **API Sessions** section of Wallarm Console.
