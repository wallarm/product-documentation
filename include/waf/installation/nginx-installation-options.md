The processing of requests in the Wallarm node is divided into two stages:

* Primary processing in the NGINX-Wallarm module. The processing is not memory demanding and can be put on frontend servers without changing the server requirements.
* Statistical analysis of the processed requests in the postanalytics module. Postanalytics is memory demanding, which may require changes in the server configuration or installation of postanalytics on a separate server.

Depending on the system architecture, the NGINX-Wallarm and postanalytics modules can be installed on the **same server** or on **different servers**.
