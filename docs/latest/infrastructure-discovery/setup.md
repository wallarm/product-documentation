# Infrastructure Discovery Setup

This article describes how to connect your cloud accounts to Wallarm's [Infrastructure Discovery](overview.md) and configure scanning.

!!! info "Subscription"
    Infrastructure Discovery requires a separate subscription. Contact [sales@wallarm.com](mailto:sales@wallarm.com) to request access.

!!! info "Supported cloud providers"
    Infrastructure Discovery currently supports **AWS**. Support for **Azure** and **GCP** is coming soon.

## Requirements

* Active Infrastructure Discovery subscription
* An AWS account with permissions to create a CloudFormation stack (for the IAM Role method) or an IAM access key
* Network access from your AWS account to the Wallarm Cloud (no inbound firewall rules required — all communication is outbound from Wallarm)

## Connecting an AWS account

To connect an AWS account, open **Settings** in the Infrastructure Discovery section of Wallarm Console and click **Add Account** on the **Accounts** tab.

### Authentication type

The **Authentication Type** dropdown provides two options:

| Method | How it works | Best for |
| --- | --- | --- |
| **IAM Role** (recommended) | Wallarm provides a CloudFormation template that creates a read-only cross-account role scoped to your Wallarm tenant. Infrastructure Discovery assumes the role on demand using short-lived credentials, and every assume-role call is recorded in your CloudTrail. | Production environments |
| **Access Key** | You provide an Access Key ID and Secret Access Key for an IAM user in your account. The key is long-lived and stored encrypted in Wallarm. Rotation is your responsibility. | Evaluation, sandboxes, or environments where role assumption is not available |

Both methods use the same read-only permissions and produce the same inventory.

### Required AWS permissions

Infrastructure Discovery requires **read-only** permissions aligned with the AWS services it inspects. When you use the IAM Role method, the CloudFormation template grants these permissions for you — the policy below is shown for review. When you connect with an access key, attach a policy with the same permissions to the IAM user. The following IAM policy covers all supported resource types:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "WallarmInfraDiscoveryReadOnly",
            "Effect": "Allow",
            "Action": [
                "ec2:Describe*",
                "elasticloadbalancing:Describe*",
                "eks:List*",
                "eks:Describe*",
                "lambda:List*",
                "apigateway:GET",
                "iam:List*",
                "iam:Get*",
                "bedrock:List*",
                "bedrock:Get*",
                "securityhub:GetFindings",
                "securityhub:ListFindingAggregators",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

The policy grants read-only access only. The `iam:Get*` and `iam:List*` actions allow Infrastructure Discovery to inventory IAM roles, users, groups, and policies; they do not allow it to create, modify, or delete any IAM entity. The `bedrock:*` actions cover Amazon Bedrock foundation models, custom models, agents, and knowledge bases. The `securityhub:*` actions let Infrastructure Discovery import existing AWS Security Hub findings and correlate them with discovered resources.

For [multi-account setup](#multi-account-setup) via AWS Organizations, add the following permission to the management account role:

```json
{
    "Sid": "WallarmInfraDiscoveryOrganizations",
    "Effect": "Allow",
    "Action": [
        "organizations:ListAccounts"
    ],
    "Resource": "*"
}
```

!!! warning "No data-plane access"
    Infrastructure Discovery does **not** request data-plane permissions. It will never access your data: no `s3:GetObject`, no `rds:*Data`, no log-reading, no `kms:Decrypt`. All collected information is resource metadata only (IDs, configurations, tags, relationships).

### Setup with IAM Role

The **Add AWS account** wizard guides you through three steps:

1. **Choose authentication method** — select **IAM role**, enter an **Account name**, and click **Next**.
1. **Deploy CloudFormation** — click **Launch in AWS Console** to open AWS CloudFormation with the `Wallarm-Discovery-Role.yaml` template pre-filled for your Wallarm tenant (or click **Download template** to apply it manually). Create the stack — it takes about a minute — then copy the `DiscoveryRoleArn` value from the stack outputs, paste it into the **IAM Role ARN** field, and click **Next**.
1. **Schedule discovery scans** — keep **Enable scheduled discovery scan** on, set the **Scan Interval (Minutes)**, and click **Add account**.

The template creates the read-only role and a trust policy scoped to your Wallarm tenant, so you do not configure trust settings or an external ID manually.

### Setup with Access Key

The wizard guides you through three steps:

1. **Choose authentication method** — select **Access Key**, enter an **Account name**, and click **Next**.
1. **Account details** — enter the **Account ID**, the **Default region**, and the **Access Key ID** and **Secret Access Key** of a read-only IAM user, then click **Next**. Attach a policy with the [required permissions](#required-aws-permissions) to that user.
1. **Schedule discovery scans** — keep **Enable scheduled discovery scan** on, set the **Scan Interval (Minutes)**, and click **Add account**.

## Multi-account setup

Infrastructure Discovery is designed to scan across many AWS accounts from a single Wallarm tenant. Two approaches are available:

**Connect each account individually** — repeat the [connection steps](#connecting-an-aws-account) for every account. Simple and straightforward for a small number of accounts.

**Delegate through AWS Organizations** — if your accounts are managed by AWS Organizations, you can create a single IAM role in the management account with the `organizations:ListAccounts` permission. Infrastructure Discovery enumerates member accounts and scans them using the delegated role. This approach scales to hundreds of accounts without manual per-account setup.

## Scan schedule

Infrastructure Discovery scans your connected accounts on a recurring schedule. On the **Schedules** tab in **Settings**, you create a schedule for an account and region and set how often it runs (the scan interval, in minutes). The minimum interval depends on your subscription plan — the free tier is limited to one scan every 24 hours, and paid plans allow more frequent scans.

You can also run an on-demand scan at any time with the **Quick Scan** action on the **Accounts** tab.

During each scan, Infrastructure Discovery enumerates all supported resource types across the account's selected regions.

## Subscription limits

Your subscription plan determines:

* The number of AWS accounts you can connect
* The number of regions you can scan per account
* How frequently scans run (see [Scan schedule](#scan-schedule))

The free tier includes a limited number of accounts and regions and a fixed 24-hour scan interval. Paid plans raise these limits and allow more frequent scans. Contact your Wallarm account team for the limits that apply to your plan.
