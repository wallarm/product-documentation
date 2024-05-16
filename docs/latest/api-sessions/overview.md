# API Sessions Overview <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** module of the Wallarm platform monitors and displays the user sessions in your applications' traffic. Within each monitored session, Wallarm collects information about its requests. This article gives an overview of **API Sessions**: issues addressed by it, its purpose and main possibilities.

## Issues addressed by API Sessions

The main issue the **API Sessions** module deals with is that when dealing only with attacks, presented in the **Events** section, you cannot see their full contexts: the logic sequence of requests that the attack is the part of. This context allows revealing of more general patterns in how your applications are being attacked as well as understanding of which business logic will be affected by the taken security measures.

**As you have the API sessions monitored by Wallarm, you can**:

* [Track user activity](#viewing-monitored-api-sessions) by displaying a list of requests made in a single session, so you can identify unusual patterns of behavior or deviations from typical usage.
* [Inspect shadow APIs](#inspecting-sessions-with-requests-to-shadow-apis) requested in user sessions.
* [Identify performance issues](#analyzing-session-performance-issues) and bottlenecks to optimize user experience.
* Know which API flow/business logic sequences will be affected before tuning a particular false positive, applying the virtual patch, adding rules, or enabling API Abuse controls.

## How API Sessions module works

The **API Sessions** module:

* Monitors requests for hosts/applications that are specified in the settings. You can also enable session monitoring for all traffic.
* Saves the values of the parameters from the requests' data. Wallarm always uses the set of built-in parameters, you can add custom parameters in the settings.
* Applies session ID rules to each request. Wallarm applies built-in rules, you can use your custom parameters to add your rules.
* Using applied session ID, groups request into sessions and displays sessions with their requests in the **API Sessions** section.

## Enabling and configuring API Sessions

To start using API Sessions, enable and configure it as described in [API Sessions Setup](setup.md).
