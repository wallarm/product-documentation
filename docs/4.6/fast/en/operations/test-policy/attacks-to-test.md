[img-custom-dsl-slider]:    ../../../images/operations/en/test-policy/policy-editor/custom-slider.png

[link-user-extensions]:     ../../dsl/intro.md
[link-connect-extensions]:  ../../dsl/using-extension.md

[doc-fuzzer]:               fuzzer-intro.md

[gl-vuln]:                  ../../TERMS-GLOSSARY.md#vulnerability

[vuln-ptrav]:               ../../VULN-LIST.md#path-traversal
[vuln-rce]:                 ../../VULN-LIST.md#remote-code-execution-rce
[vuln-sqli]:                ../../VULN-LIST.md#sql-injection
[vuln-xss]:                 ../../VULN-LIST.md#cross-site-scripting-xss
[vuln-xxe]:                 ../../VULN-LIST.md#attack-on-xml-external-entity-xxe


#   Configuration of Vulnerability Detection Process

FAST detects [vulnerabilities][gl-vuln] using the following options:

* built-in FAST extensions,
* [custom extensions][link-user-extensions].

    !!! info "Custom extensions"
        To use custom extensions, please [connect][link-connect-extensions] them to the FAST node.

You can control the way of detecting vulnerabilities in the application in the following ways:

* If you want to perform tests using the built-in FAST extension, then tick the vulnerability checkboxes you want to run tests on.
* If you want to perform tests using only custom extensions excluding the built-in FAST extensions, then untick all the checkboxes or activate the **Use only custom DSL** switch and select vulnerabilities from the list.

    ![The custom DSL switch][img-custom-dsl-slider]

    Please note that if the **Use only custom DSL** switch is activated, then the built-in FAST extensions and [FAST fuzzer][doc-fuzzer] will be disabled. If the FAST fuzzer is enabled, then the **Use only custom DSL** switch will become inactive again.

!!! info "Basic vulnerabilities"
    When creating a policy, the most typical vulnerabilities that can be detected in applications are selected by default:

        * [path traversal (PTRAV)][vuln-ptrav],
        * [remote code execution (RCE)][vuln-rce],
        * [SQL injection (SQLi)][vuln-sqli],
        * [cross-site scripting (XSS)][vuln-xss],
        * [vulnerability to attack on XML external entity (XXE)][vuln-xxe].
    
    If you use custom policies, you can disable testing the application for a specific vulnerability by unticking the corresponding checkbox at any moment.
