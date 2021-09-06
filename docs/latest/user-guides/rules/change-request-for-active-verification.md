# Customizing the module for active threat verification

Custom ruleset allows changing the following configurations of the [Active threat verification](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) module:

* Disable the module for the whole application or its part (only if the module is enabled for all applications in Wallarm Console → **Scanner**).
* Rewrite the request before attack replaying.

## Disabling / Enabling the Active threat verification module

### Rule overview

The rule **Disable/Enable active threat verification** is used to change the [Active threat verification](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) module mode for the specific applications, domains or URLs if this module is enabled globally in Wallarm Console  → **Scanner**.

### Creating and applying the rule

To create and apply the rule:

1. Create the rule **Disable/Enable active threat verification** in the **Profile & Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * **Disable / Enable** sets the mode of the **Active threat verification** module for attacks sent to the specified endpoints.

        Please use the mode **Enable** only to configure exceptions for the rule disabling the module (e.g. to enable the module for `https://example.com/module/user/create` if it is already disabled for `https://example.com/module/user/*`).
2. Wait for the [custom ruleset compilation to complete](compiling.md).

### Rule example

The rule **Disable/Enable active threat verification** disabling the **Active threat verification** module for `https://example.com/module/user/*` looks as follows:

![!Example of the rule "Disable/Enable active threat verification"](../../images/user-guides/rules/disable-active-threat-verification-example.png)

If the rule above is already configured, the following rule will enable the **Active threat verification** module for `https://example.com/module/user/create`:

![!Example of the rule "Disable/Enable active threat verification"](../../images/user-guides/rules/disable-active-threat-verification-deeper-path-example.png)

## Rewriting the request before attack replaying

### Rule overview

The rule **Rewrite attack before active verification** is used to modify the original request elements before the [attack replaying](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification). The following elements can be modified:

* Header with the request authentication data to replace [original authentication data with test data](#replacing-original-authentication-data-with-test-data).
* Header `HOST` if your infrastructure has the load balancer forwarding the requests to different application instances depending on the `HOST` header value. For example, the header `HOST` could be modified to replay the attack on [staging or test environment](#modifying-the-application-address-for-attack-replaying).
* Path to [rewrite the application address used for the attack replaying](#modifying-the-application-address-for-attack-replaying).

!!! warning "Modification of any original request element"
    The rule **Rewrite attack before active verification** allows modifying of only headers (`header`) and paths (`uri`) of the original requests. Other request elements cannot be modified or added.

    Since the rule allows modifying of only those request elements that were originally passed, the application IP address cannot be modified.

#### Replacing original authentication data with test data

If authentication parameters were passed in the original request, the module **Attack rechecker** deletes these parameters and replays the attack without them. If authentication parameters are required to access protected application API, the code `401` or other code will be returned in the response to the replayed attack. Since returned code shows no vulnerability signs, the module **Attack rechecker** will not detect the vulnerability that could be actually detected with authentication parameters passed in the request.

To replay the original requests with required authentication parameters, you may add test values ​​for these parameters using the **Rewrite attack before active verification** rule. For example: API key, token, password or other parameters.

!!! info "Reusing test authentication data"
    It is recommended to generate test authentication credentials that will only be used by the Wallarm module **Attack rechecker**.

#### Modifying the application address for attack replaying

By default, replayed attacks are sent to the application address and path passed in the original request. You may replace the original address and path with other values that will be used when replaying the attack. Values are replaced using the **Rewrite attack before active verification** rule in the following way:

* If your infrastructure has the load balancer forwarding the requests to different application instances depending on the `HOST` header value, you may replace the original value of the header `HOST` with a different application instance address. For example, a separate application instance could be a staging or test environment.

    !!! warning "Specifics of replacing the HOST value"
        After the `HOST` header value is replaced with a new value, requests will still be sent to the original application IP address. The request will be forwarded to the address specified in the `HOST` header if the appropriate configuration is implemented on the load balancer for the original IP address.

* Replace the path of the original request with the path to the test environment or staging, or to the path to the target server to bypass the proxy server when replaying the attack.

To replace both the value of the `HOST` header and the path of the original request, you'll need to create two separate rules with the action type **Rewrite attack before active verification**.

### Creating and applying the rule

To create and apply the rule:

1. Create the rule **Rewrite attack before active verification** in the **Profile & Rules** section of the Wallarm Console. The rule consists of the following components:

      * **Condition** describes the request that should be modified before attack replaying.
      * **Rules** sets the new value for the parameter selected in the **Part of request** field. A set value will be used when replaying the attack.

        The value must be decoded and set using the [template language Liquid](https://shopify.github.io/liquid/) as follows: placed in double curly braces `{{}}` and single quotes `''`. For example: `{{'example.com'}}`.

        To replace the path of the original request (`uri`), you should pass the full value of the new path.

      * **Part of request** points to the original request element that should be modified before replaying the attack.

        !!! warning "Possible values of the field **Part of request**"
            Possible values of the **Part of request** field are `header` (request header) and `uri` (request path).

2. Wait for the [rule compilation to complete](compiling.md).

To set several conditions for the original request modification or to replace the values of several request elements, you may create several rules.

### Rule examples

* When replaying the attacks sent to `example.com`, pass the value `PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low` in the `COOKIE` header.

    The format of the header value is `{{'PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low'}}`.

    ![!Example of the rule modifying COOKIE](../../images/user-guides/rules/rewrite-request-example-cookie.png)

* Replay attacks originally sent to `example.com` on the test environment `example-test.env.srv.loc`. The load balancer on `example.com` must be configured to forward requests to the address passed in `HOST`.

    The format of the address is `{{'example-test.env.srv.loc'}}`.

     ![!Example of the rule modyfying HOST](../../images/user-guides/rules/rewrite-request-example-host.png)
