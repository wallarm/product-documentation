[link-vulns]:               ../vulnerabilities/check-vuln.md

[img-markers-overview]:     ../../images/user-guides/settings/markers.png

# Setting Markers

You can set markers on the *Settings* → *Markers* tab.

![!Markers tab overview][img-markers-overview]

Markers allow you to mark HTTP/HTTPS packets to have Wallarm process them in a special way.

Markers can be used for the following purposes:
* Authentication of the scanner and the application vulnerability checks.
* Start of the vulnerability search in the newly added application components or API (to provide Continuous Integration/Continuous Delivery).
* Update of an application profile (for situations, when you need to deploy an application's or API's new functionality as fast as possible).

## Creating a Marker

A marker is a 64-bit secret key that must be placed into the `X-Wallarm-Marker` header of an HTTP request.

An example of a marker in the request header:

```
X-Wallarm-Marker: bdb1fcc94e807fbfa59c79xxxxxxxxxxcbd2ec8c33557c94a90b39a7491fd004
```
To create a marker proceed with the following steps:
1. Click *Add marker*.
2. Enter a description, an IP address, and a subnet mask into the form that appears.
3. Click *Add*.

!!! info
    The filter node will use the marker only if its current IP address and the subnet mask match the ones set in the Wallarm interface.

The requests marked with the `X-Wallarm-Marker` header will be used to update the application profile.

## Markers and Fuzzing

Fuzzing is a method of provoking abnormal behavior in a program by inputting atypical data in the program. There is a high probability that fuzzing can cause errors in the program. Wallarm uses fuzzing only for the requests that are marked as safe to be modified.

This method, along with unit tests, provides greater coverage from the information security point of view and covers an application's new components that are being tested, deployed, or are already deployed.

Advanced fuzzing support is in high demand with the companies using Continuous Integration/Continuous Delivery.

### Setting a Fuzzer
To set up a fuzzer, do the following:
1. Add the following header to the request: `X-Wallarm-Marker: <marker>`
2. Add the following header to the request: `X-Wallarm-Fuzzer: yes`
3. Add advanced settings to the header `X-Wallarm-Fuzzer-Policy`:
    * replace-all `<N>`
    * add-to-end `<N>`
    * add-to-begin `<N>`
    * replace-from-end `<M>` `<N>`
    * replace-from-begin `<M>` `<N>`
    * insert-into-random `<N>`

Each vulnerability discovered during the checks will appear on the [*Vulnerabilities* tab][link-vulns] of the Wallarm interface. For such vulnerability, there will also be a report generated and sent to your email.
