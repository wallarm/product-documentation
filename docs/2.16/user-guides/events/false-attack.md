[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-popup]:                    ../../images/user-guides/events/pop-up-accept.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png


# Working with False Attacks

A false attack is a valid request erroneously identified as an attack.

After analyzing an attack, you may conclude that all requests in this attack or the part of them are false positives.

## Mark an Attack as a False Positive

1. Select an attack in the **Events** section.
2. Collapse the list of requests in this attack.
3. Define a valid request and click **False** in the **Actions** column.

    ![!False attack][img-false-attack]
4. Confirm the action clicking the **OK** button in the modal window.

    ![!The pop-up message][img-popup]

If all the requests in the attack are marked as the false positives, then the information about that attack will look like this:

![!The whole attack is marked as false one][img-removed-attack-info]

Wallarm will reconfigure the traffic filtration rules. These requests will not be detected as an attack from now on.

!!! info "See also"
    [Analyzing attacks][link-analyzing-attacks]
