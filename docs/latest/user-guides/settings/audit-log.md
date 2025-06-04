# Activity Log

In the **Settings** → **Activity Log** section of Wallarm Console, you can check the history of activities in the Wallarm system. 

![Activity log](../../images/user-guides/settings/audit-log.png)

## Analyzing log

You can filter Activity Log to see only activities:

* For the specified dates
* By specific actor (search by name, email, filter by ID)
* For specific object types
* With specific **Action**: `Create`, `Update`, `Delete`
* With specific **Source** - authentication used for the action: `UI`, `Node`, `API token`

Click the eye icon in the **Changes** column to see the details on action, like what was the previous and new value of something:

![Activity log - details of activity](../../images/user-guides/settings/audit-log-details.png)

## Object types

The Log include information about creating, updating and deleting of the following types of objects:

* [Client](../../installation/multi-tenant/overview.md)
* [Partner](../../installation/multi-tenant/overview.md)
* [User](users.md)
* [Login](users.md)
* [Subscription](../../about-wallarm/subscription-plans.md)
* [Application](applications.md)
* [Group](../../admin-en/configuration-guides/sso/setup.md#tenant-dependent-permissions)
* [Invitation](../../user-guides/settings/users.md#inviting-users)
* [Integration](../../user-guides/settings/integrations/integrations-intro.md)
* [API token](../../user-guides/settings/api-tokens.md)
* [Node token](../../user-guides/settings/api-tokens.md#api-tokens-vs-node-tokens)
* [Node](../nodes/nodes.md)

## Export to CSV

You can export currently displayed data (taking into account filters) to CSV with the **Export CSV** button on the top.
