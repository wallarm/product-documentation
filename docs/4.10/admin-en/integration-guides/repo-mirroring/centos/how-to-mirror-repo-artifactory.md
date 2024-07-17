[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-creating-a-local-copy-of-the-wallarm-repository
[anchor-setup-repo-artifactory]:        #2-creating-a-local-rpm-repository-in-jfrog-artifactory
[anchor-import-repo]:                   #3-importing-the-local-copy-of-the-wallarm-repository-into-jfrog-artifactory


#   How to Mirror the Wallarm Repository for CentOS

You can create and use a local copy (also known as a *mirror*) of the Wallarm repository to be sure that all filter nodes in your infrastructure are deployed from a single source and have the same version number.

This document will guide you through the process of mirroring the Wallarm repository for a CentOS 7 server via the JFrog Artifactory repository manager.


!!! info "Prerequisites"
    Make sure that the following conditions are met prior to taking any further steps:
    
    *   You have these components installed on your server:
    
        *   CentOS 7 operating system
        *   `yum-utils` and `epel-release` packages
        *   JFrog Artifactory software capable of creating RPM repositories ([installation instructions][link-jfrog-installation])
            
            Learn more about JFrog Artifactory editions and features [here][link-jfrog-comparison-matrix].
        
    *   JFrog Artifactory is up and running.
    *   The server has internet access.


Wallarm repository mirroring comprises
1.  [Creating a local copy of the Wallarm repository][anchor-fetch-repo]
2.  [Creating a local RPM repository in JFrog Artifactory][anchor-setup-repo-artifactory]
3.  [Importing the local copy of the Wallarm repository into JFrog Artifactory][anchor-import-repo]

##  1.  Creating a Local Copy of the Wallarm Repository

To create a local copy of the Wallarm repository, do the following:
1.  Add the Wallarm repository by executing the following command:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  Navigate to a temporary directory (e.g., `/tmp`) and synchronize the Wallarm repository to this directory by executing the following command:

    ```bash
    reposync -r wallarm-node -p .
    ```

If the `reposync` command finishes successfully, then the Wallarm packages will be placed in the `wallarm-node/Packages` subdirectory of your temporary directory (e.g., `/tmp/wallarm-node/Packages`). 


##  2.  Creating a Local RPM Repository in JFrog Artifactory

To create a local RPM repository in JFrog Artifactory, do the following:
1.  Navigate to the JFrog Artifactory web UI via either the domain name or IP address (e.g., `http://jfrog.example.local:8081/artifactory`).

    Log in to the web UI with the administrator account.

2.  Click the *Admin* menu entry, then the *Local* link in the *Repositories* section.

3.  Click the *New* button to create a new local repository.

    ![Creating a new local repository][img-new-local-repo]

4.  Select the “RPM” package type.

5.  Fill the repository name in the *Repository Key* field. This name should be unique in JFrog Artifactory. We recommend choosing a name that complies with the [Artifactory repositories naming best practices][link-artifactory-naming-agreement] (e.g., `wallarm-centos-upload-local`).

    Select the “maven-2-default” layout from the *Repository* Layout drop-down list.
    
    You can leave other settings unchanged.

    Click the *Save & Finish* button to create the local Artifactory repository.
    
    ![Repository settings][img-artifactory-repo-settings]

    Now, the newly created repository should be displayed in the local repository list.

To finish mirroring the Wallarm repository, [import synchronized packages][anchor-fetch-repo] into the local Artifactory repository.


##  3.  Importing the Local Copy of the Wallarm Repository into JFrog Artifactory

To import the Wallarm packages into the Artifactory local RPM repository, do the following:
1.  Log in to the JFrog Artifactory web UI with the administrator account.

2.  Click the *Admin* menu entry, then the *Repositories* link in the *Import & Export* section.

3.  In the *Import Repository from Path* section, select the local repository you [created earlier][anchor-setup-repo-artifactory] from the *Repository from Path* drop-down list.

4.  Click the *Browse* button and select the directory with the Wallarm packages you [created earlier][anchor-fetch-repo].

5.  Click the *Import* button to import the Wallarm packages from the directory.

    ![Importing packages][img-import-into-artifactory]
    
6.  Click the *Artifacts* menu entry, and make sure that the imported Wallarm packages are present in the desired local repository.

    ![Packages in the repository][img-local-repo-ok]
    


Now you can [deploy Wallarm filter nodes][doc-installation-from-artifactory] using the local mirror of the Wallarm repository.
    