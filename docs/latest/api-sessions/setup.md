# API Sessions Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to configure the [API Sessions](overview.md) functionality.

## Analyzed traffic

The **API Sessions** module monitors all traffic to your hosts/applications. You can contact the [Wallarm support team](mailto:support@wallarm.com) to request limiting analysis to the selected hosts/applications.

## Storage period

The **API Sessions** section stores and displays sessions for the last week. The older sessions are deleted to provide an optimal performance and resource consumption.

## Session identification

Wallarm groups requests of your applications' traffic into user sessions based on selected headers/parameters of the requests. All the requests having the same value of the selected header/parameter are grouped into one session.

By default, sessions are identified with the **built-in set** of such parameters (not displayed in Wallarm Console). Its logic is to try most common identification parameters, and if they do not work - form session based on the combination of `request source IP and user-agent` (or at least IP if user-agent is not presented).

You can add your own identification parameters based on your applications' logic. To do so, go to Wallarm Console → **API Sessions** → **Configure API Sessions**, add your parameter and select **Group sessions by this key** for it.

![!API Sessions - Configuration](../images/api-sessions/api-sessions-settings.png)

You can add several grouping keys, they are tried in specified order - next is tried only if previous did not work. You own keys are always tried before the built-in ones.

## Context parameters

In **API Sessions**, within session, the request details by default include: 

* Parameters from [built-in set](#session-identification) presented in request.
* Parameters added by you for [session identification](#session-identification) presented in request.
* For malicious requests - full request content.

You can add any additional (context) parameters that you need to understand activities within the session. To do so, add these parameters in Wallarm Console → **API Sessions** → **Configure API Sessions**. Once added, Wallarm will export them to the Wallarm Cloud and display in Wallarm Console, in details of your session requests.

![!API Sessions - Context parameters](../images/api-sessions/api-sessions-context-parameters.png)

Be sure to hash sensitive parameters before exporting them to the Wallarm Cloud. Note that hashing will transform the actual value into unreadable - the presence of parameter and particular but unknown value will provide the limited information for the analysis.
