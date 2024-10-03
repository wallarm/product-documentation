# Threat Prevention Dashboard

Review the malicious traffic characteristics for the period of time with the **Threat Prevention** dashboard. Get clear vision of the malicious traffic volume and its distribution by attack types, sources, protocols, authentication methods, etc.

The dashboard helps in identifying the threat patterns. A clear view of how attackers are trying to exploit the system enables faster detection of threats and better-informed responses. This contributes to overall security posture improvement and helps in taking proactive measures.

As different attack types (e.g., DDoS, SQL injection, brute force) and protocols (e.g., HTTP, HTTPS, FTP) may require different defense strategies, knowing the distribution of attack methods and traffic, security teams can implement specific countermeasures (e.g., rate-limiting, firewall rules, WAF configurations, etc.) that prevent further incidents.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/atbicsvjibs7" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Consider the following:

* [Hit](../../glossary-en.md#hit) is a malicious request plus metadata added by node
* Number of blocked hits may be less than detected ones as [traffic filtration mode](../../admin-en/configure-wallarm-mode.md) may be just `monitoring` for some locations
* You can read attack type descriptions [here](../../attacks-vulns-list.md)

!!! info "Getting started with Wallarm"
    If you registered the Wallarm account in the US [Cloud](../../about-wallarm/overview.md#cloud), you would be able to explore core Wallarm features in the **Playground** with read-only access to the Wallarm Console sections. Use it to try out major features of the Wallarm platform without having to deploy any components to your environment. 
    
    The Dashboard section also includes the **Get started** button for new users. When you click the button, you will get a list of helpful product discovery options with the following among them:
    
    * The **Onboarding tour** option will provide you with deployment options supported by Wallarm and links to relevant deployment instructions.
    * The **Wallarm Playground** option will forward you to the Wallarm Console playground with read-only access to its sections. This option is available only for users of the US Cloud.
