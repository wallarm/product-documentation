[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:           ../../images/user-guides/events/cloud.png#mini

[al-brute-force-attack]:      ../../attacks-vulns-list.md#bruteforce-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing

# Verifying Attacks

Wallarm automatically rechecks attacks.

You can check the attack verification status and force an attack recheck on the *Events* tab.

![!Attacks with various verification statuses][img-verification-statuses]

## Check the Attack Verification Status

1. Click the *Events* tab.
2. Check the status in the "Verification" column.

## Attack Verification Status Legend

* ![!Verified][img-verified-icon] *Verified*: The attack has been verified.
* ![!Error][img-error-icon] *Error*: An attempt to verify an attack type that does not support verification.
* ![!Forced][img-forced-icon] *Forced*: The attack has a raised priority in the verification queue.
* ![!Sheduled][img-sheduled-icon] *Scheduled*: The attack is queued for verification.
* ![!Could not connect][img-cloud-icon] *Could not connect to the server*: It is not possible to access the server at this time.

## Forcing an Attack Verification

1. Select an attack.
2. Click the status sign in the "Verification" column.
3. Click *Force verification*.

Wallarm will raise the priority of the attack verification in the queue.

![!Attacks verification][img-verify-attack]

## Attack Types that Do Not Support Verification

Attacks of the following types do not support verification:
* [Brute-force][al-brute-force-attack].
* [Forced browsing][al-forced-browsing].
* Attacks with a request processing limit.
* Attacks for which the vulnerabilities have already been closed.
* Attacks that do not contain enough data for verification.
