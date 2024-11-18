For the Wallarm node to process mirrored traffic, set the following configuration:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#Change 222.222.222.22 to the address of the mirroring server
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* The [`real_ip_header`](../../using-proxy-or-balancer-en.md) directive is required to have Wallarm Console display the IP addresses of the attackers.
* The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
* Since malicious requests [cannot](overview.md#limitations-of-mirrored-traffic-filtration) be blocked, the Wallarm node always analyzes requests in the monitoring [mode](../../configure-wallarm-mode.md) even if the `wallarm_mode` directive or Wallarm Cloud sets the safe or regular blocking mode (aside from the mode set to off).

Processing of mirrored traffic is supported only by the NGINX-based nodes. You can set the provided configuration as follows:

* If deploying the node from the all-in-one installer, [AWS](../../installation-ami-en.md) or [GCP](../../installation-gcp-en.md) cloud image - in the `/etc/nginx/nginx.conf` NGINX configuration file.
* If deploying the node from the [Docker image](../../installation-docker-en.md) - mount the file with the provided configuration to the container.
* If running the node as [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) or [Ingress controller](../../installation-kubernetes-en.md) - mount the ConfigMap with the provided configuration to a pod.
