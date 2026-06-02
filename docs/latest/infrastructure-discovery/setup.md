# Infrastructure Discovery Setup (Early Access)

This article describes how to connect your cloud accounts to Wallarm's [Infrastructure Discovery](overview.md) and configure scanning.

!!! info "Early Access"
    Infrastructure Discovery is available as an Early Access feature with a separate subscription. Contact [sales@wallarm.com](mailto:sales@wallarm.com) to request access.

!!! info "Supported cloud providers"
    Infrastructure Discovery currently supports **AWS**. Support for **Azure** and **GCP** is coming soon.

## Requirements

* Active Infrastructure Discovery subscription
* An AWS account with permissions to create IAM roles or IAM access keys
* Network access from your AWS account to the Wallarm Cloud (no inbound firewall rules required — all communication is outbound from Wallarm)

## Connecting an AWS account

To connect an AWS account, navigate to the Infrastructure Discovery section in Wallarm Console and click **Add AWS Account**.

### Authentication type

The **Authentication Type** dropdown provides two options:

| Method | How it works | Best for |
| --- | --- | --- |
| **IAM Role** (recommended) | You create a cross-account role in your AWS account that trusts Wallarm's AWS account. Infrastructure Discovery assumes it on demand using short-lived credentials. Every assume-role call is recorded in your CloudTrail. | Production environments |
| **Access Key** | You provide an Access Key ID and Secret Access Key for an IAM user in your account. The key is long-lived and stored encrypted in Wallarm. Rotation is your responsibility. | Evaluation, sandboxes, or environments where role assumption is not available |

Both methods use the same read-only permissions and produce the same inventory.

### Required AWS permissions

Infrastructure Discovery requires **read-only** permissions aligned with the AWS services it inspects. The following IAM policy covers all supported resource types:

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
                "lambda:GetFunction",
                "lambda:GetPolicy",
                "lambda:GetFunctionConfiguration",
                "apigateway:GET"
            ],
            "Resource": "*"
        }
    ]
}
```

For [multi-account setup](#multi-account-setup) via AWS Organizations, add the following permissions to the management account role:

```json
{
    "Sid": "WallarmInfraDiscoveryOrganizations",
    "Effect": "Allow",
    "Action": [
        "organizations:List*",
        "organizations:Describe*"
    ],
    "Resource": "*"
}
```

!!! warning "No data-plane access"
    Infrastructure Discovery does **not** request data-plane permissions. It will never access your data: no `s3:GetObject`, no `rds:*Data`, no log-reading, no `kms:Decrypt`. All collected information is resource metadata only (IDs, configurations, tags, relationships).

### Setup with IAM Role

1. In the **Add AWS Account** dialog, select **IAM Role** as the authentication type.
1. Wallarm displays the **External ID** and **Wallarm AWS Account ID** required to create the trust policy.
1. In the AWS Console, create a new IAM role:
    * Set the trust policy to allow `sts:AssumeRole` from the Wallarm AWS account with the provided External ID.
    * Attach a policy granting the [required permissions](#required-aws-permissions).
1. Copy the role ARN and paste it into the Wallarm dialog.
1. Click **Add Account**. Wallarm verifies the credentials with a test API call before marking the account as connected.

### Setup with Access Key

1. In the **Add AWS Account** dialog, select **Access Key** as the authentication type.
1. In the AWS Console, create an IAM user with the [required permissions](#required-aws-permissions) and generate an access key.
1. Enter the **Access Key ID** and **Secret Access Key** in the Wallarm dialog.
1. Click **Add Account**. Wallarm verifies the credentials before marking the account as connected.

## Multi-account setup

Infrastructure Discovery is designed to scan across many AWS accounts from a single Wallarm tenant. Two approaches are available:

**Connect each account individually** — repeat the [connection steps](#connecting-an-aws-account) for every account. Simple and straightforward for a small number of accounts.

**Delegate through AWS Organizations** — if your accounts are managed by AWS Organizations, you can create a single IAM role in the management account with `organizations:List*` and `organizations:Describe*` permissions. Infrastructure Discovery will enumerate member accounts and scan them using the delegated role. This approach scales to hundreds of accounts without manual per-account setup.

## Scan schedule

Infrastructure Discovery runs automated scans every **6 hours** by default. During each scan, it enumerates all supported resource types across all connected accounts and regions.

You can trigger an on-demand scan at any time from the Infrastructure Discovery UI.
