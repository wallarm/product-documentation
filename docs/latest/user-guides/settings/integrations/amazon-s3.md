# Amazon S3

You can set up Wallarm to send files with the information about detected hits to your Amazon S3 bucket. Information will be sent in the files of JSON format each 10 minutes.

Data fields for each hit:

* `time` - date and time of hit detection
* `request_id`
* `IP` - attacker's IP
* Hit source type: `datacenter`, `proxy_type`, `tor`, `remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload` 
* `point`
* `tags`

Files placed to your S3 bucket are named as `wallarm_hits_{timestamp}.json`.

## Setting up integration

When setting up the integration with Amazon S3, you need to decide which method of authorization you will use:

* **Via role ARN (recommended)** - using roles with external ID option to grant access to resources is [recommended](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console) by AWS as method increasing the security and preventing "confused deputy" attacks. Wallarm provides such ID unique for your organization account.
* **Via secret access key** - more common, simpler method, requiring shared [access key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) of your AWS IAM user. If you select this method, it is recommended to use access key of a separate IAM user with only permission of writing to the S3 bucket used in integration.

To set up an Amazon S3 integration:

1. Create an Amazon S3 bucket for Wallarm following the [instructions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).
1. Perform different steps depending on selected authorization method.

    === "Role ARN"

        1. In AWS UI, navigate to S3 → your bucket → **Properties** tab and copy the code of your bucket's **AWS Region** and **Amazon Resource Name (ARN)**.

            For example, `us-west-1` as a region and `arn:aws:s3:::test-bucket-json` as ARN.

        1. In the Wallarm Console UI, open the **Integrations** section.
        1. Click the **AWS S3** block or click the **Add integration** button and choose **AWS S3**.
        1. Enter an integration name.
        1. Enter the previously copied AWS region code of your S3 bucket.
        1. Enter your S3 bucket name.
        1. Copy provided Wallarm account ID.
        1. Copy provided external ID.
        1. In AWS UI, initiate creation [new role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) under IAM → **Access Management** → **Roles**.
        1. Select **AWS account** → **Another AWS Account** as trusted entity type.
        1. Paste Wallarm **Account ID**.
        1. Select **Require external ID** and paste external ID provided by Wallarm.
        1. Click **Next** and create policy for you role:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<YOUR_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. Complete role creation and copy role's ARN.
        1. In the Wallarm Console UI, your integration creation dialog, at the **Role ARN** tab,  paste your role's ARN.

            ![!Amazon S3 integration](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. In AWS UI, navigate to S3 → your bucket → **Properties** tab and copy the code of your bucket's **AWS Region**, for example `us-west-1`.
        1. Navigate to IAM → Dashboard → **Manage access keys** → **Access keys** section.
        1. Get ID of access key that you store somewhere or create new/restore lost key as described [here](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/). Anyway, you will need your active key and its ID.
        1. In the Wallarm Console UI, Open the **Integrations** section.
        1. Click the **AWS S3** block or click the **Add integration** button and choose **AWS S3**.
        1. Enter an integration name.
        1. Enter the previously copied AWS region code of your S3 bucket.
        1. Enter your S3 bucket name.
        1. At the **Secret access key** tab, enter access key ID and the key itself.

1. Make sure in the **Regular notifications** section, hits in the last 10 minutes are selected to be sent. If not chosen, data will not be sent to S3 bucket.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

To control the amount of stored data, it is recommended to set up an automatic deletion of old objects from your Amazon S3 bucket as described [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).

## Testing integration

Integration testing allows checking configuration correctness, availability of the Wallarm Cloud, and the sent data format. To test the integration, you can use the **Test integration**  when creating or editing the integration.

For Amazon S3, integration test sends the JSON file with data into your bucket. Here is the example of the JSON file with the data on hits detected in the last 10 minutes:

```json
[
{
    "time":1678984671,
    "request_id":"d2a900a6efac7a7c893a00903205071a",
    "ip":"127.0.0.1",
    "datacenter":"unknown",
    "tor":"none",
    "remote_country":null,
    "application_id":null,
    "domain":"localhost",
    "method":"GET",
    "uri":"/etc/passwd",
    "protocol":"none",
    "status_code":499,
    "attack_type":"ptrav",
    "block_status":"monitored",
    "payload":[
        "/etc/passwd"
    ],
    "point":[
        "uri"
    ],
    "tags":{
        "lom_id":7,
        "libproton_version":"4.4.11",
        "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
        "wallarm_mode":"monitoring",
        "final_wallarm_mode":"monitoring"
    }
},
{
    "time":1678984675,
    "request_id":"b457fccec9c66cdb07eab7228b34eca6",
    "ip":"127.0.0.1",
    "datacenter":"unknown",
    "tor":"none",
    "remote_country":null,
    "application_id":null,
    "domain":"localhost",
    "method":"GET",
    "uri":"/etc/passwd",
    "port":45086,
    "protocol":"none",
    "status_code":499,
    "attack_type":"ptrav",
    "block_status":"monitored",
    "payload":[
        "/etc/passwd"
    ],
    "point":[
        "uri"
    ],
    "tags":{
        "lom_id":7,
        "libproton_version":"4.4.11",
        "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
        "wallarm_mode":"monitoring",
        "final_wallarm_mode":"monitoring"
    }
}
]
```

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
