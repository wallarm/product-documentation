# How the Detect Phase Operates with Markers
Markers are useful instruments that allow checking if a vulnerability is exploited by the test request. Markers can be inserted into the majority of the detect section parameters.

Currently, the FAST extensions support the following markers:
* The `STR_MARKER` string marker is a string that consists of random symbols. 
    
    Upon transferring the `STR_MARKER` as a part of the payload, detecting it in the response may mean that the attack on the target application was successful.
    
    For example, the fact that the `alert` is present in the server's response HTML markup does not necessarily mean that the application has the vulnerability. The server can generate the `<alert>` by itself. The presence of the `alert` (`STR_MARKER`) in the response means that this is the response to the test request containing the payload that includes the string marker (i.e., the vulnerability exploitation was successful). 
    
    The string marker is mostly used to exploit XXS vulnerabilities.

* The numerical `CALC_MARKER` is an arithmetic expression that may be calculated during vulnerability exploitation.  
    
    Upon transferring the `CALC_MARKER` as a part of the payload, detecting the calculated expression’s result in the response may mean that the attack on the target application was successful.
    
    The numerical is mostly used to exploit RCE vulnerabilities.

* The `DNS_MARKER` is a randomly generated domain name, such as `abc123.wlrm.tl`. The target application can try to resolve this name into an IP address.
    
    Upon transferring the `DNS_MARKER` as a part of the payload, detecting the DNS request to the generated domain name may mean that the attack on the target application was successful. 

