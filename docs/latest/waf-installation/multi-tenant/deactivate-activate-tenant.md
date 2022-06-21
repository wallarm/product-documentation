# Deactivating and activating tenant accounts in Wallarm Console

The user with the **Global administrator** role can deactivate [tenant accounts](configure-accounts.md) linked to the global account this administrator serves. When the tenant account is deactivated:

* Users of this tenant account has no access to Wallarm Console.
* Filtering node(s) installed on this [tenant level](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) will stop traffic processing.

Deactivated accounts are not deleted and can be activated again.

## Deactivating tenant account

To deactivate a tenant account:

1. Log in Wallarm Console under the user with the **Global administrator** role.
1. Access the tenant selector.
1. In the tenant menu select **Deactivate**. The confirmation dialog is displayed.

    ![!Tenant - Deactivate](../../images/partner-waf-node/tenant-deactivate.png)

1. In the confirmation dialog, confirm tenant name, then click **Yes, deactivate**. The tenant account is deactivated and hidden from the tenant list.

## Activating tenant account

To activate previously deactivated tenant account:

1. In the tenant selector, click **Show deactivated tenants**. Deactivated tenants are displayed along with all the others. They are highlighted.
1. In the tenant menu select **Activate**. The confirmation dialog is displayed.

    ![!Tenant - Activate](../../images/partner-waf-node/tenant-activate.png)

1. In the confirmation dialog, click **Yes, activate**. The tenant account is activated.