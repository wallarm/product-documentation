[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


#   How to Install Wallarm Packages from the Local JFrog Artifactory Repository for CentOS

To install Wallarm packages from the [JFrog Artifactory repository][doc-repo-mirroring] on a host dedicated to an NGINX filter node, perform the following actions on this host:
1.  Navigate to the JFrog Artifactory web UI via either the domain name or IP address (e.g., `http://jfrog.example.local:8081/artifactory`).

    Log in to the web UI with a user account.
    
2.  Click the *Artifacts* menu entry and select a repository containing the Wallarm packages.

3.  Click the *Set Me Up* link.

    ![Working with the repository][img-working-with-repo]
    
    A pop-up window will appear. Type your user account’s password in the *Type Password* field and press *Enter*. Now, the instructions in this window will contain your credentials.
    
    ![Typing in the credentials][img-repo-creds]

4.  Scroll down to the `yum` configuration example and click the `Copy Snippet to Clipboard` button to copy this example to the clipboard.

    ![An example of configuration][img-repo-code-snippet]
    
5.  Create a `yum` configuration file (e.g., `/etc/yum.repos.d/artifactory.repo`) and paste the copied snippet into it.

    !!! warning "Important!"
        Make sure to remove the `<PATH_TO_REPODATA_FOLDER>` fragment from the `baseurl` parameter so that the `baseurl` points to the root of the repository.
    
    An example of the `/etc/yum.repos.d/artifactory.repo` file for the `wallarm-centos-upload-local` sample repository:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #Optional - if you have GPG signing keys installed, use the below flags to verify the repository metadata signature:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  Install the `epel-release` package on the host:
    
    ```
    sudo yum install -y epel-release
    ```

Now you can follow any installation instructions for CentOS. You will need to skip the step where the repository is added because you have set up a local repository instead.
