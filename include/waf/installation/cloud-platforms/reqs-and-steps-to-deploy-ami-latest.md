## Requirements

* An AWS account
* Understanding of AWS EC2, Security Groups
* Any AWS region of your choice, there are no specific restrictions on the region for the Wallarm node deployment

    Wallarm supports both single availability zone (AZ) and multi availability zone deployments. In multi-AZ setups, Wallarm Nodes can be launched in separate availability zones and placed behind a Load Balancer for high availability.
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/), or [ME Cloud](https://me1.my.wallarm.com/)
* Executing all commands on a Wallarm instance as a superuser (e.g. `root`)
* No system user named `wallarm` exists 

## Installation

### 1. Launch a Wallarm Node instance

Launch an EC2 instance using the [Wallarm NGINX Node AMI](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe).

Recommended configuration: 

* Latest available [AMI version][latest-node-version]
* Any preferred AWS region
* EC2 instance type: `t3.medium` (for testing) or `m4.xlarge` (for production), [see cost guidance for details][aws-costs]
* [SSH key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) for accessing the instance
* Appropriate [VPC and subnet](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) based on your infrastructure
* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) inbound access to ports 22, 80, and 443

    !!! info "Using a security group preconfigured by Wallarm"
        When you deploy the instance and create a security group, AWS prompts you to use the one preconfigured by Wallarm. This group already has all the necessary ports open for inbound access.

        ![!Preconfigured security group][img-security-group]

* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][wallarm-api-via-proxy]
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"

### 2. Prepare the Wallarm API token

The Wallarm node needs to connect to the Wallarm Cloud using a Wallarm token of the [appropriate type][wallarm-token-types]. An API token allows you to create a node group in the Wallarm Console UI, helping you organize your node instances more effectively.

![Grouped nodes][img-grouped-nodes]

Generate a token as follows:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens), or [ME Cloud](https://me1.my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Node deployment/Deployment` usage type.
    1. Copy this token.
=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes), or [ME Cloud](https://me1.my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.

### 3. Store the token in AWS Secrets Manager (recommended)

For secure token handling, store the token in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html). 

The secret must be in the same AWS region as your Wallarm Node EC2 instance.

1. Store the token in AWS Secrets Manager:

    === "AWS Console"
        1. Open the [AWS Secrets Manager console](https://console.aws.amazon.com/secretsmanager/).
        1. Click **Store a new secret**.
        1. Select **Other type of secret**.
        1. In **Key/value pairs**, switch to **Plaintext** and paste your Wallarm API token.
        1. Click **Next**, set the secret name to `wallarm/api-token`, then complete the wizard.
    === "AWS CLI"
        If you have the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured, run the [`aws secretsmanager`](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/) command:

        ```bash
        aws secretsmanager create-secret \
          --region <AWS_REGION> \
          --name wallarm/api-token \
          --description "Wallarm node API token" \
          --secret-string "<YOUR_WALLARM_API_TOKEN>"
        ```

    ![Secret with Wallarm token in AWS Secrets Manager][img-secret-with-wallarm-token]

1. Grant the EC2 instance access to the secret. Create an IAM policy with least-privilege access to the secret, then attach it to the EC2 instance via an [IAM role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html).

    === "AWS Console"
        1. Open the [IAM console → Policies](https://console.aws.amazon.com/iam/home#/policies) and click **Create policy**.
        1. Switch to the **JSON** tab and paste the policy.

            ```json
            {
            "Version": "2012-10-17",
            "Statement": [
                {
                "Effect": "Allow",
                "Action": [
                    "secretsmanager:GetSecretValue"
                ],
                "Resource": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:wallarm/api-token*"
                }
              ]
            }
            ```

            Replace `<REGION>` and `<ACCOUNT_ID>` with your values.

            If the secret is encrypted with a [customer managed KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk) (rather than the default AWS managed key), also add `kms:Decrypt` permission for that key.

        1. Name the policy (e.g., `WallarmSecretsReadOnly`) and create it.
        1. Open the [IAM console → Roles](https://console.aws.amazon.com/iam/home#/roles) and click **Create role**.
        1. Select **AWS service** → **EC2** as the trusted entity, then click **Next**.
        1. Attach the `WallarmSecretsReadOnly` policy and complete the wizard.
        1. Open the [EC2 console](https://console.aws.amazon.com/ec2/), select your Wallarm Node instance, then go to **Actions → Security → Modify IAM role** and attach the role you created.

    === "AWS CLI"
        1. Create a trust policy file that allows EC2 to assume the role:

            ```bash
            cat > trust-policy.json << 'EOF'
            {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": { "Service": "ec2.amazonaws.com" },
                  "Action": "sts:AssumeRole"
                }
              ]
            }
            EOF
            ```

        1. Create the IAM role and attach the policy:

            ```bash
            aws iam create-role \
              --role-name WallarmNodeRole \
              --assume-role-policy-document file://trust-policy.json

            aws iam put-role-policy \
              --role-name WallarmNodeRole \
              --policy-name WallarmSecretsReadOnly \
              --policy-document '{
                "Version": "2012-10-17",
                "Statement": [
                  {
                    "Effect": "Allow",
                    "Action": ["secretsmanager:GetSecretValue"],
                    "Resource": "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:wallarm/api-token*"
                  }
                ]
              }'
            ```

            Replace `<REGION>` and `<ACCOUNT_ID>` with your values.

        1. Create an instance profile and attach the role to your EC2 instance:

            ```bash
            aws iam create-instance-profile \
              --instance-profile-name WallarmNodeProfile

            aws iam add-role-to-instance-profile \
              --instance-profile-name WallarmNodeProfile \
              --role-name WallarmNodeRole

            aws ec2 associate-iam-instance-profile \
              --instance-id <INSTANCE_ID> \
              --iam-instance-profile Name=WallarmNodeProfile
            ```

### 4. Connect to the Wallarm Node instance via SSH

[Use the selected SSH key](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html) to connect to your running EC2 instance:

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

You need to use the `admin` username to connect to the instance.
