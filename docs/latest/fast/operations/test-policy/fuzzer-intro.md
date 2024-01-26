[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# Configuration of Anomaly Detection Process: Overview

In addition to [vulnerabilities][gl-vuln] detection, FAST can detect [anomalies][gl-anomaly] using the *fuzzer*.

This documentation section describes the following points:

* [Principles of Fuzzer Operation][doc-fuzzer-internals]
* [Fuzzer Configuration Using the Policy Editor][doc-fuzzer-configuration]

??? info "Anomaly example"
    The anomalous behavior of the target application [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) is demonstrated in the [example of the FAST extension](../../dsl/extensions-examples/mod-extension.md).

    This target application usually responds with the `403 Unauthorized` code and the `Invalid email or password.` message to the authorization request with an incorrect combination of login and password.

    However, if the `'` symbol is passed within any part of the login value, the application responds with the `500 Internal Server Error` code and the `...SequelizeDatabaseError: SQLITE_ERROR:...` message; such behavior is anomalous.

    This anomaly does not lead to the direct exploitation of any vulnerability, but it provides an attacker with information about the application architecture and prompts to execute the [SQL Injection](../../vuln-list.md#sql-injection) attack.
