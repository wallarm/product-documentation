# Configuring API Discovery

If the [API Discovery](../../about-wallarm/api-discovery.md) subscription is purchased for your company account, you can enable/disable traffic analysis with API Discovery in Wallarm Console → **Settings** → **API Discovery**.

!!! warning "Administrator access"
    Only users with the following roles can access the section **Settings** → **API Discovery**:

    * **Administrator** of your Wallarm company account
    * **Global administrator** of your Wallarm partner

## Enabling or disabling existing applications

You may enable/disable API Discovery for all applications or only the selected ones.

![!API Discovery – Settings](../../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

## Adding new applications

When you add a new application in **Settings** → **[Applications](applications.md)**, it is automatically added to the list in **Settings** → **API Discovery**. If the **API Discovery** module is enabled, then building the API structure will be enabled for the new application by default.

## Configuring risk score calculation

You can configure the weight of each factor in [risk score](../../about-wallarm/api-discovery.md#endpoint-risk-score) calculation and calculation method.

Defaults: 

* Calculation method: `Use the highest weight from all criteria as endpoint risk score`.
* Default factor weights:

    | Factor | Weight |
    | --- | --- |
    | Active vulnerabilities | 9 |
    | Potentially vulnerable to BOLA | 6 |
    | Parameters with sensitive data | 8 |
    | Number of query and body parameters | 6 |
    | Accepts XML / JSON objects | 6 |
    | Allows uploading files to the server | 6 |

To change how risk score is calculated: 

1. Go to **Settings** → **API Discovery** → **Configure risk score**.
1. Select calculation method: highest or average weight.
1. If necessary, disable factors you do not want to affect a risk score.
1. Set weight for the remaining.
   ![!API Discovery - Risk score setup](../../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

1. Save changes. Wallarm will re-calculate risk score for your endpoints in accordance with the new settings in several minutes.
