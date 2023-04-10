# AWS S3

You can set up Wallarm to TBD.

Usually integrations do something when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations.md"

But AWS S3 integration is different: TBD.

## Setting up integration

When setting up the integration with Amazon S3, you need to decide which method of authorization you will use:

* Via role ARN (recommended)
* Via secret access key

In the Amazon S3 UI:

1. Create an Amazon S3 bucket for Wallarm following the [instructions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).
1. Navigate to your bucket → **Properties** tab and copy the code of your bucket's **AWS Region**, for example `us-west-1`.
1. If you selected authorization via secret access key, navigate to IAM → Dashboard → **Manage access keys** → **Access keys** section. Get ID of access key that you store somewhere or create new/restore lost key as described [here](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/). Anyway, you will need your active key and its ID.

In the Wallarm Console UI:

1. Open the **Integrations** section.
1. Click the **AWS S3** block or click the **Add integration** button and choose **AWS S3**.
1. Enter an integration name.
1. Enter the previously copied AWS region code of your S3 bucket.
1. Enter your S3 bucket name.
1. Configure permissions for Wallarm to access your S3 bucket.

    === "Role ARN"
        1. Steps TBD.
    === "Secret access key"
        1. Click the **Secret access key** tab.
        1. Enter access key ID.
        1. Enter secret access key.

1. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

      ![!Amazon-S3 integration](../../../images/user-guides/settings/integrations/TBD.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

Test Slack message from the user **wallarm**:

```
Image or text TBD.
```

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
