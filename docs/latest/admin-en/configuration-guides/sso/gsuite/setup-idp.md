#   Step 2: Creating and Configuring an Application in G Suite

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! info "Prerequisites"
    The following values are used as demonstration values in this guide:

    * `WallarmApp` as a value for the **Application Name** parameter (in G Suite).
    * `https://sso.online.wallarm.com/acs` as a value for the **ACS URL** parameter (in G Suite).
    * `https://sso.online.wallarm.com/entity-id` as a value for the **Entity ID** parameter (in G Suite).

!!! warning
    Ensure that you replace the sample values for the **ACS URL** and **Entity ID** parameters with the real ones obtained in the [previous step][doc-setup-sp].

Log in to the Google [admin console][link-gsuite-adm-console]. Click on the *Apps* block.

![G Suite admin console][img-gsuite-console]

Click on the *SAML apps* block. Add a new application by clicking the *Add a service/App to your domain* link or the “+” button at the bottom right.

Click on the *Setup my own custom app* button.

![Adding a new application to G Suite][img-gsuite-add-app]

You will be provided with information (metadata) by G Suite as your identity provider:
*   **SSO URL**
*   **Entity ID**
*   **Certificate** (X.509)

Metadata is a set of parameters describing the identity provider's properties (similar to those generated for the service provider in [Step 1][doc-setup-sp]) that are required to configure SSO.

You can transfer them to the SSO Wallarm setup wizard in two ways:
*   Copy each parameter and download the certificate, and then paste (upload) it into the corresponding fields of the Wallarm setup wizard.
*   Download an XML file with metadata and upload it on the Wallarm side.

Save the metadata in any way you like and go to the next step of configuring the application by clicking *Next*. Entering the identity provider metadata on the Wallarm side will be described in [Step 3][doc-metadata-transfer].

![Saving metadata][img-fetch-metadata]

The next stage of configuring the application is to provide the service provider's (Wallarm) metadata. Required fields:
*   **ACS URL** corresponds to the **Assertion Consumer Service URL** parameter generated on the Wallarm side.
*   **Entity ID** corresponds to the **Wallarm Entity ID** parameter generated on the Wallarm side.

Fill in the remaining parameters if required. Click *Next*.

![Filling in service provider information][img-fill-in-sp-data]

At the final stage of configuring the application, you will be prompted to provide mappings between service provider's attributes to the available user profile fields. Wallarm (as a service provider) requires you to create an attribute mapping.

Click *Add new mapping* and then map the `email` attribute to the “Primary Email” user profile field (in the “Basic Information” group).

![Creating an attribute mapping][img-create-attr-mapping]

Click *Finish*.

After that, you will be informed in the pop-up window that the provided information is saved and, in order to complete the SAML SSO configuration, you will need to upload the data about the identity provider (Google) in the admin panel of the service provider (Wallarm). Click *Ok*.

After that, you will be redirected to the page of the created application.
Once the application is created, it is disabled for all your organizations in G Suite. To activate the SSO for this application, click the *Edit Service* button. 

![Application page in G Suite][img-app-page]

Select *ON for everyone* for the **Service status** parameter and click *Save*.


Now you can [continue configuring the SSO][doc-metadata-transfer] on the Wallarm side.