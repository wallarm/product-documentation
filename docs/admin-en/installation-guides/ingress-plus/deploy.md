    
[link-kubernetes-docs-rbac]:            https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[link-helm-website]:                    https://helm.sh/
[link-helm-docs]:                       https://docs.helm.sh/
[link-git-website]:                     https://git-scm.com/
[link-git-docs]:                        https://git-scm.com/doc
[link-kubectl-website]:                 https://kubernetes.io/docs/reference/kubectl/overview/
[link-kubectl-docs]:                    https://kubernetes.io/docs/tasks/tools/install-kubectl/
[link-configure-kubectl-kubernetes]:    https://kubernetes.io/docs/tasks/tools/install-kubectl/#configure-kubectl
[link-configure-kubectl-ms]:            https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough#connect-to-the-cluster
[link-configure-kubectl-google]:        https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl
[link-open-ssl-website]:                https://www.openssl.org/
[link-ssl-helm-tiller]:                 https://docs.helm.sh/using_helm/#using-ssl-between-helm-and-tiller
[link-kubernetes-docs-secret]:          https://kubernetes.io/docs/concepts/configuration/secret/
[link-helm-chart-configuration-docs]:   https://github.com/nginxinc/kubernetes-ingress/tree/master/deployments/helm-chart#configuration
[link-kubernetes-secrets-docs]:         https://kubernetes.github.io/ingress-nginx/user-guide/tls/

    
[anchor1]:  #1-setting-up-the-deployment-environment
[anchor2]:  #2-configuring-the-wallarm-nginx-plus-ingress-controller
[anchor3]:  #3-deploying-the-wallarm-nginx-plus-ingress-controller
[anchor4]:  #1-setting-up-kubectl-to-interact-with-your-kubernetes-cluster
[anchor5]:  #2-setting-up-helm-to-interact-with-your-kubernetes-cluster
[anchor6]:  #3-creating-a-kubernetes-secret-to-access-your-docker-registry
[anchor7]:  #4-obtaining-a-token-to-connect-the-wallarm-nginx-plus-ingress-controller-to-the-wallarm-cloud
    
[link-next-chapter]:        resource-creation.md
[link-previous-chapter]:    assembly.md
    
#   Deploying the Wallarm NGINX Plus Ingress Controller

--8<-- "../include/ingress-k8s-limitations.md"

Given that you have the Wallarm NGINX Plus Ingress controller image pushed to your private Docker repository, you are ready to deploy the Ingress controller in your Kubernetes cluster.

To deploy the Ingress controller, do the following:
1.  [Set up a deployment environment][anchor1]
2.  [Configure the Ingress controller][anchor2]
3.  [Deploy the Ingress controller][anchor3]

    
!!! info "RBAC support"
    If a Role-Based Access Control (RBAC) mechanism is enabled in your Kubernetes cluster, you should perform additional steps to get your Ingress controller properly configured. This guide will provide you with the basic configurations for either RBAC-enabled clusters or RBAC-disabled clusters.
    
    If your cluster has the RBAC configured in a specific way or if you need additional information about role-based cluster access management, refer to the official Kubernetes [documentation][link-kubernetes-docs-rbac]. If you use a Kubernetes cluster from a cloud service provider, you could refer to the provider’s documentation as well.

##  1.  Setting up the Deployment Environment

To set up the deployment environment, do the following:
1.   [Set up Kubectl to interact with your Kubernetes cluster][anchor4]
2.   [Set up Helm to interact with your Kubernetes cluster][anchor5]
3.   [Create a Kubernetes secret to access your Docker registry][anchor6]
4.   [Obtain a token to connect the Ingress controller to the Wallarm cloud][anchor7]

Make sure that the following tools are installed on your machine:
*   [Helm][link-helm-website] ([official documentation][link-helm-docs]),
*   [Git][link-git-website] ([official documentation][link-git-docs]),
*   [Kubectl][link-kubectl-website] ([official documentation][link-kubectl-docs]). 

### 1.  Setting up Kubectl to Interact with Your Kubernetes Cluster

The basic setup instructions are available [here][link-configure-kubectl-kubernetes].

If you use a Kubernetes cluster from a cloud service provider, refer to the provider’s documentation (e.g., [Microsoft][link-configure-kubectl-ms] or [Google][link-configure-kubectl-google] documentation). 

After you have successfully configured the Kubectl tool, check if it is in an operational state. To do that, execute the command:

``` bash
kubectl get nodes
```

The output of the command must contain no errors but include a list of all Kubernetes cluster nodes.

!!! info "Example"
    ```
    kubectl get nodes
    NAME                                             STATUS    ROLES     AGE       VERSION
    gke-ingress-scratch-default-pool-a3fd18a6-smfn   Ready     <none>    3d        v1.11.3-gke.18
    ```

### 2.  Setting up Helm to Interact with Your Kubernetes Cluster

