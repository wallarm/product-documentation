[link-config-parameters]:       ../../admin-en/configure-parameters-en.md#wallarm_mode

[img-general-settings]:         ../../images/user-guides/settings/general.png

# General Settings

On the **General** tab of the **Settings** section you can:

* Switch Wallarm filtration mode
* Manage automatic logout timeouts

## Filtration mode

Every Wallarm node can identify and block attacks at the HTTP request level. This [filtration mode][link-config-parameters] is defined by the local or global settings:

* **Default**: this mode exploits settings from a filter node
configuration file. 
* **Monitoring**: all requests are processed, but none of them are blocked even if an attack is detected.
* **Blocking**: all requests where an attack was detected are blocked.

To learn more about available configuration options, proceed to the [link][link-config-parameters].

![!General tab overview][img-general-settings]

!!! info "Qrator"
    Those Wallarm customers plugged in with Qrator traffic filters have the *Blocking with Qrator* setting. This setting enables automatic malicious requests blocking. The blocking is done with the Qrator IP denylists. Wallarm transfers to Qrator the data on those IP addresses from which the attacks originated.
    
## Logout management

Administrators can set up logout timeouts for company account. Settings will affect all account users. Idle and absolute timeouts can be set.

![!General tab - Logout management](../../images/configuration-guides/configure-wallarm-mode/en/general-settings-logout-management.png)
