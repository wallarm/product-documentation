#   Step 2: Creating and Configuring an Application in Okta

[img-dashboard]:            ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:   ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:         ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:  ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:  #1-general-settings
[anchor-configure-saml]:    #2-configure-saml
[anchor-feedback]:          #3-feedback
[anchor-fetch-metadata]:    #downloading-metadata  

!!! info "Prerequisites"
    The following values are used as demonstration values in this guide:
    
    *   `WallarmApp` as a value for the **App name** parameter (in Okta).
    *   `https://sso.online.wallarm.com/acs` as a value for the **Single sign‑on URL** parameter (in Okta).
    *   `https://sso.online.wallarm.com/entity-id` as a value for the **Audience URI** parameter (in Okta).

!!! warning
    Ensure that you replace the sample values for the **Single sign‑on URL** and **Audience URI** parameters with the real ones obtained in the [previous step][doc-setup-sp].

Log in to the Okta service (the account must have administrator rights) and click on the *Administrator* button in the upper right.

In the *Dashboard* section, click the *Add Applications* button on the right.

![!Okta dashboard][img-dashboard]

In the new application section, click the *Create New App* button on the right.

In the pop-up window, set the following options:
1.  **Platform** → “Web”.
2.  **Sign‑on method** → “SAML 2.0”.

Click the *Create* button.

After that you will be taken to the SAML integration wizard (*Create SAML Integration*). To create and configure SAML integration you will be prompted to complete three stages:
1.  [General Settings.][anchor-general-settings]
2.  [Configure SAML.][anchor-configure-saml]
3.  [Feedback.][anchor-feedback]

After that, the metadata [needs to be downloaded][anchor-fetch-metadata] for the newly created integration.


##  1.  General Settings

Enter the name of the application you are creating in the **App Name** field.

Optionally, you can download the logo of the application (**App logo**) and configure application visibility for your users on the Okta homepage and in the Okta mobile application.

Click the *Next* button.

![!General settings][img-general]


##  2.  Configure SAML

At this stage you will need the parameters generated [earlier][doc-setup-sp] on the Wallarm side:

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Okta parameters"
    This manual describes only the mandatory parameters to be filled in when configuring SSO with Okta.
    
    To learn more about the rest of the parameters (including those related to the digital signature and SAML message encryption settings), please refer to the [Okta documentation][link-okta-docs].

Fill in the following basic parameters:
*   **Single sign‑on URL**—enter the **Assertion Consumer Service URL (ACS URL)** value previously obtained on the Wallarm side.
*   **Audience URI (SP Entity ID)**—enter the value of the **Wallarm Entity ID** received earlier on the Wallarm side.

The remaining parameters for the initial setup can be left as default.

![!Configure SAML][img-saml]

Click *Next* to continue the setup. If you want to return to the previous step, click *Previous*.

![!SAML settings preview][img-saml-preview]


##  3.  Feedback

At this stage, you are asked to provide Okta with additional information about the type of your application, whether you are an Okta customer or partner, and other data. It is enough to choose  “I'm an Okta customer adding an internal app” for the parameter **Are you a customer or partner**?

If required, fill in other available parameters.

After that, you can finish the SAML integration wizard by clicking the *Finish* button. To go to the previous step, click the *Previous* button.

![!Feedback form][img-feedback]

After this stage, you will be taken to the settings page of the created application.

Now you need to [download the metadata][anchor-fetch-metadata] for the created integration to [continue configuring the SSO provider][doc-metadata-transfer] on the Wallarm side.

The metadata is a set of parameters describing the identity provider's properties (such as those generated for the service provider in [Step 1][doc-setup-sp]) required to configure SSO.


##  Downloading Metadata

You can download the metadata either as an XML file or “as is” in text form (you will need to enter the metadata manually when configuring it further).

To download as an XML file:
1.  Click the *Identity Provider metadata* link on the settings page of the created application:

    ![!Metadata download link][img-fetch-metadata-xml]
    
    As a result, you will be taken to a new tab on your browser with similar content:
    
    ![!Example of XML-formatted metadata][img-xml-metadata]
    
2.  Save the content to an XML file (with your browser or other suitable method).

To download the metadata “as is”:
1.  On the settings page of the created application, click the *View Setup instructions* button.

    ![!The “View Setup instructions” button][img-fetch-metadata-manually]
    
2.  Copy all the given data.


Now you can [continue configuring the SSO][doc-metadata-transfer] on the Wallarm side.
