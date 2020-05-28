!!! warning "Issue with CentOS GPG keys"
    If you have already added the Wallarm repository and got an error related to invalid CentOS GPG keys, then please follow these steps:

    1. Remove added repository using the `yum remove wallarm-node-repo` command.
    2. Add the repository using the command from the appropriate tab above.

    Possible error messages:

    * `http://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml signature could not be verified for wallarm-node_2.14`
    * `One of the configured repositories failed (Wallarm Node for CentOS 7 - 2.14), and yum doesn't have enough cached data to continue.`