[link-configure-params]:    ../../admin-en/configure-parameters-en.md

[img-configure-app]:        ../../images/user-guides/settings/configure-app.png

# Application Settings

!!! warning "Administrator access"
    Only users with the **Administrator** role can access this setting.

You can add applications on the *Settings* → *Applications* tab of the Wallarm interface.

If your company has several web applications, you may find it convenient not only to view the statistics of the entire company's traffic and vulnerabilities but also to view the statistics separately for each application.

You can set any arbitrary numeric value as an application ID.

## Adding an Application

1. Click *Add application*.
1. Set an application ID and an application name.
    
    ![!Application creation form][img-configure-app]
    
1. In the filter node configuration file, set the created ID in the `wallarm_instance` directive.

If the ID is unique, the *Dashboard* tab will let you select the new application.

## Managing Applications

The *Edit* and *Delete* buttons appear upon hovering the cursor over the application entry.
* *Edit*: change the name of the corresponding application. 
* *Delete*: remove the corresponding application entry.

!!! info "See also"
    [Wallarm configuration options][link-configure-params]
