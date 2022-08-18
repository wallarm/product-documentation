Starting with version 4.0, the filtering node uploads data to the Cloud using the `api.wallarm.com:443` (EU Cloud) and `us1.api.wallarm.com:443` (US Cloud) API endpoints instead of `api.wallarm.com:444` and `us1.api.wallarm.com:444`.

If you upgrade the node from the version 3.x or lower and your server with the deployed node has a limited access to the external resources and the access is granted to each resource separately, then after upgrade the synchronization between the filtering node and the Cloud will stop.

To restore the synchronization, in your configuration, change port `444` to `443` for API endpoint for each resource.
