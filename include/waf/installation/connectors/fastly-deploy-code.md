1. Go to **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token**:

    * Type: Automation token
    * Scope: Global API access
    * Leave other settings at their default unless specific changes are required

    ![](../../images/waf-installation/gateways/fastly/generate-token.png)
1. Go to **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project** and create an instance for Wallarm.

    Once created, copy the generated `--service-id`:

    ![](../../images/waf-installation/gateways/fastly/create-compute-service.png)
1. Go to the local directory containing the Wallarm package and deploy it:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    The success message:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```
