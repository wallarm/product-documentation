[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# General Settings

On the **General** tab of the **Settings** section you can:

* Switch Wallarm filtration mode
* Manage automatic logout timeouts

![General tab](../../images/user-guides/settings/general-tab.png)

## Filtration mode

Every Wallarm node can identify and block attacks at the HTTP request level. This [filtration mode][link-config-parameters] is defined by the local or global settings:

* **Local settings (default)**: this mode exploits settings from a filter node configuration file.
* **Safe blocking**: all malicious requests originated from [graylisted IPs](../ip-lists/overview.md) are blocked.
* **Monitoring**: all requests are processed, but none of them are blocked even if an attack is detected.
* **Blocking**: all requests where an attack was detected are blocked.

## Logout management

[Administrators](users.md#user-roles) can set up logout timeouts for company account. Settings will affect all account users. Idle and absolute timeouts can be set.