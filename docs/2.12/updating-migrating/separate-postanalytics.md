[docs-module-update]:   nginx-modules.md

#   Updating the Separately Installed Postanalytics Module  

If the postanalytics module is installed on the separate server, then you need to update it prior to updating the [Wallarm WAF module][docs-module-update].

To update the postanalytics module, do the following:
1.  Execute the commands below in order to perform the update. The choice of the commands depends on the operation system in use:

--8<-- "../include/update-postanalytics-2.12.md"
    
2.  Restart the `wallarm-tarantool` service by executing one of the commands below. The choice of the command depends on the operation system in use:

--8<-- "../include/update-postanalytics-restart-service-2.12.md"
