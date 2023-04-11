!!! warning "The error "signatures couldn't be verified""
    If added GPG keys expired, the following error would be returned:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release:The following
    signatures couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
    E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' is not signed.
    N: Updating from such a repository can't be done securely, and is therefore disabled by default.
    N: See apt-secure(8) manpage for repository creation and user configuration details.
    ```

    To fix the problem, please import new GPG keys for the Wallarm packages and then upgrade the packages using the following commands:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```