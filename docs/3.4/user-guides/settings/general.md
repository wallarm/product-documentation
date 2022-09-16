[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# General Settings

On the **General** tab of the **Settings** section you can:

* Switch Wallarm filtration mode
* Manage automatic logout timeouts

## Filtration mode

Every Wallarm node can identify and block attacks at the HTTP request level. This [filtration mode][link-config-parameters] is defined by the local or global settings:

* **Local settings (default)**: this mode exploits settings from a filter node configuration file.
* **Safe blocking**: all malicious requests originated from [graylisted IPs](../ip-lists/graylist.md) are blocked.
* **Monitoring**: all requests are processed, but none of them are blocked even if an attack is detected.
* **Blocking**: all requests where an attack was detected are blocked.

!!! warning "Changes in the `off` and `monitoring` filtration mode logic"
    Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [denylisted](../ip-lists/denylist.md) IP, it does not block this request.
    * If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [allowlisted](../ip-lists/allowlist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of Wallarm Console.

    During the [Wallarm module upgrade](../../updating-migrating/general-recommendations.md), please ensure that deployed Wallarm node 3.2 processes requests as expected or adjust filtration mode settings to the released changes.

    If you have already updated modules, please adjust the filtration mode settings to changes released in version 3.2 (if necessary). [Details on filtration mode configuration](../../admin-en/configure-wallarm-mode.md)

![!General tab overview][img-general-settings]

!!! info "Qrator"
    Those Wallarm customers plugged in with Qrator traffic filters have the *Blocking with Qrator* setting. This setting enables automatic malicious requests blocking. The blocking is done with the Qrator IP denylists. Wallarm transfers to Qrator the data on those IP addresses from which the attacks originated.

## Logout management

Administrators can set up logout timeouts for company account. Settings will affect all account users. Idle and absolute timeouts can be set.

![!General tab - Logout management](../../images/configuration-guides/configure-wallarm-mode/en/general-settings-logout-management.png)
