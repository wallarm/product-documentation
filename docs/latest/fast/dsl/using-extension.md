[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# Using the FAST Extensions

## Connecting Extensions

To use the created extensions, you need to connect them to the FAST node.

You can do this in either of the following ways:
* Place the extensions in a directory and mount this directory into the FAST node Docker container using the `-v` option of the `docker run` command.
    
    ```
    sudo docker run --name <container name> --env-file=<file with environment variables> -v <directory with extensions>:/opt/custom_extensions -p <target port>:8080 wallarm/fast
    ```
    
    **Example:**
    
    Run the command below to launch the FAST node in the Docker container with the following arguments:

    1.  The name of the container: `fast-node`.
    2.  The environment variables file: `/home/user/fast.cfg`.
    3.  The FAST extensions directory path: `/home/user/extensions`.
    4.  The port to which the `8080` port of the container is published: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* Place the extensions into a public Git repository and define the environment variable, which refers to the necessary repository, in the FAST node Docker container.
    
    To do this, perform the following:
    
    1.  Add the `GIT_EXTENSIONS` variable into the file that contains the environment variables.

        **Example:**
        
        If your extensions are in the `https://github.com/wallarm/fast-detects` Git repository, define the following environment variable:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  Run the FAST node Docker container using the file containing the environment variables as follows:
        
        ```
        sudo docker run --name <container name> --env-file=<file with environment variables> -p <target port>:8080 wallarm/fast
        ```
        
        **Example:**
        
        Run the command below to launch the FAST node in the Docker container with the following arguments:

        1.  The name of the container: `fast-node`.
        2.  The environment variables file: `/home/user/fast.cfg`.
        3.  The port to which the `8080` port of the container is published: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

 If the FAST node launches successfully, it writes to the console the following output that informs about the successful connection to the Wallarm Cloud and the number of extensions loaded:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

If an error occurs during the node launch, the error information is written to the console. The message about the extension syntax error is shown in the following example:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "Extensions location requirements"
    The extensions from the nested directories will not be connected (for example, if the extension is placed into the `extensions/level-2/` directory). Depending on the chosen method of connection, the extensions should be placed either into the root of the directory that is mounted into the FAST node Docker container or into the root of the Git repository.

## Checking Operation of Extensions

To check the operation of the [`mod-extension.yaml`][doc-mod-extension] and [`non-mod-extension.yaml`][doc-non-mod-extension] extensions that were created earlier, perform the following actions:

1.  Connect the extensions to the FAST node by following [the aforementioned steps][anchor-connect-extension].

2.  Create the testing policy. This will be used by all FAST extensions that are connected to the FAST node. Detailed information about how test policies work is located [here][doc-testpolicy].

    Let us remind you that the connected modifying extension changes the `POST_JSON_DOC_HASH_email_value` point in a baseline request, and the non-modifying extension requires the permissions to work with the `URI` point.
    
    Therefore, to make both extensions execute during a single test run, a test policy should allow working with:
    
    * POST parameters
    * the URI parameter
    
    ![Test policy wizard, the “Insertion points” tab][img-test-policy-insertion-points]
    
    Also, the extensions check if the application is vulnerable to an SQLi attack; therefore it may be convenient to check the application for other vulnerabilities with the Wallarm FAST detects (e.g., RCE). This will help you to confirm that the SQLi vulnerability is being detected with the created extensions rather than built-in FAST detects. 
    
    ![Test policy wizard, the “Attacks to test” tab][img-test-policy-attacks]
    
    The resulting test policy should look like:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  Create a test run for your FAST node based on the created testing policy.
    
    ![Test run][img-test-run]

4.  Wait until the FAST node writes an informational message to the console similar to the following: `Recording baselines for TestRun#`. This means that the FAST node is ready to record the baseline requests.<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5.  Create and send a POST request with random parameters to the OWASP Juice Shop login page through the FAST node, as shown in the following example:
    
    ```
    curl --proxy http://<FAST node IP address> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    You may use `curl` or other tools to send the request.
    
    !!! info "Stopping the baseline request recording process"
        After sending the baseline request, it is recommended to stop the recording process. This procedure is described [here][link-stop-recording].

6.  In the FAST node console output you will see how:  

    * the target application is tested using the built-in FAST detects,
    * the modifying FAST extension executes for the POST parameters in the baseline request, and
    * the non-modifying FAST extension executes for the URI parameter in the baseline request.
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    You can see the full log of request processing by opening the test run information on the Wallarm web interface and clicking the “Details” link.
    
    ![Detailed test run information][img-testrun-details]
    
    ![Full log of request processing][img-log]

7.  You can also see information about the detected vulnerabilities by clicking the link that contains the number of detected issues, e.g., “2 issues.” The “Vulnerabilities” page will open.

    ![Vulnerabilities on the Wallarm web interface][img-vulns]
    
    The “Risk,” “Type,” and “Title” columns will contain the values that were specified in the `meta-info` section of the extensions for those vulnerabilities that were detected with the help of the FAST extensions.

8.  You can click a vulnerability to view detailed information about it, including its description (from the `meta-info` section of the extension file) and an example of the request that exploits it.

    Example of the information about a vulnerability (detected with the modifying extension):
    
    ![Vulnerability detailed information][img-vuln-details-mod]
