Once the malicious request is detected by Wallarm and displayed in the [**Attacks**][link-attacks] or [**Incidents**][link-incidents] section as the part of some attack, you can see the full context of this request: to which user session it belongs and what the full sequence of requests in this session is. This allows you to investigate all activity of the threat actor to understand attack vectors and what resources can be compromised.

To perform this analysis, in Wallarm Console → [**Attacks**][link-attacks], open the attack, switch to the **Requests** tab, and select a request. In the request details, open the **Session ID** field menu and select **Investigate this attack in API Sessions**.

In [**Incidents**][link-incidents], access the incident and then the request details, and click **Explore in API Sessions**.

Wallarm opens the [**API Sessions**][link-sessions] section filtered: the session that the initial request belongs to is displayed; only the initial request is displayed within this session.

Remove the filter by request ID to see all other requests in the session: now you have the full picture of what was going on within the session the malicious request belongs to.