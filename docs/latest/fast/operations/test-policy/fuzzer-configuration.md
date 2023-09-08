[img-enable-fuzzer]:            ../../../images/fast/operations/common/test-policy/fuzzer/fuzzer-slider.png
[img-manipulate-items]:         ../../../images/fast/operations/common/test-policy/fuzzer/manipulate-fuzzer-items.png
[img-anomaly-condition]:        ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-condition.png
[img-not-anomaly-condition]:    ../../../images/fast/operations/common/test-policy/fuzzer/not-anomaly-condition.png
[img-stop-condition]:           ../../../images/fast/operations/common/test-policy/fuzzer/stop-condition.png

[link-ruby-regexp]:             http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html      

[anchor-payloads-section]:      #the-payloads-section
[anchor-anomaly-section]:       #the-consider-result-an-anomaly-if-response-section
[anchor-not-anomaly-section]:   #the-consider-result-not-an-anomaly-if-response-section
[anchor-stop-section]:          #the-stop-fuzzing-if-response-section

# Fuzzer Configuration

!!! info "Enabling fuzzer"
    The fuzzer is disabled by default. You can enable it in the **Fuzz testing** section of the policy editor on your Wallarm account:
    
    ![Enabling fuzzer][img-enable-fuzzer]

    The fuzzer switch and the **Use only custom DSL** switch in the **Attacks to test** section are mutually exclusive.

    The policy does not support a fuzzer by default.

The settings related to the fuzzer and anomaly detection are placed in the **Fuzz testing** section of the policy editor.

To test the application for anomalies, FAST analyzes the response of the target application to a request with a payload containing anomaly bytes. Depending on the specified conditions, the request sent by FAST will be recognized as anomalous or not.

The policy editor on your Wallarm account allows you to:

* add payloads by clicking the **Add payload** and **Add another payload** buttons
* add conditions affecting the fuzzer operation by clicking the **Add condition** and **Add another condition** buttons
* delete created payloads and conditions by clicking the «—» symbol near them

![Payload and condition management][img-manipulate-items]

When configuring conditions you can use the following parameters:

* **Status**: HTTPS response code
* **Length**: response length in bytes
* **Time**: response time in seconds
* **Length diff**: difference in the length of the response to the FAST and original baseline requests in bytes
* **Time diff**: difference between the response time to the FAST and original baseline requests in seconds
* **DOM diff**: difference in the number of DOM elements in the FAST and original baseline requests
* **Body**: [Ruby regular expression][link-ruby-regexp]. The condition is met if the response body satisfies this regular expression

In the [**Stop fuzzing if response**][anchor-stop-section] section, the following parameters can also be configured:

* **Anomalies**: the number of detected anomalies
* **Timeout errors**: the number of times when no response was received from the server

Using a combination of these parameters, you can configure required conditions that affects fuzzer operations (see below).

## The "Payloads" Section

The section is used to configure one or more payloads.

While the payload is inserted, the following data is specified:

* the load size from 1 to 255 bytes
* at which value the payload will be inserted: the beginning, random, or end position

While the payload is replacing, the following data is specified:

* the method of replacement: replace a random segment in the value — first `M` bytes, last `M` bytes, or entire string
* the load size `M` from 1 to 255 bytes


## The "Consider Result an Anomaly if Response" Section

If the response from the application meets all the conditions configured in the **Consider result an anomaly if response** section, then an anomaly is considered found.

**Example:**

If the response body meets the `.*SQLITE_ERROR.*` regular expression, then consider the sent FAST request has caused an anomaly:

![Condition example][img-anomaly-condition]

!!! info "Default behavior"
    If there are no configured conditions in this section, the fuzzer will detect the server response with parameters anomalously different from the response to the baseline request. For example, a long server response time can be a reason to detect the server response as anomalous.

## The "Consider result not an anomaly if response" section

If the response from the application meets all the conditions configured in the **Consider result not an anomaly if response** section, then an anomaly is considered not found.

**Example:**

If the response code is lower than `500`, then consider the sent FAST request has not caused an anomaly:

![Condition example][img-not-anomaly-condition]

## The "Stop fuzzing if response" section

If the application response, the number of detected anomalies, or the number of timeout errors satisfies all the conditions configured in the **Stop fuzzing if response** section, then the fuzzer stops searching for anomalies.

**Example:**

Fuzzing will be stopped if more than two anomalies are detected. In each anomaly, you can have any number of single anomalous bytes that is not equal to two.

![Condition example][img-stop-condition]

!!! info "Default behavior"
    If the conditions for stopping the fuzzing process are not configured, then the fuzzer will check all 255 anomalous bytes. If an anomaly is detected, each individual byte in the payload will be stopped.
