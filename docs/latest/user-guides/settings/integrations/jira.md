#   Jira

You can set up Wallarm to create issues in Jira when [vulnerabilities](../../../glossary-en.md#vulnerability) are detected, all or only for the selected risk level(s):
* High risk
* Medium risk
* Low risk

##  Setting up integration

In Jira UI: 

1. Generate API token as described [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token).
1. Copy the generated API token.

In Wallarm UI:

1. Open the **Integrations** section.
1. Perform the next steps in the **Incident and task management systems** section.
1. Click the **Jira** block or click the **Add integration** button and choose **Jira**.
1. Enter an integration name.
1. Enter Jira host (e.g., `https://company-x.atlassian.net/`).
1. Specify issuer email, which is required for Jira authentication, and also wll be used for the created issues as their author info.
1. Paste the generated API token. Authentication data (host, email, token) will be checked.
1. Select Jira space to create issues in. Available only on successful authentication.
1. Select Jira issue type the created issues will belong to. Available only after selecting the space.
1. Select event types to trigger notifications. All vulnerabilities or only of the specific risk level(s) may be selected. If nothing is selected, Jira issues will not be created.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

    ![!Jira integration](../../../images/user-guides/settings/integrations/add-jira-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration.md"

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
