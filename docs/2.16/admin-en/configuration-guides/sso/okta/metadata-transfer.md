#   Step 3: Transferring Okta Metadata to the Wallarm Setup Wizard

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Return to the SSO Wallarm setup wizard and click *Next* to proceed to the next setup step.

At this step, you need to provide the metadata [generated][link-metadata] by the Okta service.

There are two ways to pass the identity provider metadata (in this case Okta) to the Wallarm setup wizard:
*   By uploading an XML file with metadata.

    Upload the XML file by clicking the *Upload* button and selecting the appropriate file. You can also do this by dragging the file from your file manager to the “XML” icon field.

*   By entering the metadata manually.

    Click the *Enter manually* link and copy the Okta service parameters to the fields of the setup wizard as follows:
    
    *   **Identity Provider Single Sign‑On URL** to the **Identity provider SSO URL** field.
    *   **Identity Provider Issuer** to the **Identity provider issuer** field.
    *   **X.509 Certificate** to the **X.509 Certificate** field.
    
    ![!Entering the metadata manually][img-transfer-metadata-manually]
    
Click *Next* to go to the next step. If you want to return to the previous step, click *Back*.


##  Completing SSO Wizard

On the final step of the Wallarm setup wizard, a test connection to the Okta service will be performed automatically and the SSO provider will be checked.

After successful completion of the test (if all the necessary parameters are filled in correctly), the setup wizard will inform you that the Okta service is connected as an identity provider, and you can start connecting the SSO mechanism to authenticate your users. 

Finish configuring SSO by clicking the *Finish* button or going to the user page to configure SSO by clicking the corresponding button.

![!Completing SSO wizard][img-sp-wizard-finish]

After completing the SSO configuration wizard, on the *Integration* tab you will see that the Okta service is connected as an identity provider and that no other SSO providers are available.

![!The “Integration” tab after finishing the SSO wizard][img-integration-tab]


Now, navigate to [the next step][doc-allow-access-to-wl] of the SSO configuration process.
