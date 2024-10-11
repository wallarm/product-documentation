[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment/5-qsg-fast-inst-scheme.png
[img-fast-create-node]:         ../../images/fast/qsg/common/deployment/6-qsg-fast-inst-create-node.png   
[img-firefox-options]:          ../../images/fast/qsg/common/deployment/9-qsg-fast-inst-ff-options-window.png
[img-firefox-proxy-options]:    ../../images/fast/qsg/common/deployment/10-qsg-fast-inst-ff-proxy-options.png
[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

[link-https-google-gruyere]:    https://google-gruyere.appspot.com
[link-docker-docs]:             https://docs.docker.com/
[link-wl-console]:              https://us1.my.wallarm.com
[link-ssl-installation]:        ../ssl/intro.md

[wl-cloud-list]:    ../cloud-list.md
      
[anchor1]:  #1-install-the-docker-software              
[anchor2]:  #2-obtain-a-token-that-will-be-used-to-connect-your-fast-node-to-the-wallarm-cloud
[anchor3]:  #3-prepare-a-file-containing-the-necessary-environment-variables 
[anchor4]:  #4-deploy-the-fast-node-docker-container 
[anchor5]:  #5-configure-the-browser-to-work-with-the-proxy
[anchor6]:  #6-install-ssl-certificates 
    
    
# FAST node deployment

This chapter will guide you through the process of installation and initial configuration of the FAST node. Upon completion of all necessary steps, you will have an operating FAST node. It will be listening on `localhost:8080`, ready to proxy HTTP and HTTPS requests to the [Google Gruyere][link-https-google-gruyere] application. The node will be installed on your machine along with the Mozilla Firefox browser.
    
!!! info "Note on the browser to use"
    It is suggested in the guide that you use the Mozilla Firefox browser. However, it is possible to use any browser of your choice, provided that you successfully configured it to send all the HTTP and HTTPS traffic to the FAST node.

![FAST node deployment scheme in use][img-qsg-deployment-scheme]    
        
To install and configure the FAST node, do the following:

1.  [Install the Docker software][anchor1].
2.  [Obtain a token that will be used to connect your FAST node to the Wallarm cloud][anchor2].
3.  [Prepare a file containing the necessary environment variables][anchor3].
4.  [Deploy the FAST node Docker container][anchor4].
5.  [Configure the browser to work with the proxy][anchor5].
6.  [Install SSL certificates][anchor6].
            
##  1.  Install the Docker software 

Set up the Docker software on your machine. See the official Docker [installation guide][link-docker-docs] for more information.

It is suggested that you use the Docker Community Edition (CE). However, any Docker edition can be used.
    
    
##  2.  Obtain a token that will be used to connect your FAST node to the Wallarm cloud

1.  Log in to the [My Wallarm portal][link-wl-console] using your Wallarm account.

    If you do not have one, then contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access.

2.  Select the “Nodes” tab, then click the **Create FAST node** button (or the **Add FAST node** link).

    ![Creation of a new node][img-fast-create-node]

3.  A dialog window will appear. Give a meaningful name to the node and select the **Create** button. The guide suggests that you use the name `DEMO NODE`.
    
4.  Move your mouse cursor over the **Token** field of the created node and copy the value.

    !!! info "Note on token"
        It is possible to retrieve the token via a Wallarm API call as well. However, that is beyond the scope of this document. 
        
##  3.  Prepare a file containing the necessary environment variables 

It is required that you set up several environment variables in order to get the FAST node working.

In order to do that, create a text file and add the following text to it:

```
WALLARM_API_TOKEN=<the token value you obtained in step 2>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

You have set the environment variables. Their purpose can be described as follows:
* `WALLARM_API_TOKEN` — sets the token value that is used to connect the node to the Wallarm cloud
* `ALLOWED_HOSTS` — limits the scope of requests to generate a security test from; security tests will be generated only from the requests to the domain `google-gruyere.appspot.com`, which is where the target application resides.
    
!!! info "Using the `ALLOWED_HOSTS` environment variable"
    Setting the fully qualified domain name is not necessary. You could use a substring (e. g. `google-gruyere` or `appspot.com`).

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  Deploy the FAST node Docker container

To do this, execute the following command:

```
docker run --name <name> --env-file=<environment variables file created on the previous step> -p <target port>:8080 wallarm/fast
```

You should provide several arguments to the command:
    
* **`--name`** *`<name>`*
        
    Specifies the name of the Docker container.
    
    It should be unique among all existing containers' names.
    
* **`--env-file=`** *`<environment variables file created in the previous step>`*
    
    Specifies a file containing all the environment variables to export into the container.
    
    You should specify a path to the file you created in the [previous step][anchor3].

* **`-p`** *`<target port>`* **`:8080`**
    
    Specifies a port of the Docker host to which the container’s 8080 port should be mapped. None of the container ports are available to the Docker host by default. 
    
    To grant access to a certain container’s port from the Docker host, you should publish the container’s internal port to the external port by employing the `-p` argument. 
    
    You also could publish the container’s port to a non-loopback IP address on the host by providing the `-p <host IP>:<target port>:8080` argument to make it accessible from outside the Docker host as well.        

!!! info "Example of a `docker run` command"
    The execution of the following command will run a container named `fast-node` employing the environment variables file `/home/user/fast.cfg` and publish its port to `localhost:8080`:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

If the container deployment is successful, you will be presented with a console output like this:

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

Now you should have the ready-to-work FAST node connected to the Wallarm cloud. The node is listening to the incoming HTTP and HTTPS requests on `localhost:8080` by recognizing the requests to the `google-gruyere.appspot.com` domain as baseline ones.
    
    
##  5.  Configure the browser to work with the proxy

Configure the browser to proxy all HTTP and HTTPS requests through the FAST node. 

To set up proxying in the Mozilla Firefox browser, do the following:

1.  Open the browser. Select “Preferences” in the menu. Select the “General” tab and scroll down to the “Network Settings.” Select the **Settings** button.

    ![Mozilla Firefox options][img-firefox-options]

2.  The “Connection Settings” window should open up. Select the **Manual proxy configuration** option. Configure the proxy by entering the following values:

    * **`localhost`** as HTTP proxy address and **`8080`** as HTTP proxy port. 
    * **`localhost`** as SSL proxy address and **`8080`** as SSL proxy port.
        
    Select the **ОК** button to apply the changes you have made.

    ![Mozilla Firefox proxy settings][img-firefox-proxy-options]
    
    
##  6.  Install SSL certificates

While working with the [Google Gruyere][link-https-google-gruyere] application via HTTPS you might encounter the following browser message regarding the interruption of a safe connection:

![“Insecure connection” message][img-insecure-connection]

You should add a self-signed FAST node SSL certificate to be able to interact with the web application via HTTPS. To do so, navigate to this [link][link-ssl-installation], select your browser from the list, and perform the necessary actions described. This guide suggests that you use the Mozilla Firefox browser.
        
Having run and configured your FAST node, you should now have all of the chapter goals completed. In the next chapter, you will learn what is required to generate a set of security tests based on a few baseline requests.
    