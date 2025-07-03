1. Extract the policy archive.
1. Within the `pom.xml` file, specify the following:

    === "Global instance"
        1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
        1. Specify the copied group ID in the `groupId` parameter of the `pom.xml` file:

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "Regional instance"
        1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its ID.
        1. Specify the copied group ID in the `groupId` parameter of the `pom.xml` file.
        1. For MuleSoft instances hosted in specific regions, update the `pom.xml` file to use the corresponding regional URLs. For example, for a European instance of MuleSoft:

        ```xml hl_lines="2 7 14 24"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
            
            <properties>
                <mule.maven.plugin.version>4.1.2</mule.maven.plugin.version>
                <exchange.url>https://maven.eu1.anypoint.mulesoft.com/api/v1/organizations/${project.groupId}/maven</exchange.url>
            </properties>

            <distributionManagement>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/organizations/${project.groupId}/maven
                    </url>
                    <layout>default</layout>
                </repository>
            </distributionManagement>

            <repositories>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/maven</url>
                    <layout>default</layout>
                </repository>
            </repositories>
        ```
1. Create the `conf` directory and a `settings.xml` file inside it with the following content:

    === "Username and password"
        Replace `username` and `password` with your actual credentials:

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
    === "Token (if MFA is enabled)"
        [Generate and specify your token](https://docs.mulesoft.com/access-management/saml-bearer-token) in the `password` parameter:

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
            <server>
                <id>anypoint-exchange-v3</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
            <server>
                <id>mulesoft-releases-ee</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
        </servers>
        </settings>
        ```
1. Deploy the policy to MuleSoft using the following command:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Your custom policy is now available in your MuleSoft Anypoint Platform Exchange.

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)
