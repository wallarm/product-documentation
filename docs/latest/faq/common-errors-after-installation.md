# Errors after Wallarm node installation

If some errors occur after Wallarm node installation, check this troubleshooting guide to address them. If you did not find relevant details here, please contact [Wallarm technical support](mailto:support@wallarm.com).

## File Download Scenarios Fail

If your file download scenarios fail after installing a filter node, the issue is in the request size exceeding the limit set in the `client_max_body_size` directive in the Wallarm configuration file.

Change the value in `client_max_body_size` in the directive `location` for the address that accepts the file uploads. Changing only the `location` value protects the main page from getting large requests.

Change the value in `client_max_body_size`:

1. Open for editing the configuration file in the `/etc/nginx-wallarm` directory.
2. Put in the new value:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` is the address that accepts the file uploads.

Detailed directive description is available in the [official NGINX documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## How to fix the errors "signature could not be verified for wallarm-node", "yum doesn't have enough cached data to continue", "signatures couldn't be verified"?

If GPG keys for Wallarm RPM or DEB packages are expired, you may get the following error messages:

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] repomd.xml signature could not be verified for wallarm-node_3.6

One of the configured repositories failed (Wallarm Node for CentOS 7 - 3.6),
and yum doesn't have enough cached data to continue.

W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: The following signatures
couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

To fix the problem on **Debian or Ubuntu**, please follow the steps:

1. Import new GPG keys for the Wallarm packages:

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. Update the Wallarm packages:

	```bash
	sudo apt update
	```

To fix the problem on **CentOS**, please follow the steps:

1. Remove the previously added repository:

	```bash
	sudo yum remove wallarm-node-repo
	```
2. Clear the cash:

	```bash
	sudo yum clean all
	```
3. Add a new repository using the command for appropriate CentOS and Wallarm node versions:

	=== "CentOS 7.x or Amazon Linux 2.0.2021x and lower"
		```bash

		# Filtering node and postanalytics module of the 4.4 version
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# Filtering node and postanalytics module of the 4.6 version
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm

		# Filtering node and postanalytics module of the 4.8 version
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
		```
	=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
		```bash

		# Filtering node and postanalytics module of the 4.4 version
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# Filtering node and postanalytics module of the 4.6 version
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm

		# Filtering node and postanalytics module of the 4.8 version
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
		```		
4. If required, confirm the action.

## Why does not the filtering node block attacks when operating in blocking mode (`wallarm_mode block`)?

Using the `wallarm_mode` directive is only one of several methods of traffic filtration mode configuration. Some of these configuration methods have a higher priority than the `wallarm_mode` directive value.

If you have configured blocking mode via `wallarm_mode block` but Wallarm filtering node does not block attacks, please ensure that filtration mode is not overridden using other configuration methods:

* Using the [rule **Set filtration mode**](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
* In the [**General** section of Wallarm Console](../admin-en/configure-wallarm-mode.md#setting-up-general-filtration-rule-in-wallarm-console)

[More details on filtration mode configuration methods →](../admin-en/configure-parameters-en.md)
