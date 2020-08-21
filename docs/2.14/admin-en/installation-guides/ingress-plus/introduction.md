    
[link-next-chapter]:    assembly.md


[link-ingress-controller-assembly]: assembly.md
[link-ingress-controller-deploy]:   deploy.md
[link-ingress-resource-creation]:   resource-creation.md
[link-wallarm-services-check]:      wallarm-services-check.md
    
    
    
    
#   Introduction    

This guide will use “Wallarm NGINX Plus Ingress controller” as the shortened name for the “NGINX Plus Ingress controller with integrated Wallarm services.”

You should build the Wallarm NGINX Plus Ingress controller from the source files before using it. 

This guide describes the process of building the Wallarm NGINX Plus Ingress controller from the source files, as well the processes of configuration and deployment of the software. 
    
To deploy the Wallarm NGINX Plus Ingress controller, do the following:
1.   [Build the Ingress controller from the source files][link-ingress-controller-assembly].
2.   [Deploy the Ingress controller][link-ingress-controller-deploy].
3.   [Create an Ingress resource][link-ingress-resource-creation].
4.   [(Optional) Check if the Wallarm services are in an operational state][link-wallarm-services-check].

--8<-- "../include/ingress-k8s-limitations.md"
