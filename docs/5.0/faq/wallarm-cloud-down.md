# Wallarm Cloud is down

If the Wallarm Cloud is down, Wallarm nodes continue attack mitigation with some limitations. To learn more, use this troubleshooting guide.

## How does Wallarm node operate if Wallarm Cloud is down?

The Wallarm Cloud is an extremely stable and scalable service. Additionally, all your company's account data is protected by [backups](#how-does-wallarm-protect-its-cloud-data-from-loss).

However, if in rare cases the Wallarm Cloud temporarily goes down (for example, on pausing for maintenance), a Wallarm node continues operating although with some limitations.

!!! info "Checking Wallarm Cloud status"
    To check the Wallarm Cloud status, visit [status.wallarm.com](https://status.wallarm.com/). To stay informed, subscribe to updates.

What continues to work:

* Traffic processing in the configured [mode](../admin-en/configure-wallarm-mode.md#available-filtration-modes) using the rules uploaded to the node during last successful [synchronization](../admin-en/configure-cloud-node-synchronization-en.md) between the Cloud and the node. The node can continue to work as the latest versions of the following elements are uploaded from the Cloud according to the schedule and stored on the node locally:

    * [Custom ruleset](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)

* The [IP lists](../user-guides/ip-lists/overview.md) are also uploaded to the node and stored within it. The uploaded addresses will continue to be handled but only until expiration date/time.

    These dates/times will not be updated until the Cloud is restored and synced; also there will be no new/removed addresses until the Cloud restoration/synchronization.

    Note that expiration of some IP addresses in the lists leads to cease of protection from the [brute force attacks](../admin-en/configuration-guides/protecting-against-bruteforce.md) related to these addresses.

What stops working:

* The node collects but cannot send data on detected attacks and vulnerabilities to the Cloud. Note that your node [postanalytics module](../admin-en/installation-postanalytics-en.md) has an in-memory storage (Tarantool) where the collected data is temporarily stored before sending to the Cloud. As soon as Cloud is restored, buffered data will be sent to it.

    !!! warning "Node in-memory storage limitation"
        The size of the buffer is [limited](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) and when exceeded, the older data is deleted. So the amount of time the Cloud was down and the amount of information collected during this time may lead to the situation when you get in Wallarm Console only some data after the Cloud restoration.

* The node collects but cannot send [metrics](../admin-en/configure-statistics-service.md) for processed traffic to the Cloud.
* Scanning for the [exposed assets](../user-guides/scanner.md) and [typical vulnerabilities](../user-guides/vulnerabilities.md) will stop.
* [Triggers](../user-guides/triggers/triggers.md) will stop working and thus:
    * [IP lists](../user-guides/ip-lists/overview.md) stop being updated.
    * [Trigger-based notifications](../user-guides/triggers/triggers.md) will not popup.
* [Discovering API inventory](../api-discovery/overview.md) will not work.
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) will stop.
* [Brute force attacks](../admin-en/configuration-guides/protecting-against-bruteforce.md) will not be detected.
* Integrations will stop, including that:
    * Instant and email [notifications](../user-guides/settings/integrations/integrations-intro.md) will not popup.
    * Reporting will stop.
* No access to Wallarm Console.
* [Wallarm API](../api/overview.md) will not respond.

Note that besides the entire down state described above, sometimes only particular services may be temporarily inaccessible, while the others continue functioning. If this is the case, the [status.wallarm.com](https://status.wallarm.com/) service will provide you the corresponding information.

## What happens after Cloud restoration?

After Cloud restoration:

* Access to Wallarm Console is restored.
* The node sends buffered information to the Cloud (consider limitations above).
* Triggers react to the new data by sending notifications and updating IPs.
* If any changes in IPs, they are sent to the node during next synchronization.
* If there was an [unfinished custom ruleset](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down) build, it is restarted.
* The Cloud and the filtering node synchronize on schedule in a usual way.

## Is there a case when node did not get settings saved in Wallarm Console before Wallarm Cloud is down?

Yes, this is possible. For example, let us consider that the [synchronization](../admin-en/configure-cloud-node-synchronization-en.md) interval is 3 minutes and:

1. The last build of the custom ruleset was finished on the Cloud 21 minutes ago and it was uploaded to the node 20 minutes ago.
2. During the next 6 synchronizations nothing was taken from the Cloud as there was nothing new.
3. Then the rules were changed on the Cloud and a new build started - the build needed 4 minutes to finish but in 2 minutes the Cloud went down.
4. A node only takes the finished build, so within 2 minutes synchronizations will give nothing to upload to the node.
5. In 1 more minute, the node comes with the new synchronization request but Cloud does not respond.
6. The node will continue to filter according to the custom ruleset with an age of 24 minutes and this age will grow while Cloud is down.

## How does Wallarm protect its Cloud data from loss?

The Wallarm Cloud saves **all the data** provided by a user in Wallarm Console and uploaded to it from the nodes. As mentioned above, the Wallarm Cloud temporarily going down is an extremely rare case. But if this happens the chance is significantly low that down state will affect saved data. It means that after restoration you will immediately continue working with all your data.

To deal with the low chance that the hard drives storing actual data of the Wallarm Cloud are destroyed, Wallarm automatically creates backups and restores from them if necessary:

* RPO: backup is created every 24 hours
* RTO: the system will be available again no more than in 48 hours
* 14 latest backups are stored

!!! info "RPO/RTO protection and availability parameters"
    * **RPO (recovery point objective)** is used for determining the frequency of data backup: defines the maximum amount of time for which the data can be lost.
    * **RTO (recovery time objective)** is the amount of real time a business has to restore its processes at an acceptable service level after a disaster to avoid intolerable consequences associated with the disruption.

For further information on Wallarm disaster recovery (DR) plan and its peculiarities for your company, [contact Wallarm support](mailto:support@wallarm.com).
