Once the malicious request is detected by Wallarm and displayed in the [**Attacks**][link-attacks] or [**Incidents**][link-incidents] section as the part of some attack, you have an ability to know the full context of this request: to which user session it belongs and what the full sequence of requests in this session is. This allows investigating all activity of the threat actor to understand attack vectors and what resources can be compromised.

To perform this analysis, in Wallarm Console → **Attacks** or **Incidents**, access the attack, and then specific request details. In request details, click **Explore in API Sessions**. Wallarm will open the [**API Session**][link-sessions] section filtered: the session, the initial request belongs to is displayed, only the initial request is displayed within this session.

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(58.36% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/psopwjk9vfas?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Remove the filter by request ID to see all other requests in the session: now you have the full picture of what was going on within the session the malicious request belongs to.