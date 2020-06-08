
[link-nginx-website]:   https://www.nginx.com/free-trial-request/
[link-docker-website]:  https://www.docker.com/
[link-docker-docs]:     https://docs.docker.com/
[link-git-website]:     https://git-scm.com/
[link-git-docs]:        https://git-scm.com/doc
[link-gnu-website]:     https://www.gnu.org/software/make/
[link-gnu-docs]:        https://www.gnu.org/software/make/manual/
[link-docker-hub]:      https://hub.docker.com/
[link-google-cr]:       https://cloud.google.com/container-registry/
[link-ms-azure-cr]:     https://azure.microsoft.com/en-us/services/container-registry/
[link-docker-security]: https://docs.docker.com/engine/security/security/#docker-daemon-attack-surface
[link-acr-docs]:        https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication
[link-gcloud-docs]:     https://cloud.google.com/container-registry/docs/quickstart
[link-ingress-github]:  https://github.com/wallarm/ingress-plus/
    
[anchor1]:  #setting-up-a-build-environment
[anchor2]:  #building-the-ingress-controller
[anchor3]:  #docker-registry-name
    
[link-next-chapter]:        deploy.md
[link-previous-chapter]:    introduction.md
    
    
    
    
#   Building Wallarm NGINX Plus Ingress Controller from the Source Files
    
!!! info
    Check if you have an NGINX Plus license before you start. You can obtain a 30-day trial license by navigating to the [NGINX site][link-nginx-website]. The license consists of two files:

    *   The `nginx-repo.key` key file,
    *   The `nginx-repo.crt` certificate file.

To build the Wallarm NGINX Plus Ingress controller from the source files, do the following:
1.  [Set up a build environment][anchor1]
2.  [Build the Ingress controller][anchor2]

!!! info
    It is suggested that you build the software on the Linux operating system.

##  Setting up a Build Environment
Make sure that the following tools are installed on your machine:
*   [Docker][link-docker-website] ([official documentation][link-docker-docs]),
*   [Git][link-git-website] ([official documentation][link-git-docs]),
*   [GNU Make][link-gnu-website] ([official documentation][link-gnu-docs]).

It is also required that you have a private Docker repository. 

Services that provide you with the means to access and manage Docker repositories are known as Docker registries.

You should create a Docker repository if you do not have one. 
You can use your own Docker registry or use any service that will provide you with a hosted private Docker repository (e.g., [Docker Hub][link-docker-hub], [Google Container Registry][link-google-cr], [Microsoft Azure Container Registry][link-ms-azure-cr]).
    
!!! warning
    It is strongly recommended that you do not host a Docker image of the Wallarm NGINX Plus Ingress controller in the public Docker repository due to the risk of exposing the NGINX Plus license files to the public.
    

    
!!! info
    It is sufficient to obtain access to the Docker Hub registry in order to complete this guide. The registry will provide you with one free-of-charge private Docker repository. 
    
You should gather the following information to continue:
*   The login and password pair that you use to access the Docker registry
*   The name of the Docker registry
*   A path to the repository

!!! info "Docker registry name"
    Depending on the service provider chosen, the name of the Docker registry and the path to the repository can be different. Please consult with your service provider’s documentation for more information.
    
    There are some well-known names for the Docker registries:
    
    *   `docker.io` for Docker Hub,
    *   `gcr.io` for Google Container Registry,
    *   `<your repository name>.azurecr.io` for Microsoft Azure Container Registry.
    
    The Docker’s registry name is a part of the path to the repository. For example, if you are using Docker Hub, the path to access the repository `example‑repository` created by user `john` will be as follows: `docker.io/john/example‑repository`.

##  Building the Ingress Controller
1.  Log in to your Docker registry by executing the following command:
    
    ```
    docker login <name of the Docker registry>
    ```
    
    You should provide the login and password that you use to access the Docker registry when prompted.
    
    !!! info "Example"
        To log in to the Docker Hub registry execute the following command:
        ``` bash
        docker login docker.io
        ```
        
    
        
    !!! warning
        Depending on your system settings, you could be required to elevate privileges either by issuing the `sudo` command or running the command as the `root` user in order to execute the `docker` command.
        
        You have the option to allow executing the `docker` command by the currently logged-in user. To do so, you have to add the user to the `docker` group. However, you must remember that having membership in this group is equal to having the `root` user’s privileges. This may potentially lead to severe security-related issues. You can obtain more detailed information [here][link-docker-security]. 
        
    
        
    !!! info
        Your service provider may provide additional tools to manage Docker registries. For example, Microsoft ships an [az acr][link-acr-docs] tool to manage the Microsoft Azure Container Registry, whereas Google provides you with a [gcloud][link-gcloud-docs] tool to manage the Google Container Registry. You can use these tools instead of the `docker`&nbsp;`login` command to log in to the specific registries. Please consult your service provider’s documentation for more information.
    
2.  Clone the Wallarm NGINX Ingress Plus repository by executing the following command:
    
    ```
    git clone https://github.com/wallarm/ingress-plus/
    ```
    
3.  Change your working directory to the `ingress-plus/` by executing the following command:
    
    ```
    cd ingress-plus/
    ```
    
4.  Copy the NGINX Plus key and certificate files in the working directory. If you do not have the files, you have to obtain an NGINX Plus license. An `scp` utility or similar tool could be used to perform the copy operation.  
    
    Make sure that you have copied all necessary files by executing the following command:
    
    ```
    ls nginx-repo.*
    ```
    
    You should be provided with the following output:
    
    ```
    nginx-repo.crt nginx-repo.key
    ```
    
5.  Initiate the building process by executing the following commands one by one:
    
    ```
    make clean
    make DOCKERFILE=DockerfileForPlus PREFIX=<the path to your Docker repository>
    ```
    
    Note that you should provide the path to your Docker repository as the value of the `PREFIX` argument in the `make` command. A Docker image will be pushed to that repository when the build process is complete.
    
    !!! info "Example"
        To publish the image to the private repository `example-repository`, created by user `john` and hosted on Docker Hub, provide the following `PREFIX` argument to the `make` command:
        
        ```
        make DOCKERFILE=DockerfileForPlus PREFIX=docker.io/john/example-repository
        ```

You can start [deployment of the Ingress controller][link-next-chapter] once the build process finishes.