!!! info
    Helm is a two-component tool comprising
    
    *   The client part named Helm that sends commands to the Tiller server
    *   The server part named Tiller that installs directly into you Kubernetes cluster and does all the backstage work of deployment applications via Helm Charts.

    Helm and Tiller communicate in an open way by default, with no encryption of any messages. You could add SSL encryption for better security. You need an [OpenSSL][link-open-ssl-website] tool if you want to do that. More information about securing Helm and Tiller can be obtained [here][link-ssl-helm-tiller]. 

Depending on whether RBAC is enabled in your cluster, you should take different approaches while configuring Helm.

If your Kubernetes cluster is RBAC-enabled, do the following to set up Helm:
1.  Make sure that the Kubectl tool works in the context with the necessary permissions (Kubectl should be run by the user whose account has been correctly assigned a `cluster-admin` role in your cluster).
    
    !!! info
        Some Kubernetes cluster service providers (e.g., Microsoft) create and bind the `cluster-admin` role to the user account while the Kubectl tool is being initialized, whereas others do not. In the latter case, it is necessary to manually create the role binding. For example, if you use Google Kubernetes Engine, bind the role to your account by executing the following command:
        
        ```
        kubectl create clusterrolebinding user-admin-binding --clusterrole=cluster-admin --user=$(gcloud config get-value account)
        ```
        
        To obtain more detailed information, refer to your service provider’s documentation.

2.  Create a YAML text file `helm-rbac.yaml` (you can choose any name you like) containing the following text:

    ```
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: tiller-account
      namespace: kube-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: tiller-admin-binding
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
      - kind: ServiceAccount
        name: tiller-account
        namespace: kube-system
    ```
    
    The service account `tiller-account` is specified here and is bound to the cluster role `cluster-admin`.
    
3.  Apply the configuration from the file `helm-rbac.yaml` by executing the following command:
    
    ```
    kubectl apply -f helm-rbac.yaml
    ```
    
    You should be provided with the following output:
    ```
    serviceaccount "tiller-account" created
    clusterrolebinding.rbac.authorization.k8s.io "tiller-admin-binding" created
    ```
    
4.  To initialize Tiller with the privilege level of the created service account `tiller-account`, execute the following command:
    
    ```
    helm init --service-account=tiller-account
    ```

If the command `helm init` was successfully executed, you will be presented with an output similar to the following:

```
Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
To prevent this, run `helm init` with the --tiller-tls-verify flag.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation
Happy Helming!
```

Check if Helm is in an operational state by executing the command `helm ls --all`. 
The output of the command must contain no errors but include the list of all Helm Chart deployments in your cluster (note that the list might be empty; this is normal).


### 3.  Creating a Kubernetes Secret to Access Your Docker Registry

Helm requires a Kubernetes secret to access your Docker registry. Provided with the secret, Helm will be able to pull the Wallarm NGINX Ingress Plus controller Docker image from your private repository during the deployment process.

A secret to access a Docker registry comprises the registry name and the credentials used to access the registry (a login and password pair for the Docker registry).

To create the Kubernetes secret for a Docker registry, execute the following command:

``` bash
kubectl create secret docker-registry <secret’s name> --docker-server=<FQDN or IP address of the Docker registry> --docker-username=<login for accessing the Docker registry> --docker-password=<password for accessing the Docker registry>
```

You should provide the following values to the command:
*   The secret’s name
*   The name of the Docker registry as a value to the  `--docker-server` parameter
*   The login for accessing the registry as a value to the `--docker-username` parameter
*   The password for accessing the registry as a value to the `--docker-password` parameter

!!! info "Example"
    To create a secret `my-secret` for accessing a Docker Hub registry with the credentials of the user with the login `example-user` and the password `pAssw0rd`, execute the following command:
    ```
    kubectl create secret docker-registry my-secret --docker-server=https://index.docker.io/v1/ --docker-username=example-user --docker-password=pAssw0rd
    ```

!!! info
    Depending on the Docker registry in use, the value of the `--docker-server` parameter can be different. Consult your service provider’s documentation to find the correct value of the parameter.

!!! info "Kubernetes secret configuration"
    You can obtain more information about the configuration of a Kubernetes secret [here][link-kubernetes-docs-secret].

### 4.  Obtaining a Token to Connect the Wallarm NGINX Plus Ingress Controller to the Wallarm Cloud

The Wallarm NGINX Plus Ingress controller interacts with the Wallarm cloud during operation.

