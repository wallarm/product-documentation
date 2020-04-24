[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:     ../../images/user-guides/events/false-attack.png

# Working with False Attacks

A false attack is a valid request erroneously qualified as an attack.

After analyzing an attack, you may conclude that the attack is a false positive.

## Mark an Attack as a False Positive

1. Select an attack.
2. Click a number in the *Requests* column.
3. Click *False* in the *Actions* column.

![!False attack][img-false-attack]

Wallarm will remove all the requests associated with this attack and reconfigure
the traffic filtration rules. These requests will not be detected as an attack from
now on.

!!! info "See also"
    [Analyzing attacks][link-analyzing-attacks]
