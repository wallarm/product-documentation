# File Upload Restriction Policy <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

<!--intro TBD-->

Wallarm provides the **File upload restriction policy** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

!!! tip ""
    Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

## Creating and applying mitigation control

!!! info "Generic information on mitigation controls"
    Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope** and **Mitigation mode** are set for any mitigation control.

To configure file upload restriction policy:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **File upload restriction policy**.
1. Describe the **Scope** to apply the mitigation control to.
1. Set **Size restrictions** for full request or its selected point.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

<!--### Mitigation control examples

TBD

### Viewing detected attacks in API Sessions

TBD-->
