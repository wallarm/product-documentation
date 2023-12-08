# Optimizing Attack Analysis

You can optimize the lists of attacks and incidents by grouping [hits](../../glossary-en.md#hit) sent from the same IP address into one attack.

## Configuring

When grouping, hits can have different attack types, malicious payloads and URLs. These attack parameters will be marked with the `multiple` tag in the event list.

Only hits sent after exceeding the set threshold are grouped into the attack. The Mark as false positive button will be unavailable for the whole attack, but you still will be able to mark certain hits as false positives. Active verification of the attack will also be unavailable.

The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

To configure grouping hits sent from the same IP address into one attack:

1. Open Wallarm Console → section **Triggers** and open the window for trigger creation.
1. Select the **Hits from the same IP** condition.
1. Set the threshold per time interval.
1. Set the **Grouping hits from the same IP** reaction.
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

## Pre-configured trigger

New company accounts are featured by the pre-configured (default) **Hits from the same IP** trigger which groups hits originating from the same IP into one attack

The trigger groups all [hits](../../glossary-en.md#hit) sent from the same IP address into one attack in the event list. This optimizes the event list and enables faster attack analysis.

This trigger is released when a single IP address originates more than 50 hits within 15 minutes. Only hits sent after exceeding the threshold are grouped into the attack.

Hits can have different attack types, malicious payloads and URLs. These attack parameters will be marked with the `[multiple]` tag in the event list.

Due to different parameter values of grouped hits, the [Mark as false positive](../events/false-attack.md#mark-an-attack-as-a-false-positive) button will be unavailable for the whole attack, but you still will be able to mark certain hits as false positives. [Active verification of the attack](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) will also be unavailable.
    
The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

!!! info "Modifying default trigger"
    You can temporary disable, modify or delete the default trigger.

## Example

In this example, if more than 50 [hits](../../about-wallarm/protecting-against-attacks.md#hit) from the same IP address are detected in 15 minutes, the next hits from the same IP will be grouped into one attack in the [event list](../events/check-attack.md).

If you have recently created the Wallarm account, this [trigger is already created and enabled](triggers.md#pre-configured-triggers-default-triggers). You can edit, disable, delete, or copy this trigger as well as the manually created triggers.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

**To test the trigger**, send 51 or more hits as follows:

* All hits are sent in 15 minutes
* The IP addresses of the hit sources are the same
* Hits have different attack types or parameters with malicious payloads or addresses the hits are sent to (so that the hits are not [grouped](../../about-wallarm/protecting-against-attacks.md#attack) into an attack by the basic method)
* Attack types are different from Brute force, Forced browsing, Resource overlimit, Data bomb and Virtual patch

Example:

* 10 hits to `example.com`
* 20 hits to `test.com`
* 40 hits to `example-domain.com`

The first 50 hits will appear in the event list as individual hits. All of the following hits will be grouped into one attack, e.g.:

![Hits grouped by IP into one attack](../../images/user-guides/events/attack-from-grouped-hits.png)

The [**Mark as false positive**](../events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option will be unavailable for the attack.
