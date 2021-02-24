# What is new in WAF node 2.18

## New features

* New variable `wallarm_attack_type_list` in the extended WAF node logging format. Attack types detected in the request are saved in this variable in text format.
    [More details on the variable `wallarm_attack_type_list` →]
* New method for setting up the blocking page and error code returned in the response to the blocked request. Now, to return different responses to requests originated from different devices and applications, you can use the variable as the value of the directives `wallarm_block_page` and `wallarm_acl_block_page`.
    [Detailed instructions on setting up the response via the variable →]
* New WAF node statistics parameter `startid`. This parameter stores the randomly-generated unique ID of the WAF node.
    [The full list of available statistics parameters →]
* Support of new Wallarm Ingress controller annotation `nginx.ingress.kubernetes.io/wallarm-acl-block-page`. This annotation is used to set up the response to the request originated from a blocked IP address.
    [Example of response configuration via `nginx.ingress.kubernetes.io/wallarm-acl-block-page` →]
* Decreased memory amount allocated for the postanalytics service in deployed WAF node cloud image by default.
    In previous WAF node versions, the default memory amount allocated for Tarantool was 75% of the total instance memory. In the WAF node version 2.18, 40% of the total instance memory is allocated for Tarantool.

## Update process

To update the WAF node, it is recommended to check the general recommendations for the process and follow the instructions for updating the installed modules:

* [General recommendations for a safe WAF node update process](general-recommendations.md)
* [Updating modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Updating the Docker container with the modules for NGINX or Envoy](docker-container.md)
* [Updating NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
* [Cloud WAF node image](cloud-image.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
