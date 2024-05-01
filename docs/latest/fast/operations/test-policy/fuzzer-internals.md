[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Principles of Fuzzer Operation

The fuzzer checks 255 *anomalous bytes*: from `0x01` to `0xFF`. One or more such bytes inserted into the request points can lead to anomalous behavior of the target application.

Instead of checking each byte individually, the fuzzer adds one or more sequences of anomalous bytes (*payloads*) of a fixed length to the point and sends this request to the application.

To modify allowed points, the fuzzer:

* Inserts payloads to:

    * beginning of the value
    * random position of the value
    * end of the value
* Replaces the following payload value:

    * random segments
    * first `M` bytes
    * last `M` bytes
    * entire string

With the [fuzzer configuration][doc-fuzzer-configuration], the size `M` of the payload contained in the request from FAST to application is set in bytes. It affects the following points:

* number of bytes that will be added to the point value if payload insert is used
* number of bytes that will be replaced in the point value if payload replace is used
* number of requests sent to the application

If anomalous behavior is detected in the response to the request with the payload, then the fuzzer will send particular requests for each payload byte to the application. Thus, the fuzzer will detect specific bytes that caused anomalous behavior.

![Scheme of checking for anomalous bytes][img-search-for-anomalies]

All detected bytes are provided in the anomaly description:

![Anomaly description][img-anomaly-description]

??? info "Fuzzer operation example"
    Let the payload size of 250 bytes [replace](fuzzer-configuration.md) the first 250 bytes of some point value.

    In these conditions, the fuzzer creates two requests to send all known anomalous bytes: one with the payload of 250 bytes and another with the payload of 5 bytes.

    The initial point value in the baseline request will be modified as follows:

    * If the value is longer than 250 bytes: initially the first 250 bytes of the value will be replaced by 250 bytes of the payload, then the first 250 bytes will be replaced by 5 bytes of the payload.
    * If the value is shorter than 250 bytes: initially the value will be fully replaced by 250 bytes of the payload, then the value will be fully replaced by 5 bytes of the payload.

    Suppose that the 5 bytes `ABCDE` payload replaced the first 250 bytes of the long point value `_250-bytes-long-head_qwerty` and caused an anomaly. In other words, test request with the point value `ABCDEqwerty` caused an anomaly.

    In this case the fuzzer will create 5 additional requests to check  each byte with the following point values:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    One or more such requests will cause an anomaly again and the fuzzer will form the list of detected anomalous bytes, for example: `A`, `C`.

 Next, you can get information about the [fuzzing configuration][doc-fuzzer-configuration] and the description of rules that define whether the anomaly was found.

The FAST fuzzer processes one allowed point per iteration (*fuzzing*). Depending on [fuzzing stopping rules][link-stop-fuzzing-section], one or more points will be processed consistently.