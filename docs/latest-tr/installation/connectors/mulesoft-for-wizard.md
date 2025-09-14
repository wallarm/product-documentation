# Sihirbaz için MuleSoft Mule {#mulesoft-mule-for-wizard}

Wallarm Edge node, isteklerin hiçbirini engellemeden trafiği Mule APIs'e ulaşmadan önce incelemek için [eşzamanlı](../inline/overview.md) modda Mule Gateway'inize bağlanabilir.

Bağlantıyı yapılandırmak için aşağıdaki adımları izleyin.

**1. Wallarm politikasını MuleSoft Exchange'e yükleyin**

1. Platformunuz için sağlanan kod paketini indirin.
1. Politika arşivini çıkarın.
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** yolunu izleyin → kuruluşunuzu seçin → ID'sini kopyalayın.
1. İndirilen `pom.xml` dosyasının `groupId` parametresine kopyaladığınız grup ID'sini girin:

    ```xml hl_lines="2"
    <?xml version="1.0" encoding="UTF-8"?>
        <groupId>BUSINESS_GROUP_ID</groupId>
        <artifactId>wallarm</artifactId>
    ```
1. Çıkardığınız arşivde `conf` dizinini ve içinde aşağıdaki içeriğe sahip bir `settings.xml` dosyasını oluşturun:

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

    `username` ve `password` değerlerini kendi kimlik bilgilerinizle değiştirin.
1. Politikayı MuleSoft'a dağıtın:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Özel politikanız artık MuleSoft Anypoint Platform Exchange'de kullanılabilir.

**2. Wallarm politikasını API'nize ekleyin**

Wallarm politikasını tek bir API'ye veya tüm API'lere ekleyebilirsiniz.

1. Politikayı tek bir API'ye uygulamak için Anypoint Platform → **API Manager** → istediğiniz API'yi seçin → **Policies** → **Add policy**.
1. Politikayı tüm API'lere uygulamak için Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**.
1. Exchange'den Wallarm politikasını seçin.
1. `https://` dahil olmak üzere Wallarm node URL'sini belirtin.
1. Gerekirse diğer parametreleri değiştirin.
1. Politikayı uygulayın.

[Daha fazla bilgi](mulesoft.md)

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
</style>