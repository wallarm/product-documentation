# Test Policy Examples

A few examples of FAST test policies are presented in this document, including the following that are used in the FAST documentation. These examples demonstrate all aspects of working with the policies.

!!! info "Request element description syntax"
    A FAST test policy allows or denies a FAST node permission to work with particular elements of a baseline request.

    These elements are described using the [points](../../dsl/points/intro.md).

    In the sample test policies below, every baseline request’s element is followed by the corresponding point, like this: any GET parameter (`GET_.*`).

!!! info "Detection of vulnerabilities"
    [The list of vulnerabilities that FAST can detect](../../vuln-list.md)

    Please note that the choice of vulnerability types during configuration of a test policy influences which ones of the embedded FAST extensions (aka detects) will be executed.

    Custom FAST extensions will try to detect the vulnerability type they are designed for, even if this vulnerability type was not selected when configuring a policy.

    For example, a policy can allow for testing a target application for RCE, but a custom extension will test the application for SQLi vulnerabilities.

## Default Test Policy

This is an unchangeable test policy that allows for working with common request elements and testing for typical vulnerabilities.

**This policy allows working with the following elements:**

* any GET and POST parameters (`GET_.*` and `POST_.*`)
* URI (`URI`)
* any paths in URI (`PATH_.*`)
* URL action name and extension (`ACTION_NAME` and `ACTION_EXT`)

**The target application will be tested by the embedded FAST extensions for** PTRAV, RCE, SQLI, XSS, and XXE vulnerabilities.

**This policy has the following specifics:** it does not support fuzzing. To enable the fuzzer, create a separate test policy ([example](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)).

![Policy example](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "Note"
    Please take the following into account:

    * When you create a new test policy, its settings will be identical to those used in the default policy. You can modify the settings of the new policy as needed.
    * This policy can be used in the [example](../../poc/examples/circleci.md) of FAST integration into CI/CD.

## Policy that Allows Working with All GET and POST Parameters

This test policy allows working with all GET (`GET_.*`) and POST parameters (`POST_.*`) in a request.

**The target application will be tested by the embedded FAST extensions for** XSS vulnerability.

**This policy has the following specifics:** fuzzer is disabled.

![Policy example](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "Note"
    In the Quick Start guide, this policy can be used to conduct security testing of the [Google Gruyere](../../qsg/test-run.md) target application.

## Policy that Allows Working with URI and Encoded email POST Parameter (Only Custom FAST Extensions Are Allowed to Run)

This test policy allows working with URI (`URI`) and `email` POST parameters in a request. The `email` parameter is encoded in JSON (`POST_JSON_DOC_HASH_email_value`).

**This policy has the following specifics:**

* Only custom FAST extensions are allowed to run, no embedded FAST detects will be executed.
* Fuzzer is disabled.

![Policy example](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "Note"
    This policy can be used to run the [sample custom extensions](../../dsl/using-extension.md).

## Policy that Allows Working with URI and Encoded email POST Parameters (Fuzzer is Enabled)

This policy allows working with `email` POST parameter in a request. The `email` parameter is encoded in JSON (`POST_JSON_DOC_HASH_email_value`).

**This policy has the following specifics:**

* Fuzzer is enabled.
* All embedded FAST extensions are disabled (no vulnerabilities are selected). This is possible to do when using the fuzzer.

**In this sample policy, the fuzzer is configured as follows:**

* Payloads up to 123 bytes are to be inserted at the beginning of the decoded value of a point (in this particular case, there is the single point `POST_JSON_DOC_HASH_email_value`).
* It is assumed that

    * An anomaly is found if the `SQLITE_ERROR` string is presented in the server response body.
    * No anomaly is found if the server response code value is less than `500`.
    * Fuzzer stops its execution if either all payloads have been checked or if more than two anomalies are found.

![Policy example](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "Note"
    This policy can be used to find vulnerabilities in the [OWASP Juice Shop login form](../../dsl/extensions-examples/overview.md).

## Policy that Denies Working with the Value of a Particular Point

This test policy allows working with all GET parameters (`GET_.*`) in a request except for the `sessionid` GET parameter (`GET_sessionid_value`).

It can be useful to configure a behavior like this one if it is necessary to deny FAST from working with a particular point (for example, if unintentional modification of the specific parameter value may disrupt the operation of the target application).

**The target application will be tested by the embedded FAST extensions for** AUTH and IDOR vulnerabilities. 

**This policy has the following specifics:** fuzzer is disabled.

![Example policy](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)
