# API Abuse Prevention profile management

In the **API Abuse Prevention** section of Wallarm Console you can manage bot protection profiles that are required configuration of the [**API Abuse Prevention**](../about-wallarm/api-abuse-prevention.md) module.

The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** or **Analyst** for the regular accounts.
* **Global Administrator** or **Global Analyst** for the accounts with the multitenancy feature.

## Creating a bot protection profile

To create a bot protection profile:

1. Make sure you learned the [**API Abuse Prevention**](../about-wallarm/api-abuse-prevention.md) module.
1. Make sure that your traffic is filtered by the Wallarm node 4.2 or later.
1. Add the **API Abuse Prevention** [module](../about-wallarm/subscription-plans.md#modules) to your subscription. To add the module, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. Enable API Abuse Prevention for the required [applications](settings/applications.md) by creating the API Abuse profile in Wallarm Console → **API Abuse Prevention**.

    ![!API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    The profile should only point to applications you want to protect from malicious bots, no specific configuration is required.

Once the bot protection profile is configured, the module will start the [traffic analysis and blocking supported automated threats](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works).

## Disabling a bot protection profile

Disabled profiles are the ones that the **API Abuse Prevention** module does not use during traffic analysis but that are still displayed in the profile list. You can re-enable disabled profiles at any moment. If there are no enabled profiles, the module does not block malicious bots.

You can disable the profile by using the corresponding **Disable** option.

## Deleting a bot protection profile

Deleted profiles are the ones that cannot be restored and that the **API Abuse Prevention** module does not use during traffic analysis.

You can delete the profile by using the corresponding **Delete** option.
