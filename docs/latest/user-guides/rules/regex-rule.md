[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# User-Defined Detectors

Wallarm provides the **Create regexp-based attack indicator** [rule](../../user-guides/rules/rules.md) to define your own attack signs that are described with the regular expressions.

## Creating and applying rule

To set and apply your own attack detector:

--8<-- "../include/rule-creation-initial-step.md"
1. In **If request is**, [describe](rules.md#configuring) the scope to apply the rule to.
1. In **Then**, choose **Create regexp-based attack indicator** and set your attack indicator parameters:

    * **Regular expression** - regular expression (signature). If the value of the following parameter matches the expression, that request is detected as an attack. Syntax and specifics of regular expressions are described in the [instructions on adding rules](rules.md#condition-type-regex).

        !!! warning "Changing the regular expression specified in the rule"
            Changing the regular expression specified in the existing rule of the type **Create regexp-based attack indicator** results in automatic deletion of the rules [**Disable regexp-based attack detection**](#partial-disabling) that use the previous expression.

            To disable attack detection by a new regular expression, please create a new **Disable regexp-based attack detection** rule with the new regular expression specified.

    * **Experimental** - this flag allows you to safely check the triggering of a regular expression without blocking requests. The requests will not be blocked even when the filter node is set to the blocking mode. These requests will be considered as attacks detected by the experimental method and will be hidden from the event list by default. They can be accessed using search query `experimental attacks`.

    * **Attack** - the type of attack that will be detected when the parameter value in the request matches the regular expression.

1. In **In this part of request**, specify [request parts](request-processing.md) in which you want to search for attack signs.
1. Wait for the [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle).

## Rule examples

### Blocking all requests with incorrect `X-AUTHENTICATION` header

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### Block all requests with `class.module.classLoader.*` body parameters

One of the ways to exploit the 0-day vulnerability in [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) is to send the POST request with certain malicious payloads injected into the following body parameters:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

If you use vulnerable Spring Core Framework and the Wallarm node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) is different from blocking, you can prevent vulnerability exploitation using the virtual patch. The following rule will block all requests with listed body parameters even in the monitoring and safe blocking modes:

![Virtual patch for specific post params](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

The regular expression field value is:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

The Wallarm node operating in the blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) blocks such vulnerability exploitation attempts by default.

The Spring Cloud Function component also has the active vulnerability (CVE-2022-22963). If using this component and the Wallarm node mode is different from blocking, create the virtual patch as described [below](#example-block-all-requests-with-the-class-cloud-function-routing-expression-header).

### Block all requests with `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` header

The Spring Cloud Function component has the active vulnerability (CVE-2022-22963) that can be exploited by injecting malicious payloads into the `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` or `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` header.

If using this component and the Wallarm node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) is different from blocking, you can prevent vulnerability exploitation using the virtual patch. The following rule will block all requests containing the `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` header:

![Virtual patch for specific header](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "Blocking requests with the `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` header"
    This rule does not block requests with the `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` header but NGINX drops requests with this header as invalid ones by default.

The Wallarm node operating in the blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) blocks such vulnerability exploitation attempts by default.

There is also the 0-day vulnerability in [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell). Learn how to block its exploitation attempts with the [reqexp-based virtual patch](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters).

## Partial disabling

If the created rule should be partially disabled for a particular branch, this can easily be done by creating the **Disable regexp-based attack detection** rule with the following fields:

- *Regular expression*: previously created regular expressions that must be ignored.

    !!! warning "Behavior of the rule if the regular expression was changed"
        Changing the regular expression specified in the existing rule of the type [**Create regexp-based attack indicator**](#creating-and-applying-rule) results in automatic deletion of the rules **Disable regexp-based attack detection** that use the previous expression.

        To disable attack detection by a new regular expression, please create a new rule **Disable regexp-based attack detection** with the new regular expression specified.

- *in this part of request*: indicates the parameter that requires setting up an exception.

**Example: Permit an Incorrect X-Authentication Header for a Designated URL**

Let's say you have a script at `example.com/test.php`, and you want to change the format of the tokens for it.

To create the relevant rule:

1. Go to the *Rules* tab
1. Find or create the branch for `example.com/test.php` and click *Add rule*
1. Choose *Disable regexp-based attack detection*
1. Select the regular expression that you want to disable
1. Set the point `Header X-AUTHENTICATION`
1. Click *Create*

![Regex rule second example][img-regex-example2]

## API call to create the rule

To create the regexp-based attack indicator, you can [call the Wallarm API directly](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks).