The Ingress controller is connected to the cloud with the use of a token. To obtain the token, do the following:
1.  Log in to the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud with your Wallarm account. If you do not have one, you should create a 14-day trial account by navigating to the [EU](https://my.wallarm.com/signup) or [US](https://us1.my.wallarm.com/signup) cloud to sign up.
2.  Navigate to the *Nodes* tab and select the *Create new node* button. 
3.  Set an appropriate name for a node («node» is another name for your Ingress controller installation). Choose the «Cloud» option from the *Type of installation* drop-down menu.
4.  Select the *Create* button.
5.  Copy the token value from the pop-up window.

##  2.  Configuring the Wallarm NGINX Plus Ingress Controller

To configure the deployment of your Ingress controller, do the following:
1.  Clone the Wallarm NGINX Plus Ingress controller repository, if you have not done that yet, by executing the following command:
    
    ```
    git clone https://github.com/wallarm/ingress-plus/
    ```
    
2.  Change your working directory to `ingress-plus/deployments/helm-chart/` by executing the following command:
    
    ```
    cd ingress-plus/deployments/helm-chart/
    ```
    
3.  The file `values-plus.yaml` is a template of a deployment configuration required to deploy the Wallarm NGINX Plus Ingress controller with the use of Helm Chart.
    
    Copy the template file to the file named `wl-ingress-plus.yaml` (you can choose any other file name). Open the `wl-ingress-plus.yaml` file in a text editor (e.g., Nano text editor):
    
    ```
    cp values-plus.yaml wl-ingress-plus.yaml 
    nano wl-ingress-plus.yaml
    ```
    
4.  Make changes to the content of the file as follows:
    1.  Set the path to your private Docker repository (containing the Docker image of Wallarm NGINX Ingress Plus controller) as the value of the `controller.image.repository` parameter. Additionally, make sure that the version of the Docker image (or tag) hosted in your repository is identical to the value of the `controller.image.tag` parameter:
        
        ```
        controller:
        ...omitted for clarity...
          image:
            repository: <path to the Docker repository>
            tag: "<version of the Ingress controller build>"
        ...omitted for clarity...
        ```
        
        !!! info "Example"
            The following parameters set the `example.com/example-repository` as the path to the Docker repository and `1.3.2` as the tag:
            ```
            image:
              repository: example.com/example-repository
              tag: "1.3.2"
            ```
    
    2.  Set `true` as the value of the `controller.wallarm.enabled` parameter:
   
        ```
        controller:
        ...omitted for clarity...
          wallarm:
            enabled: true
            ...omitted for clarity...
        ```
        
    Save the changes you made to the file.    
    
    !!! info
        It is recommended that you set your own values for the TLS key and certificate instead of the default ones in the `controller.defaultTLS` section.
        
        You can use [OpenSSL][link-open-ssl-website] to generate the certificate and the key. You might be interested in the information about available [Helm Chart parameters][link-helm-chart-configuration-docs] and about how to set a [Kubernetes secret][link-kubernetes-secrets-docs] for a TLS certificate and key.
    
5.  If your Kubernetes cluster is an RBAC-disabled one, you should change a few parameters in the file in addition to those you changed in the previous steps:
    1.  Set the value of the `controller:serviceAccountName` parameter to the empty string:
        
        ```
        controller:
        ...omitted for clarity...
          serviceAccountName:
        ...omitted for clarity...
        ```
        
    2.  Set the value of the `rbac.create` parameter to `false`:
        
        ```
        rbac:
          create: false
        ```
    
    Save the changes you made to the file.

##  3.  Deploying the Wallarm NGINX Plus Ingress Controller

Execute the command below to deploy the Wallarm NGINX Plus Ingress controller with the use of the parameters listed in the file `wl-ingress-plus.yaml`.

Prior to running the command, paste the necessary values into the corresponding command arguments:
*   `<secret name>`: the name of the Kubernetes secret you've created earlier (e.g., `my-secret`).
*   `<token value>`: the value of the Wallarm token you've obtained earlier (e.g., `qwerty`).

``` bash
helm install --set controller.wallarm.imagePullSecrets.name="<secret name>",controller.wallarm.token="<token value>" --name wl-ingress-plus -f wl-ingress-plus.yaml .
```

!!! info
    Feel free to use any suitable name as the value of the `--name` parameter as long as it is not used by other deployments made with Helm.

Make sure that the controller was correctly deployed by executing the following commands one by one:

``` bash
helm ls
kubectl get pods,deployments,svc
```

You should be provided with an output similar to the following (the names of your Kubernetes pods may differ from those shown in the example output):

``` bash
helm ls
NAME            REVISION        UPDATED                         STATUS          CHART                           APP VERSION     NAMESPACE
wl-ingress-plus 1               Mon Dec 10 11:09:55 2018        DEPLOYED        wallarm-ingress-plus-1.0.3      1.3.2           default


kubectl get pods,deployments,svc
NAME                                                   READY     STATUS    RESTARTS   AGE
pod/nginx-ingress-75b6958849-wdv7s                     3/3       Running   0          13m
pod/nginx-ingress-wallarm-tarantool-846c69b49b-qcqdq   8/8       Running   0          13m

NAME                                                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/nginx-ingress                     1         1         1            1           13m
deployment.extensions/nginx-ingress-wallarm-tarantool   1         1         1            1           13m

NAME                                      TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
service/kubernetes                        ClusterIP      10.0.0.1      <none>        443/TCP                      5d
service/nginx-ingress                     LoadBalancer   10.0.86.245   <pending>        80:30614/TCP,443:31593/TCP   13m
service/nginx-ingress-wallarm-tarantool   ClusterIP      10.0.81.30    <none>        3313/TCP                     13m
```

An Ingress controller works in conjunction with an Ingress resource that describes the incoming HTTP and HTTPS traffic routing rules, thereby allowing the traffic to reach your services deployed in the Kubernetes cluster. 

As your next step, you should deploy the Ingress resource for the Ingress controller to work.
