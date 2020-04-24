The processing of requests in the filter node is done in two stages:

* Processing in NGINX-Wallarm.
* Postanalytics – statistical analysis of the processed requests.

The processing is not memory demanding and can be put on front end servers without changing the server requirements.

Postanalytics is memory demanding, which may require changes in the server configuration or installation of postanalytics on a separate server.

Wallarm also has the option of installing postanalytics in a separate server pool.
