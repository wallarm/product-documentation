# Rewriting the request before attack replaying

## Rule overview

The rule **Rewrite request before attack replaying** is used to modify the original request elements before the [attack replaying](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification). The following elements can be modified:

* Header with the request authentication data to replace [original authentication data with test data](#replacing-original-authentication-data-with-test-data).
* Header `HOST` if your infrastructure has the load balancer forwarding the requests to different application instances depending on the `HOST` header value. For example, the header `HOST` could be modified to replay the attack on [staging or test environment](#modifying-the-application-address-for-attack-replaying).
* Path to [rewrite the application address used for the attack replaying](#modifying-the-application-address-for-attack-replaying).

!!! warning "Modification of any original request element"
    The rule **Rewrite request before attack replaying** allows modifying of only headers (`header`) and paths (`uri`) of the original requests. Other request elements cannot be modified or added.

    Since the rule allows modifying of only those request elements that were originally passed, the application IP address cannot be modified.

### Replacing original authentication data with test data

If authentication parameters were passed in the original request, the module **Attack rechecker** deletes these parameters and replays the attack without them. If authentication parameters are required to access protected application API, the code `401` or other code will be returned in the response to the replayed attack. Since returned code shows no vulnerability signs, the module **Attack rechecker** will not detect the vulnerability that could be actually detected with authentication parameters passed in the request.

To replay the original requests with required authentication parameters, you may add test values ​​for these parameters using the **Rewrite request before attack replaying** rule. For example: API key, token, password or other parameters.

!!! info "Reusing test authentication data"
    It is recommended to generate test authentication credentials that will only be used by the Wallarm module **Attack rechecker**.

### Modifying the application address for attack replaying

By default, replayed attacks are sent to the application address and path passed in the original request. You may replace the original address and path with other values that will be used when replaying the attack. Values are replaced using the **Rewrite request before attack replaying** rule in the following way:

* If your infrastructure has the load balancer forwarding the requests to different application instances depending on the `HOST` header value, you may replace the original value of the header `HOST` with a different application instance address. For example, a separate application instance could be a staging or test environment.

    !!! warning "Specifics of replacing the HOST value"
        After the `HOST` header value is replaced with a new value, requests will still be sent to the original application IP address. The request will be forwarded to the address specified in the `HOST` header if the appropriate configuration is implemented on the load balancer for the original IP address.

* Replace the path of the original request with the path to the test environment or staging, or to the path to the target server to bypass the proxy server when replaying the attack.

To replace both the value of the `HOST` header and the path of the original request, you'll need to create two separate rules with the action type **Rewrite request before attack replaying**.

## Creating and applying the rule

To create and apply the rule:

1. Create the rule **Rewrite request before attack replaying** in the **Profile & Rules** section of the Wallarm Console. The rule consists of the following components:

      * **Condition** describes the request that should be modified before attack replaying.
      * **Rules** sets the new value for the parameter selected in the **Part of request** field. A set value will be used when replaying the attack.

        The value must be decoded and set using the [template language Liquid](https://shopify.github.io/liquid/) as follows: placed in double curly braces `{{}}` and single quotes `''`. For example: `{{'example.com'}}`.

        To replace the path of the original request (`uri`), you should pass the full value of the new path.

      * **Part of request** points to the original request element that should be modified before replaying the attack.

        !!! warning "Possible values of the field **Part of request**"
            Possible values of the **Part of request** field are `header` (request header) and `uri` (request path).

2. Wait for the [rule compilation to complete](compiling.md).

To set several conditions for the original request modification or to replace the values of several request elements, you may create several rules.

## Rule examples

* When replaying the attacks sent to `example.com`, pass the value `PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low` in the `COOKIE` header.

    The format of the header value is `{{'PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low'}}`.

    ![!Example of the rule modifying COOKIE](../../images/user-guides/rules/rewrite-request-example-cookie.png)

* Replay attacks originally sent to `example.com` on the test environment `example-test.env.srv.loc`. The load balancer on `example.com` must be configured to forward requests to the address passed in `HOST`.

    The format of the address is `{{'example-test.env.srv.loc'}}`.

     ![!Example of the rule modyfying HOST](../../images/user-guides/rules/rewrite-request-example-host.png)
