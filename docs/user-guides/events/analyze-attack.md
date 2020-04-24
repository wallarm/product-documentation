[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md

[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]:   ../../glossary-en.md#attack-vector

# Analyzing Attacks

You can check attacks in the *Events* tab of the Wallarm interface.

Wallarm automatically groups associated malicious requests into one entity — an attack.

## Analyze an Attack

You can get information about an attack by investigating all the table columns described in [“Checking Attacks and Incidents.”][link-check-attack]

## Analyze Requests in an Attack

1. Select an attack.
2. Click the number in the *Requests* column.

Clicking the number will unfold all requests in the selected attack.

![!Requests in the attack][img-analyze-attack]

Each request displays the associated information in the following columns:

* *Date*: Date and time of the request.
* *Payload*: [Attack vector][glossary-attack-vector]. Clicking the value in the payload column displays reference information on the attack type.
* *Source*: The IP address from which the request originated. Clicking the IP address adds the IP address value into the search field.
  * If Wallarm can determine which data center the given IP address belongs to, then the corresponding tag will be displayed in the column: the “AWS” tag for Amazon, the “GCP” tag for Google and the “Azure” tag for Microsoft data centers.
  * If the IP address belongs to the Tor network, then the “Tor” tag will be shown in the column below the address.  
* *Status*: The server's response status code from the request.
* *Size*: The server's response size.
* *Time*: The server's response time.

If the attack is happening at the current moment, the *“now”* label is shown under the request graph.

![!A currently happening attack][img-current-attack]

## Analyze a Request in Raw Format

The raw format of a request is the maximum possible level of detail. 

1. Select an attack.
2. Click the number in the *Requests* column.
3. Click the arrow next to the date of the request.

The Wallarm interface will display the request in its raw format.

![!Raw format of the request][img-analyze-attack-raw]

!!! info "See also"
    [Working with false attacks][link-false-attack]
