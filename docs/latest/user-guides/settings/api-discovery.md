# Configuring API Discovery

If the [API Discovery](../../about-wallarm-waf/api-discovery.md) subscription is purchased for your company account, you can enable/disable traffic analysis with API Discovery in Wallarm Console → **Settings** → **API Discovery**.

!!! warning "Administrator access"
    Only users with the following roles can access the section **Settings** → **API Discovery**:

    * **Administrator** of your Wallarm company account
    * **Global administrator** of your Wallarm partner

## Enabling or disabling existing applications

You may enable/disable API Discovery for all applications or only the selected ones.

![!API Discovery – Settings](../../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

## Adding new applications

When you add a new application in **Settings** → **[Applications](applications.md)**, it is automatically added to the list in **Settings** → **API Discovery**. If the **API Discovery** module is enabled, then building the API structure will be enabled for the new application by default.