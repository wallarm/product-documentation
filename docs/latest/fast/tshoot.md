[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

#   Troubleshooting

##  Common Issues and How to Resolve Them

**What to do if...**

* **...the FAST node displays one of the following messages on the console output?**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    or

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **Solution:** make sure that

    * the FAST node and corresponding Docker host have internet access (particularly, the Wallarm `api.wallarm.com` and `us1.api.wallarm.com` API servers should be accessible via `TCP/443`), and
    * you are using the correct [token][link-token] value and communicating with the appropriate Wallarm API server. Note that FAST employs *different* tokens to connect to the API servers depending on whether they reside in the European or the American clouds.
    
* **...a request source does not trust the FAST node's self-signed SSL certificate?**

    **Solution:** set up a trusted SSL certificate by using any method listed in [these instructions][doc-ssl].
    
* **...the FAST node is up and running but no baseline requests are being recorded?**

    **Solution:** check the following:

    * The request source is configured to use the FAST node as a proxy server and is supplied with the correct port, domain name, or IP address of the node to connect to.
    * The request source is using the FAST node as a proxy server for every protocol that is in use by the source (a common situation is that the FAST node is employed as an HTTP proxy, while the request source is trying to send HTTPS requests).
    * The [`ALLOWED_HOST`][doc-allowed-host] environment variable is configured correctly.
    
* **...no FAST tests or custom extensions are running on the FAST node?**

    **Solution:** check that the FAST node records baseline requests and that these baseline requests comply with the test policy that is in use by the node.

##  Contacting the Support Team

If you either cannot find your issue in the list above, or consider the solution unhelpful, contact the Wallarm support team.

You can either [write an email](mailto:support@wallarm.com) or fill in the form on the Wallarm portal. To send a feedback through the portal, do the following:

* Click the question mark in the top right corner of the portal.
* In the opened sidebar, select the “Wallarm Support” entry.
* Write and send an email.

##  Collecting Diagnostic Data

A member of the Wallarm support team may ask you to collect a piece of diagnostic data concerning the FAST node.

Set a few environment variables, then execute the following commands to collect the data (replace the `<FAST node container's name>` with the real name of the FAST node container that you want to fetch the diagnostic data from):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <FAST node container's name> /usr/local/bin/collect_info_fast.sh

docker cp <FAST node container's name>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

After the successful execution of these commands, the diagnostic data will be placed in the `fast_supout-$TIMESTAMP.tar.gz` archive on the Docker host. The `$TIMESTAMP` in the archive name will represent the collection time.
