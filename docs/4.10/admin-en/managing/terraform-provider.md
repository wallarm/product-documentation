# Managing Wallarm using Terraform

If you use [Terraform](https://www.terraform.io/) to manage your infrastructures, that may be a comfortable option for you to use it for managing Wallarm. The [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) for Terraform allows doing so.

## Requirements

* Knowing the [Terraform](https://www.terraform.io/) basics
* Terraform 0.15.5 binary or higher
* Wallarm account in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to the account with the **Administrator** [role](../../user-guides/settings/users.md#user-roles) in Wallarm Console in the US or EU [Cloud](../../about-wallarm/overview.md#cloud)
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall

## Installing provider

1. Copy and paste into your Terraform configuration:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.5.0"
        }
      }
    }

    provider "wallarm" {
      # Configuration options
    }
    ```

1. Run `terraform init`.

## Connecting provider to your Wallarm account

To connect Wallarm Terraform provider to your Wallarm account in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Cloud, set API access credentials in your Terraform configuration:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Required only when multitenancy feature is used:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Required only when multitenancy feature is used:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>` allows to access API of your Wallarm account. [How to get it →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>` is ID of tenant (client); required only when [multitenancy](../../installation/multi-tenant/overview.md) feature is used. Take `id` (not `uuid`) as described [here](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api).

See [details](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) in the Wallarm provider documentation.

## Managing Wallarm with provider

With the Wallarm provider, via Terraform you can manage:

* [Nodes](../../user-guides/nodes/nodes.md) in your account
* [Applications](../../user-guides/settings/applications.md)
* [Rules](../../user-guides/rules/rules.md)
* [Triggers](../../user-guides/triggers/triggers.md)
* IPs in the [denylist](../../user-guides/ip-lists/overview.md), [allowlist](../../user-guides/ip-lists/overview.md) and [graylist](../../user-guides/ip-lists/overview.md)
* [Users](../../user-guides/settings/users.md)
* [Integrations](../../user-guides/settings/integrations/integrations-intro.md)
* Global [filtration mode](../../admin-en/configure-wallarm-mode.md)
* [Scanner](../../user-guides/scanner.md) scope
* [Vulnerabilities](../../user-guides/vulnerabilities.md)

!!! info "Wallarm Terraform provider and CDN nodes"
    Currently [CDN nodes](../../user-guides/nodes/cdn-node.md) cannot be managed via the Wallarm Terraform provider.

See how to perform the listed operations in the Wallarm provider [documentation](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs).

## Usage example

Below is an example of Terraform configuration for Wallarm:

```
provider "wallarm" {
  api_token = "<WALLARM_API_TOKEN>"
  api_host = "https://us1.api.wallarm.com"
}

resource "wallarm_global_mode" "global_block" {
  waf_mode = "default"
}

resource "wallarm_application" "tf_app" {
  name = "Terraform Application 001"
  app_id = 42
}

resource "wallarm_rule_mode" "tiredful_api_mode" {
  mode =  "monitoring"

  action {
    point = {
      instance = 42
    }
  }

  action {
    type = "regex"
    point = {
      scheme = "https"
    }
  }
}
```

Save the configuration file, then perform `terraform apply`.

The configuration does the following:

* Connects to the US Cloud → company account with the provided Wallarm API token.
* `resource "wallarm_global_mode" "global_block"` → sets global filtration mode to `Local settings (default)` which means the filtration mode is controlled locally on each node.
* `resource "wallarm_application" "tf_app"` → creates application named `Terraform Application 001` with ID `42`.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → creates rule that sets traffic filtration mode to `Monitoring` for all the requests sent via HTTPS protocol to the application with ID `42`.

## Further information about Wallarm and Terraform

Terraform supports a number of integrations (**[providers](https://www.terraform.io/language/providers)**) and ready-to-use configurations (**[modules](https://www.terraform.io/language/modules)**) available to users via the public [registry](https://www.terraform.io/registry#navigating-the-registry), populated by a number of vendors.

To this registry, Wallarm published:

* The [Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) for managing Wallarm via Terraform. Described in the current article.
* The [Wallarm module](../../installation/cloud-platforms/aws/terraform-module/overview.md) to deploy the node to AWS from the Terraform-compatible environment.

These two are independent tools used for different purposes. One is not required to use another.
