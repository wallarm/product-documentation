[link-kubectl-website]:             https://kubernetes.io/docs/reference/kubectl/overview/
[link-kubectl-docs]:                https://kubernetes.io/docs/tasks/tools/install-kubectl/
[link-host-header]:                 https://tools.ietf.org/html/rfc7230#section-5.4
[link-ingress-docs]:                https://kubernetes.io/docs/concepts/services-networking/ingress/
[link-example-domain]:              https://www.example.com/
[anchor1]:      #1-creating-a-file-with-the-settings-for-the-ingress-resource
[anchor2]:      #2-deploying-the-ingress-resource
[link-next-chapter]:        wallarm-services-check.md
[link-previous-chapter]:    deploy.md

#   Creating an Ingress Resource
    
In order to get the Ingress controller fully operational, you should deploy an Ingress resource. The Ingress resource sets the routing rules for incoming HTTP and HTTPS traffic so that such traffic can reach your services. 

To deploy an Ingress resource, do the following:
1.  [Create a file containing the settings for the Ingress resource][anchor1]
2.  [Deploy the Ingress resource][anchor2]

This guide also provides you with an example of an Ingress resource for the Café demonstration application.

Make sure that the following tool is installed on your machine:
*   [Kubectl][link-kubectl-website] ([official documentation][link-kubectl-docs]).

## 1. Creating a File with the Settings for the Ingress Resource

Create a YAML text file `ingress.yaml` (you can choose any name you like) containing the following text:

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: <the name of the Ingress resource>
  annotations:
    wallarm.com/mode: "monitoring"
spec:
  rules:
  - host: <your application’s domain name>
    http:
      paths:
      - path: /
        backend:
          serviceName: <service name>
          servicePort: <service port>
```

The Ingress resource deployed with these settings will balance the incoming HTTP and HTTPS traffic with the [Host][link-host-header] header. You can add several `host` entries to the `spec.rules` section. 

 You could define routing rules for each domain name that is set using the `host` parameter. The file describes the following behavior: if the user navigates to `/`, they are redirected to the certain service deployed in the Kubernetes cluster.

You can obtain more information about Ingress resource deployment process [here][link-ingress-docs].

##  2.  Deploying the Ingress Resource

To deploy the Ingress resource described by the `ingress.yaml` file, execute the following command:

```bash
kubectl apply -f ingress.yaml
```

Given that the resource deployment was successful, you will be provided with the following output:

```
ingress.extensions/<the name of the Ingress resource> created
```

Check out the newly deployed Ingress resource by executing the following command:

``` bash
kubectl get ingress <the name of the Ingress resource>
```

An example of output:

```
NAME           HOSTS              ADDRESS         PORTS     AGE
cafe-ingress   cafe.example.com <Ingress IP addr> 80, 443   1h
```

Obtain a detailed description of the Ingress resource by executing the following command:

``` bash
kubectl describe ingress <the name of the Ingress resource>
```

You will be given the following information in the description:
*   The IP address and the port numbers on which the Ingress controller is listening
*   The Ingress routing rules
*   An event list

Make sure that you set up the correct DNS records pointing to the Ingress controller’s IP address for the required domain names.



Now you can check the Ingress operation by navigating in your browser to the necessary address assigned to your application (e.g., [www.example.com][link-example-domain]). Given that you correctly deployed the Wallarm NGINX Plus Ingress controller and the Ingress resource, you should be redirected to your application’s webpage.
