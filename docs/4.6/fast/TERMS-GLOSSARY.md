[doc-points]:       dsl/points/intro.md
[doc-internals]:    operations/internals.md
[doc-policies]:     operations/test-policy/overview.md
[doc-vuln-list]:    VULN-LIST.md

[vuln-anomaly]:     VULN-LIST.md#anomaly

#   Glossary

## Vulnerability

A vulnerability is an error made due to negligence or inadequate information when building or implementing a web application that can lead to an information security risk.

The information security risks are:

* Unauthorized data access; for example, access to read and modify user data.
* Denial of service.
* Data corruption and other.

A vulnerability is not a characteristic of the Internet. A vulnerability is a characteristic of your system. Whether or not you have vulnerabilities does not depend on your Internet traffic. The Internet traffic, however, can be used to detect the vulnerabilities, which is what Wallarm does, among other functions.

## Anomaly

A [kind][vuln-anomaly] of vulnerability.

##  Target Application

A target application is a web application or an API that should be tested for vulnerabilities using FAST.

**See also:** [relations between FAST components][doc-internals].

##  Request Source 

A requests source is a tool that will test the target application using HTTP and HTTPS requests. FAST can create the security test set based on these requests (see “baseline requests”).

##  Security Test Set

A security test set allows revealing vulnerabilities in the target application.
Each security test comprises one or more test requests.

##  Test Requests

The test requests are HTTP and HTTPS requests to be sent to the target application. The constructed requests are highly likely to trigger a vulnerability.

Such requests are created by FAST on the basis of baseline requests that satisfy the test policy.

##  FAST Node

The FAST node is one of the FAST components.

The node proxies HTTP and HTTPS requests and creates security tests based on the baseline requests.

In addition to this, FAST node executes the security tests. In other words, node sends test requests to the target application to check the application's response and determine if there are any security vulnerabilities in the application.

##  Wallarm Cloud

The Wallarm Cloud is one of the FAST components.
The cloud provides the user with an interface for creating test policies, managing the test execution process and observing the testing results.

**See also:**
* [relations between FAST components][doc-internals],
* [working with test policies][doc-policies].


##  Baseline requests

The baseline requests are HTTP и HTTPS requests that are directed from the requests source to the target application.
FAST creates the security tests on the basis of this requests.

All the non-baseline requests, that are proxied through the FAST node, would not be used as a source during the test set creation process.

##  Test Run

A test run describes the single iteration of the vulnerability testing process using FAST.

Test run passes a test policy to a FAST node. The policy defines which baseline requests will serve as a basis for the security tests.

Each test run is tightly coupled with a single FAST node by the token.

##  Test Policy

A test policy is a set of rules, according to which the process of vulnerability detection is conducted. In particular, you can select the vulnerability types which the application should be tested for. In addition to that, the policy determines which parameters in the baseline request are eligible to be modified while creating a security test set. These pieces of data are utilized by the FAST node to create test requests that are used to find out if the target application is exploitable.

**See also:**
* [relations between FAST components][doc-internals],
* [working with test policies][doc-policies].

##  Baseline Request Element

A request element is a part of a baseline request.
Some examples of elements:

* HTTP header, 
* HTTP response body, 
* GET parameters, 
* POST parameters.

##  Point

A point is a string that points to the element of the baseline request. This string comprises a sequence of the names of parsers and filters that should be applied to the baseline request in order to obtain the required data.

The points are described in more detail [here][doc-points].

##  Token

A token is the unique secret identifier that serves the following purposes:
* Binding a test run with the FAST node.
* Creating and managing a test run.

Token is one of the essential FAST node's properties.

**See also:** [relations between FAST components][doc-internals].
