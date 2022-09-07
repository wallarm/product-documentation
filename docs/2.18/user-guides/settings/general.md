[link-config-parameters]:       ../../admin-en/configure-parameters-en.md#wallarm_mode

[img-general-settings]:         ../../images/user-guides/settings/general.png

# General Settings

The *General* tab of the *Settings* section allows users to switch between different Wallarm operation modes:

* **Default**: this mode exploits settings from a filter node
configuration file. 
* **Monitoring**: all requests are processed, but none of them are blocked even if an attack is detected.
* **Blocking**: all requests where an attack was detected are blocked.

To learn more about available configuration options, proceed to the [link][link-config-parameters].

![!General tab overview][img-general-settings]

!!! info "Qrator"
    Those Wallarm customers plugged in with Qrator traffic filters have the *Blocking with Qrator* setting. This setting enables automatic malicious requests blocking. The blocking is done with the Qrator IP denylists. Wallarm transfers to Qrator the data on those IP addresses from which the attacks originated.
