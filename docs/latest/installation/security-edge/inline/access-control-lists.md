# Access Control Lists (ACL) in Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

An access control list (ACL) is a set of rules that defines which IP addresses can access specific hosts and locations of your APIs protected by [Security Edge Inline](/overview.md).

The Wallarm Node checks each incoming request against the ACL rules. If a request matches a deny rule, it gets blocked. This prevents unauthorized activity and potential attacks.

## Requirements

Access Control Lists (ACL) are supported starting from Edge Node version 6.6.0.

## Creating an ACL

ACLs provide targeted control by applying rules to specific hosts and locations of your API. You first create an ACL with the required rules and then assign it to the hosts or locations you want to protect.

You can create an ACL either during or after Edge Node deployment.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Access control lists** and click **Create ACL**.
1. Give your ACL a recognizable name.
1. Define which IPs will be allowed and/or denied access to your hosts and locations. To do so, click **Add rule** and select the configuration type:
    
    * If you choose "Allow" or "Deny", specify an IPv4 address in one of the following formats:
    
        * A single IP address (e.g., `192.0.2.1`)
        * A block of IPs using CIDR notation (e.g., `192.0.2.0/20`)  
        
    * If you choose "Allow all" or "Deny all", no IP address is required. The rule applies to all IP addresses.

        !!! info "Configuration notice"
            The "Deny all" configuration blocks all traffic. To avoid blocking legitimate requests, add allow rules or change the configuration type.

1. To add multiple rules, repeat the step above. To reorder rules, use drag and drop. Rules are checked from top to bottom - access is based on the first match.
1. Once you have created the desired configuration, click **Save**.

The created ACL appears in the list. You can see how many rules it contains and how many locations it secures. 

The newly created ACL is used in 0 hosts and locations. To secure hosts or locations with this ACL, you need to assign it to them.

![Zero locations](../../../images/configuration-guides/acl-zero-locations.png)

## Assigning an ACL to protect hosts and locations

You can assign an ACL either during or after Edge Node deployment.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Hosts**.
2. Under "Access control list (ACL)", select the desired ACL.

## How ACLs interact with IP lists

When both ACLs and IP lists are configured, each request goes through two layers of filtering:

1. ACL — first layer
2. IP list (allowlist/denylist/graylist) — second layer

An IP must pass both filters to access your API locations. If an IP is denied by the ACL, it will be blocked — even if it's on the allowlist. If an IP is allowed by the ACL, it can still be blocked by the denylist.

Example scenarios:

* Allowed by ACL + Allowed by IP list → Access granted
* Blocked by ACL + Allowed by IP list → Access denied
* Allowed by ACL + Blocked by IP list → Access denied
* Blocked by ACL + Blocked by IP list → Access denied
