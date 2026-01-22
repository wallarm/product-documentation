# MuleSoft Mule for wizard

The Wallarm Edge node can be connected to your Mule Gateway in [synchronous](../inline/overview.md) mode to inspect traffic before it reaches Mule APIs - without blocking any requests.

Follow the steps below to set up the connection.

**1. Upload the Wallarm policy to MuleSoft Exchange**

1. Download the provided code bundle for your platform.
1. Extract the policy archive.
1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
1. Specify the copied group ID in the `groupId` parameter of the downloaded `pom.xml` file:

    ```xml hl_lines="2"
    <?xml version="1.0" encoding="UTF-8"?>
        <groupId>BUSINESS_GROUP_ID</groupId>
        <artifactId>wallarm</artifactId>
    ```
1. In the extracted archive, create the `conf` directory and a `settings.xml` file inside it with the following content:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <servers>
        <server>
            <id>anypoint-exchange-v3</id>
            <username>myusername</username>
            <password>mypassword</password>
        </server>
        <server>
            <id>mulesoft-releases-ee</id>
            <username>myusername</username>
            <password>mypassword</password>
        </server>
    </servers>
    </settings>
    ```

    Replace `username` and `password` with your credentials.
1. Deploy the policy to MuleSoft:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Your custom policy is now available in your MuleSoft Anypoint Platform Exchange.

**2. Attach the Wallarm policy to your API**

You can attach the Wallarm policy to either an individual API or all APIs.

1. To apply the policy to an individual API, navigate to Anypoint Platform → **API Manager** → select the desired API → **Policies** → **Add policy**.
1. To apply the policy to all APIs, go to Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**.
1. Choose the Wallarm policy from Exchange.
1. Specify the Wallarm node URL including `https://`.
1. If necessary, modify other parameters.
1. Apply the policy.

[More details](mulesoft.md)

<style>
  h1#mulesoft-mule-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }

  .md-tabs {
    display: none;
  }

  [id^="inkeep-widget-"] {
    display: none
  }
</style>