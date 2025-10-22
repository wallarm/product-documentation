# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira) is a widely used project management and issue tracking software developed by Atlassian. You can set up Wallarm to create issues in Jira when [vulnerabilities](../../../glossary-en.md#vulnerability) are detected, all or only for the selected risk level(s) - high, medium or low.

!!! info "Supported versions"
    This integration is supported both for JIRA Cloud and on-premise solutions.

## Setting up integration

In Jira UI: 

1. Generate API token: 

    * For Jira Cloud, as described [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token). Provided token is used with `Basic` authentication.
    * For Jira on-premise, in your Jira instance, navigate to your profile settings, and create a personal access token (PAT). Provided token is used with `Bearer` authentication.

1. Copy the generated API token.

In Wallarm UI:

1. Open Wallarm Console → **Integrations** → **Jira**.
1. Enter an integration name.
1. Enter Jira host (e.g., `https://company-x.atlassian.net/`).
1. Enter the Jira user email, which Jira requires for authentication and also will be used to identify the Reporter for created issues.
1. Select token type: `Basic` for Jira Cloud and `Bearer` for Jira on-premise.
1. Paste the generated API token.

    If necessary, you can disable Jira server SSL verification.

    The email and token will be checked to authenticate Wallarm at the specified Jira host. On success, spaces available to this Jira user will be listed.

1. Select Jira space to create issues in. When selected, list of issue types supported in this space will be listed.
1. Select Jira issue type the created issues will belong to.
1. Select event types to trigger notifications. All security issues (vulnerabilities) or only of the specific risk level(s) may be selected.

    ![Jira integration](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. Click **Test integration** to check configuration correctness, availability of the target system, and the notification format.

    Test Jira issue creation:

    ![Test Jira issue creation](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
