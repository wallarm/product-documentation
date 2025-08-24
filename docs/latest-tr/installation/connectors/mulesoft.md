```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for MuleSoft

[MuleSoft](https://www.mulesoft.com/) entegrasyon platformu, API ağ geçidi aracılığıyla istemci uygulamaların API'lara erişim sağlaması için giriş noktası sunarak, hizmetler arasında sorunsuz bağlantı ve veri entegrasyonu sağlamaktadır. Wallarm, MuleSoft üzerinde çalışan API'ları güvence altına almak amacıyla bir konnektör olarak görev yapabilir.

Wallarm'ı MuleSoft için bir konnektör olarak kullanmak için, **Wallarm düğümünü dışarıda dağıtmanız** ve **MuleSoft üzerinde Wallarm tarafından sağlanan politikayı uygulamanız** gerekmektedir; bu, trafiğin analiz için Wallarm düğümüne yönlendirilmesini sağlar.

Wallarm connector for MuleSoft yalnızca [in-line](../inline/overview.md) trafik analizini desteklemektedir:

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-mule-gateway-inline.png)

## Kullanım Durumları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm, yalnızca tek bir politika ile MuleSoft Anypoint platformunda dağıtılan API'ların güvence altına alınması için önerilen seçenektir.

## Sınırlamalar

* Wallarm kuralı tarafından uygulanan [Rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Gereksinimler

Dağıtıma devam edebilmek için, aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* MuleSoft platformunun anlaşılması.
* Host sisteminizde yüklü ve çalışan [Docker](https://docs.docker.com/engine/install/).
* [Maven (`mvn`)](https://maven.apache.org/install.html).
* Kuruluşunuzun MuleSoft Anypoint Platform hesabına artifact yüklemenizi sağlayan MuleSoft Exchange katkı sağlayıcı rolünün atanmış olması.
* [MuleSoft Exchange kimlik bilgilerinizin (kullanıcı adı ve şifre)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) `<MAVEN_DIRECTORY>/conf/settings.xml` dosyasında belirtilmiş olması.
* Uygulamanızın ve API'nizin MuleSoft üzerinde bağlantılı ve çalışır durumda olması.
* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişiminizin bulunması.

## Dağıtım

### 1. Bir Wallarm düğümü dağıtın

Wallarm düğümü, gelen trafiği inceleyen, kötü amaçlı etkinlikleri tespit eden ve tehditleri azaltmak için yapılandırılabilen Wallarm platformunun temel bileşenidir. 

Bunu, gereksinim duyduğunuz kontrol düzeyine bağlı olarak, ya Wallarm tarafından barındırılan ya da kendi altyapınızda dağıtabilirsiniz.

=== "Edge node"
    Konnektör için Wallarm tarafından barındırılan bir düğüm dağıtmak amacıyla, [talimatları](../se-connector.md) izleyin.
=== "Self-hosted node"
    Kendi kendine barındırılan bir düğüm dağıtımı için bir artifact seçin ve ekli talimatları izleyin:

    * Bare metal veya VM'ler üzerinde Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
    * Konteynerleştirilmiş dağıtımları kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm politikasını MuleSoft Exchange'e elde edin ve yükleyin

Wallarm politikasını MuleSoft Exchange'e elde etmek ve yüklemek için aşağıdaki adımları izleyin:

1. Wallarm Console → **Security Edge** → **Connectors** bölümüne gidin → **Download code bundle** seçeneğine tıklayın ve platformunuza uygun bir code bundle indirin.

    Eğer kendi kendine barındırılan bir düğüm kullanıyorsanız, code bundle almak için sales@wallarm.com ile iletişime geçin.
1. Politika arşivini çıkarın.
1. `pom.xml` dosyası içinde aşağıdakileri belirtin:

    === "Global instance"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** bölümüne gidin → kuruluşunuzu seçin → ID'sini kopyalayın.
        1. Kopyalanan grup ID'sini `pom.xml` dosyasındaki `groupId` parametresine belirtin:

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "Regional instance"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** bölümüne gidin → kuruluşunuzu seçin → ID'sini kopyalayın.
        1. Kopyalanan grup ID'sini `pom.xml` dosyasındaki `groupId` parametresine belirtin.
        1. Belirli bölgelerde barındırılan MuleSoft instance'ları için, `pom.xml` dosyasını ilgili bölgesel URL'leri kullanacak şekilde güncelleyin. Örneğin, MuleSoft'un Avrupa instance'ı için:

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
1. `conf` klasörünü oluşturun ve içerisine aşağıdaki içeriğe sahip bir `settings.xml` dosyası oluşturun:

    === "Username and password"
        `username` ve `password` bilgilerini gerçek kimlik bilgilerinizle değiştirdiğinizden emin olun:

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
        </servers>
        </settings>
        ```
    === "Token (if MFA is enabled)"
        [Token'ınızı oluşturun ve belirtin](https://docs.mulesoft.com/access-management/saml-bearer-token) ve bunu `password` parametresine ekleyin:

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
        </servers>
        </settings>
        ```
1. Aşağıdaki komutu kullanarak politikayı MuleSoft'a dağıtın:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Artık özel politikanız MuleSoft Anypoint Platform Exchange'te kullanılabilir durumda.

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Wallarm politikasını API'nize ekleyin

Wallarm politikasını tüm API'lara veya bireysel bir API'ya ekleyebilirsiniz.

#### Politikayı bireysel bir API'ya eklemek

Wallarm politikasını bireysel bir API ile güvence altına almak için aşağıdaki adımları izleyin:

1. Anypoint Platform'da **API Manager** bölümüne gidin ve ilgili API'yı seçin.
1. **Policies** → **Add policy** bölümüne gidin ve Wallarm politikasını seçin.
1. [Wallarm düğüm örneği](#1-deploy-a-wallarm-node) adresini, `http://` veya `https://` öneki ile birlikte belirtin.
1. Gerekirse, diğer parametreleri de güncelleyin.
1. Politikayı uygulayın.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

#### Politikayı tüm API'lara eklemek

MuleSoft'un [Automated policy seçeneğini](https://docs.mulesoft.com/mule-gateway/policies-automated-overview) kullanarak Wallarm politikasını tüm API'lara uygulamak için aşağıdaki adımları izleyin:

1. Anypoint Platform'da **API Manager** → **Automated Policies** bölümüne gidin.
1. **Add automated policy** butonuna tıklayın ve Wallarm politikasını Exchange üzerinden seçin.
1. [Wallarm düğüm örneği](#1-deploy-a-wallarm-node) adresini, `http://` veya `https://` önekini ekleyerek belirtin.
1. Gerekirse, diğer parametreleri de güncelleyin.
1. Politikayı uygulayın.

## Test Etme

Dağıtımı gerçekleştirilen politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nıza, test [Path Traversal][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümüne ( [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) ) gidin ve saldırının listede görüntülendiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm düğüm modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmışsa ve trafik in-line olarak akıyorsa, istek aynı zamanda engellenecektir.

## Sorun Giderme

Çözüm beklenen şekilde çalışmıyorsa, MuleSoft Anypoint Platform → **Runtime Manager** → uygulamanıza → **Logs** bölümünden API loglarını kontrol edebilirsiniz.

Ayrıca, API Manager'da API'nıza giderek ve **Policies** sekmesinde uygulanan politikaları kontrol ederek politikanın uygulanıp uygulanmadığını doğrulayabilirsiniz. Otomatik politikalar için, **See covered APIs** seçeneğini kullanarak kapsanan API'ları ve hariç tutulma nedenlerini görebilirsiniz.

## Politikanın Yükseltilmesi

Dağıtılmış Wallarm politikasını [yeni bir sürüme](code-bundle-inventory.md#mulesoft) yükseltmek için:

1. Güncellenmiş Wallarm politikasını indirin ve [Adım 2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange) bölümünde tarif edildiği şekilde MuleSoft Exchange'e yükleyin.
1. Yeni sürüm Exchange'te göründüğünde, **API Manager** → ilgili API → **Policies** → Wallarm policy → **Edit configuration** → **Advanced options** bölümüne gidin ve açılır listeden yeni politika sürümünü seçin.
1. Eğer yeni sürüm ek parametreler getiriyorsa, gerekli değerleri girin.

    Örneğin, 2.x'ten 3.x'e yükseltiliyorsa:

    * **CLIENT HOST EXPRESSION**: özel bir değişiklik gerekmedikçe varsayılan değer olan `#[attributes.headers['x-forwarded-host']]` kullanılmalıdır.
    * **CLIENT IP EXPRESSION**: özel bir değişiklik gerekmedikçe varsayılan değer olan `#[attributes.headers['x-forwarded-for']]` kullanılmalıdır.
1. Değişiklikleri kaydedin.

Eğer Wallarm politikası otomatik olarak uygulanıyorsa, doğrudan yükseltme mümkün olmayabilir. Bu durumda, mevcut politikayı kaldırıp yeni sürümü manuel olarak uygulamanız gerekir.

Politika yükseltmeleri, özellikle büyük sürüm güncellemeleri için Wallarm düğüm yükseltmesi gerektirebilir. Yayın güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) bölümünü inceleyin. Gelecekteki yükseltmeleri basitleştirmek ve uyumsuzlukları önlemek için düzenli düğüm güncellemeleri önerilir.

## Politikanın Kaldırılması

Wallarm politikasını kaldırmak için, otomatik politika listesinde veya bireysel API'ya uygulanan politikalar listesindeki **Remove policy** seçeneğini kullanın.
```