
[link-git-website]:         https://git-scm.com/
[link-git-docs]:            https://git-scm.com/doc
[link-kubectl-website]:     https://kubernetes.io/docs/reference/kubectl/overview/
[link-kubectl-docs]:        https://kubernetes.io/docs/tasks/tools/install-kubectl/
[link-curl-website]:        https://curl.haxx.se/
[link-curl-docs]:           https://curl.haxx.se/docs/tooldocs.html
    
[img-wallarm-portal-events]:    ../../../images/installation-ingress/1-wallarm-portal-events-en.png
    
    
[link-previous-chapter]:    resource-creation.md
    
    
    
    
#   Checking the Operation of the Wallarm Services

Make sure that the following tools are installed on your machine:
*   [Git][link-git-website] ([official documentation][link-git-docs]).
*   [Kubectl][link-kubectl-website] ([official documentation][link-kubectl-docs]).
*   [Curl][link-curl-website] ([official documentation][link-curl-docs])

To check if the Wallarm services work on the deployed Ingress controller, do the following:

1.  Clone the Wallarm NGINX Plus Ingress controller repository (if you have not done so yet) by executing the following command:
    
    ```
    git clone https://github.com/wallarm/ingress-plus/
    ```
    
2.  Change your working directory to `ingress-plus/examples/complete-example/` by executing the following command:
    
    ```
    cd ingress-plus/examples/complete-example/
    ```
    
3.  Set the necessary environment variables by executing the following commands one by one:
    
    ```
    IC_IP=<the IP address of the Ingress controller>
    IC_HTTPS_PORT=<the HTTPS port of the Ingress controller>
    ```
    
4.  Deploy the demonstration application named Café by executing the following commands one by one:
    
    ```
    kubectl apply -f cafe.yaml
    kubectl apply -f cafe-secret.yaml
    ```
    
5.  Open the YAML text file `cafe-ingress.yaml` with any text editor of your choice (e.g., Nano text editor) and add the `annotations` section (containing Wallarm-specific parameters) in the `metadata` section: 
    
    ```
    ...omitted for clarity...
    metadata:
      name: cafe-ingress
      annotations:
        wallarm.com/mode: "monitoring"
    ...omitted for clarity...
    ```
    
    Save the changes you made to the file.
     
6.  Deploy the Ingress resource named `cafe-ingress` by executing the following command:
    
    ```
    kubectl apply -f cafe-ingress.yaml
    ```
    
7.  Now you should have the deployed application that is served by two backends in the following way:
    *   If the user navigates to the `cafe.example.com/tea path`, they will be served with the webpage from the `tea-svc service`
    *   If the user navigates to the `cafe.example.com/coffee path`, they will be served with the webpage from the `coffee-svc service`
    
8.  Check if the application is in an operational state by executing the following command:
    
    ```
    curl --resolve cafe.example.com:$IC_HTTPS_PORT:$IC_IP https://cafe.example.com:$IC_HTTPS_PORT/tea --insecure
    ```
    
    You should obtain an output similar to the following:
    
    ```
    Server address: 10.244.0.93:80
    Server name: tea-7d57856c44-29p2g
    Date: 12/Dec/2018:08:53:23 +0000
    URI: /tea
    Request ID: 3c58ec15740a85ecf236836387dcaa32
    ```
    
9.  Do a test SQLi attack at the `cafe.example.com/coffee` resource by executing the following command:
    
    ```
    curl --resolve cafe.example.com:$IC_HTTPS_PORT:$IC_IP https://cafe.example.com:$IC_HTTPS_PORT/coffee/UNION%20SELECT --insecure
    ```
    
    You should obtain an output similar to the following:
    
    ```
    Server address: 10.244.0.90:80
    Server name: coffee-7dbb5795f6-ktd49
    Date: 12/Dec/2018:08:58:10 +0000
    URI: /coffee/UNION%20SELECT
    Request ID: c1482cd43a4b285d68a16f31b818c847
    ```
    
10. Log in to the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud with your Wallarm account.
    
    You should see the SQLi attack you have just performed in the *Events* tab.
    
    ![!Wallarm portal Events tab][img-wallarm-portal-events]
    
11. Change the behavior of the Ingress controller so that it blocks the attacker instead of just monitoring attacks. To do that, modify the existing Ingress resource named `cafe-ingress` by executing the following command:
    
    ```
    kubectl annotate --overwrite ingress cafe-ingress wallarm.com/mode=block
    ```
    
12. Repeat the SQLi attack at the `cafe.example.com/coffee` webpage by executing the following command:
    
    ```
    curl --resolve cafe.example.com:$IC_HTTPS_PORT:$IC_IP https://cafe.example.com:$IC_HTTPS_PORT/coffee/UNION%20SELECT --insecure
    ```
    
    You should obtain an output similar to the following:
    
    ```
    <html>
    <head><title>403 Forbidden</title></head>
    <body bgcolor="white">
    <center><h1>403 Forbidden</h1></center>
    <hr><center>nginx/1.15.2</center>
    </body>
    </html>
    ```
    
    If you get a «403 Forbidden» response, then the Wallarm services are set up correctly and are operational.
    
    !!! info
        The blocking behavior of the Ingress controller will also work for the `cafe.example.com/tea` webpage.
