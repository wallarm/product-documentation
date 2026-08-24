Once the malicious bot activity is detected by Wallarm's [API Abuse Prevention][link-api-abuse-prevention] and displayed in the [**Attacks**][link-attacks] section, you can see the full context of this attack's requests: which user sessions they belong to and what the full sequence of requests in each session is. This helps you investigate the actor's activity and verify whether marking it as a malicious bot was correct.

A single bot attack often spans several user sessions: the requests grouped into it come from different sessions, and the attack overview shows how many sessions are involved.

![!Attacks section - suspicious bot activity attack info][img-attacks-api-abuse]

To dig into these sessions, in Wallarm Console → [**Attacks**][link-attacks], open the bot attack and switch to the **Requests** tab. Here you can filter the requests by **Session ID** to review one session at a time. To open a session in full, select a request, open the **Session ID** field menu, and select **Investigate this attack in API Sessions**: Wallarm opens the [**API Sessions**][link-sessions] section filtered to the session related to these bot activities.

![!API Sessions section - monitored sessions][img-api-sessions-api-abuse]