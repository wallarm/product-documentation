[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FAST Test Policies: Overview

FAST uses test policies that allow you to set up FAST node behavior when testing an application for [vulnerabilities][gl-vuln]. Documents in this section contain instructions for test policy management.

!!! info "Terminology"
    The "FAST test policy" term can be abbreviated as "policy" in this documentation section.

## Test Policy Principles

FAST represents request elements as [points][gl-point] and works only with those requests that contain one or more points allowed for processing. The list of such points is defined via the policy. If the request does not contain allowed points, it will be discarded and no test requests will be created on its basis.

The policy regulates the following points:

* The way tests are performed
    
    During testing, FAST follows one or more methods listed below:
    
    * vulnerabilities detection using built-in FAST extensions, also known as *detects*
    * vulnerabilities detection using custom extensions
    * [anomaly][gl-anomaly] detection using FAST fuzz testing

* Elements of the baseline request that FAST node processes during application testing

    Points allowed for processing are configured in the **Insertion points** > **Where in the request to include** section of policy editor on your Wallarm account. See details about insertion points by this [link][doc-insertion-points].

* Elements of the baseline request that FAST node does not process during application testing

    Points that are not allowed for processing are configured in the **Insertion points** > **Where in the request to exclude** section of the test policy settings on your Wallarm account. You can find more details about insertion points within this [link][doc-insertion-points].

    Points not allowed for processing can be used when there is a wide variety of points in the **Where in the request to include** section and it is required to exclude processing of separate elements. For example, if all GET parameters are allowed for processing (`GET_.*`) and it is required to exclude processing of the `uuid` parameter, the `GET_uid_value` expression should be added in the **Where in the request to exclude** section.

!!! warning "Policy scope"
    When explicitly excluding points, FAST node processes are the only points allowed by the policy.
    
    Processing of any other points in the request is not performed.

??? info "Policy example"
    ![Policy example](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    The image above demonstrates the policy used by the FAST node in vulnerability detection. This policy allows processing of all GET parameters in the baseline request excluding the `token` GET parameter, which always is passed to the target application untouched.

    Furthermore, the policy allows you to use the built-in FAST extensions and custom extensions while the fuzzer is inactive.

    Thus, testing for vulnerabilities using detects and extensions will be performed only for the baseline request **A** (`/app.php?uid=1234`)
    .

    Testing for vulnerabilities on the baseline request **B** (`/app.php?token=qwe1234`) will not be performed since it does not contain GET parameters allowed for processing. It instead contains the excluded parameter `token`.
