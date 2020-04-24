# Creating a Tenant

## Prerequisites

Ensure the following:

* You have a vendor account with Wallarm.
* You have your user UUID and secret key.
* You have your vendor UUID.

To create a tenant, you must:

1. Create a tenant through Wallarm API.
2. Tie the created tenant to you vendor account.

## 1. Create a Tenant

1. Issue the following cURL-request:

    !!! info
        Run the command appropriate to the cloud you are using.
        
        * If you are using <https://my.wallarm.com/>, run the command from the «EU Cloud» tab below.
        * If you are using <https://us1.my.wallarm.com>, run the command from the «US Cloud» tab below.
    
    === "EU Cloud"
        ```bash
        curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" --header "X-WallarmAPI-UUID: YOUR-USER-UUID" --header "X-WallarmAPI-Secret: YOUR-SECRET-KEY" -d "{
        \"name\": \"TENANT-NAME\",
        \"vuln_prefix\": \"VULNERABILITY-PREFIX\",
        \"language\": \"en\",
        \"enabled\": true,
        \"notifications\": {},
        \"mode\": \"monitoring\",
        \"blocking_type\": \"incidents\",
        \"qrator_blacklists\": false,
        \"scanner_mode\": \"off\",
        \"partner_uuid\": \"YOUR-VENDOR-UUID\",
        \"qrator_mode\": \"async\",
        \"scanner_state\": {}
        }" "https://api.wallarm.com/v1/objects/client/create"
        ```
    === "US Cloud"
        ```bash
        curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" --header "X-WallarmAPI-UUID: YOUR-USER-UUID" --header "X-WallarmAPI-Secret: YOUR-SECRET-KEY" -d "{
        \"name\": \"TENANT-NAME\",
        \"vuln_prefix\": \"VULNERABILITY-PREFIX\",
        \"language\": \"en\",
        \"enabled\": true,
        \"notifications\": {},
        \"mode\": \"monitoring\",
        \"blocking_type\": \"incidents\",
        \"qrator_blacklists\": false,
        \"scanner_mode\": \"off\",
        \"partner_uuid\": \"YOUR-VENDOR-UUID\",
        \"qrator_mode\": \"async\",
        \"scanner_state\": {}
        }" "https://us1.api.wallarm.com/v1/objects/client/create"
        ```
        
    where:
    
    * `X-WallarmAPI-UUID:` is your user UUID.
    * `X-WallarmAPI-Secret:` is your secret key.
    * `"name":` is the name of the tenant.
    * `"vuln_prefix":` is the vulnerability prefix that Wallarm will use for vulnerability tracking and association. This field must contain four letters and/or numbers. Base the prefix on the tenant name for easier identification. For example, if the tenant name is  "Tenant", name the prefix "TNNT".
    * `"language":` is language if your Wallarm web-interface. Set this to `en`.
    * `"partner_uuid":` is your vendor UUID.
    
    See also `POST /v1/objects/client/create` in the [Wallarm API](https://apiconsole.eu1.wallarm.com/).

2. Check the output:

    * 200 – The operation is successful.
    * 403 – The authorization operation failed. Ensure you have provided the correct user UUID, secret key, and vendor UUID.
    * 400 – The operation failed. The most likely cause is that one of the parameters is missing, or your JSON syntax is incorrect. Ensure that all parameters are set correctly.

3. Copy the following values from the output:

    * `"id":`
    * `"partnerid":`

  You will need these values to tie the tenant to your vendor account.

You have now created your tenant.

## 2. Tie the Tenant to Your Vendor Account

1. Issue the following cURL-request:
    
    !!! info
        Run the command appropriate to the cloud you are using.
        
        * If you are using <https://my.wallarm.com/>, run the command from the «EU Cloud» tab below.
        * If you are using <https://us1.my.wallarm.com>, run the command from the «US Cloud» tab below.
    
    === "EU Cloud"
        ```bash
        curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" --header "X-WallarmAPI-UUID: YOUR-USER-UUID" --header "X-WallarmAPI-Secret: YOUR-SECRET-KEY" -d "{
        \"clientid\": CLIENT-ID,
        \"id\": NUMBER,
        \"params\": {}
        }" "https://api.wallarm.com/v2/partner/{PARTNER-ID}/partner_client"
        ```
    === "US Cloud"
        ```bash
        curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" --header "X-WallarmAPI-UUID: YOUR-USER-UUID" --header "X-WallarmAPI-Secret: YOUR-SECRET-KEY" -d "{
        \"clientid\": CLIENT-ID,
        \"id\": NUMBER,
        \"params\": {}
        }" "https://us1.api.wallarm.com/v2/partner/{PARTNER-ID}/partner_client"
        ```
        
    where:
    
    * `X-WallarmAPI-UUID:` is your user UUID.
    * `X-WallarmAPI-Secret:` is your secret key.
    * `"clientid":` is the `"id":` value that you copied at the end of tenant creation in Step 2.
    * `"id":` is any number that you will use to identify and configure your tenant. Set any number make sure you and copy it for later use.
    * `{PARTNER-ID}` is the partner ID value that you copied from `"partnerid":` in Step 3.
    
    See also `POST/v2/partner/{partnerid}/partner_client` in the [Wallarm API](https://apiconsole.eu1.wallarm.com/).

2. Check the `Response Code` field:

    * 200 – The operation is successful.
    * 403 – The autorization operation failed. Ensure you have provided the correct user UUID, secret key, and vendor UUID.
    * 400 – The operation failed. The most likely cause is that one of the parameters is missing or your JSON syntax is incorrect. Ensure you have all the parameters set correctly.

You have now tied the tenant to your vendor account.