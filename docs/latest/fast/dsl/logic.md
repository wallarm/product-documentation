[img-phases-mod-overview]:              ../../images/fast/dsl/common/mod-phases.png
[img-phases-non-mod-overview]:          ../../images/fast/dsl/common/non-mod-phases.png
[img-mod-workflow]:                     ../../images/fast/dsl/common/mod-workflow.png
[img-non-mod-workflow]:                 ../../images/fast/dsl/common/non-mod-workflow.png
[img-workers]:                          ../../images/fast/dsl/en/workers.png

[img-incomplete-policy]:                ../../images/fast/dsl/common/incomplete-policy.png
[img-incomplete-policy-remediation-1]:  ../../images/fast/dsl/common/incomplete-policy-remediation-1.png
[img-incomplete-policy-remediation-2]:  ../../images/fast/dsl/common/incomplete-policy-remediation-2.png
[img-wrong-baseline]:                   ../../images/fast/dsl/common/wrong-baseline.png   

[link-policy]:              ../terms-glossary.md#test-policy
[doc-policy-in-detail]:     ../operations/test-policy/overview.md

[link-phase-collect]:       phase-collect.md
[link-phase-match]:         phase-match.md
[link-phase-modify]:        phase-modify.md
[link-phase-generate]:      phase-generate.md
[link-phase-send]:          phase-send.md
[link-phase-detect]:        detect/phase-detect.md

[doc-collect-uniq]:         phase-collect.md#the-uniqueness-condition
[doc-point-uri]:            points/parsers/http.md#uri-filter

[link-points]:              points/intro.md


# The Logic of Extensions

The logic of the extension can be described using several phases:
1.  [Collect][link-phase-collect]
2.  [Match][link-phase-match]
3.  [Modify][link-phase-modify]
4.  [Generate][link-phase-generate]
5.  [Send][link-phase-send]
6.  [Detect][link-phase-detect]

By combining these phases, FAST DSL allows you to describe two extension types:
* The first one creates one or more test requests by changing the parameters of an incoming baseline request.

    This extension will be referred to as a “modifying extension” throughout this guide.

* The second one uses predefined test requests and does not change the parameters of an incoming baseline request.

    This extension will be referred to as a “non-modifying extension” throughout this guide.

Each extension type employs a distinct set of phases. Some of these phases are mandatory, while others are not. 

The use of the Detect phase is obligatory for each extension type. This phase receives the responses of the target application to the test requests. The extension uses these responses to determine whether the application has certain vulnerabilities. The information from the Detect phase is sent to the Wallarm cloud.

!!! info "Request elements description syntax"
    When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points.
    
    To see detailed information, proceed to this [link][link-points].
 
##  How a Modifying Extension Works

During a modifying extension operation, a baseline request sequentially proceeds through the Collect, Match, Modify, and Generate phases, all of which are optional and may not be included in the extension. A single test request or multiple test requests will be formed as a result of proceeding through these phases. These requests will be sent to the target application to check it for vulnerabilities.

!!! info "An extension without optional phases"
    If no optional phases are applied to the baseline request, the test request matches the baseline request. 

![Modifying extension phases overview][img-phases-mod-overview]

If a baseline request satisfies a defined FAST [test policy][doc-policy-in-detail] then the request contains one or more parameters that are allowed for processing. The modifying extension iterates through these parameters:

 1. Each parameter passes through the extension phases and the corresponding test requests are created and executed.
 2. The extension proceeds with the next parameter until all parameters that comply with the policy are processed.  

The image below shows a POST request with some POST parameters as an example.

![Modifying extension workflow overview][img-mod-workflow]

##  How a Nonmodifying Extension Works

During a nonmodifying extension operation, the baseline request proceeds through a single Send phase.

While in this phase, only the host name of the IP address is derived from the `Host` header value of the baseline request. Then, the predefined test requests are sent to this host. 

Due to the possibility of the FAST node encountering several incoming baseline requests with the same `Host` header value, these requests proceed through the implicit Collect phase to gather only those requests with a unique `Host` header value (see [“The Uniqueness Condition”][doc-collect-uniq]).

![Non-modifying extension phases overview][img-phases-non-mod-overview]

When a nonmodifying extension works, one or more predefined test requests are sent to the host that is mentioned in the `Host` header of every baseline request that is processed in the Send phase:

![Non-modifying extension workflow overview][img-non-mod-workflow]


##  How Extensions Process Requests

### Processing a Request with Several Extensions

Several extensions may be defined for use by a FAST node at the same time.
Each incoming baseline request will proceed through all plugged in extensions.

![Extensions used by workers][img-workers]

At each moment of time, the extension processes a single baseline request. FAST supports parallel baseline request processing; each of the baseline requests received will be sent to a free worker to accelerate processing. Different workers may run the same extensions at the same time for different baseline requests. The extension defines whether test requests should be created on the basis of the baseline request.

The number of requests that the FAST node can process in parallel depends on the number of workers. The number of workers is defined by the value assigned to the environment variable `WORKERS` upon FAST node Docker container execution (the default variable value is 10).

!!! info "Test policy details"
    More detailed description of working with test policies is available by the [link][doc-policy-in-detail].
