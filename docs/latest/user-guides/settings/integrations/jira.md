# Atlassian Jira

You can set up Wallarm to create issues in Jira when [vulnerabilities](../../../glossary-en.md#vulnerability) are detected, all or only for the selected risk level(s):

* High risk
* Medium risk
* Low risk

## Setting up integration

In Jira UI: 

1. Generate API token as described [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token).
1. Copy the generated API token.

In Wallarm UI:

1. Open Wallarm Console → **Integrations** → **Jira**.
1. Enter an integration name.
1. Enter Jira host (e.g., `https://company-x.atlassian.net/`).
1. Enter the Jira user email, which Jira requires for authentication and also will be used to identify the Reporter for created issues.
1. Paste the generated API token. The email and token will be checked to authenticate Wallarm at the specified Jira host. On success, spaces available to this Jira user will be listed.
1. Select Jira space to create issues in. When selected, list of issue types supported in this space will be listed.
1. Select Jira issue type the created issues will belong to.
1. Select event types to trigger notifications. All vulnerabilities or only of the specific risk level(s) may be selected.

    ![Jira integration](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    Test Jira issue creation:

    ![Test Jira issue creation](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. Click **Add integration**.

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
