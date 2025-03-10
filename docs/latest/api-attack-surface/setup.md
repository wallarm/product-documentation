# API Attack Surface Setup  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

To configure [API Attack Surface Management](overview.md) to detect hosts under your selected domains and search for security issues related to these hosts, in Wallarm Console → AASM → **API Attack Surface** section, click **Configure**. Add your domains to the scope, check the scanning status.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Wallarm will list all hosts under your domains and show security issues related to them if there are any. Note that domains are automatically re-scanned once every 3 days - new hosts will be added automatically, previously listed but not found during re-scan will remain in the list.

You can re-start, pause or continue scanning for any domain manually at **Configure** → **Status**.