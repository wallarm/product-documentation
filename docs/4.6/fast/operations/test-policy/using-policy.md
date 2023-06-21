[img-set-policy-in-gui]:    ../../../images/fast/operations/common/test-policy/overview/tr-gui-set-policy.png
[img-get-policy-id]:        ../../../images/fast/operations/common/test-policy/overview/get-policy-id.png

[doc-pol-tr-relations]:     ../internals.md#fast-test-policy
[doc-tr-creation-gui]:      ../create-testrun.md#creating-a-test-run-via-web-interface
[doc-tr-creation-api]:      ../create-testrun.md#creating-a-test-run-via-api
[doc-tr-copying-gui]:       ../copy-testrun.md#copying-a-test-run-via-web-interface
[doc-tr-copying-api]:       ../copy-testrun.md#copying-a-test-run-via-an-api

[doc-ci-mode]:              ../../poc/integration-overview-ci-mode.md
[doc-tr-pid-envvar]:        ../../poc/ci-mode-testing.md#environment-variables-in-testing-mode

[link-pol-list-eu]:         https://my.wallarm.com/testing/policies/     
[link-pol-list-us]:         https://us1.my.wallarm.com/testing/policies/


# Using Test Policies

Test policies are [related][doc-pol-tr-relations] with security tests. When creating a test iteration, each test policy will define and specify the FAST node behavior. 

You can specify the test policy in the following ways:

* Using the interface, if the test is [created][doc-tr-creation-gui] or [copied][doc-tr-copying-gui], then select the policy from the **Test policy** drop-down list:

    ![!Selecting the test policy during test run creation via the interface][img-set-policy-in-gui]

* Specify the test policy ID:
    * in the API request if the test is [created][doc-tr-creation-api] or [copied][doc-tr-copying-api] via API methods
    * in the [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] environment variable if you manage testing in [FAST node][doc-ci-mode]
        
    <br>
    You can find test policy ID in the list of policies on your Wallarm account for the [EU cloud][link-pol-list-eu] or the [US cloud][link-pol-list-us].

    ![!Getting policy ID][img-get-policy-id]

!!! info "Default test policy"
    FAST automatically creates and applies **Default Policy**. This policy tests an application for typical vulnerabilities by checking the most commonly used request points.

    Please note that the settings of the default test policy cannot be changed.