[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# MuleSoft Mule Gateway için Wallarm Connector

Bu kılavuz, [Mule Gateway](https://docs.mulesoft.com/mule-gateway/mule-gateway-capabilities-mule4) tarafından yönetilen Mule API'lerinizi Wallarm connector kullanarak nasıl güvenceye alacağınızı açıklar.

Mule Gateway için Wallarm'ı bir connector olarak kullanmak için, **Wallarm node'u harici olarak dağıtmanız** ve trafiği analiz için Wallarm node'una yönlendirmek üzere **MuleSoft içinde Wallarm tarafından sağlanan policy'yi uygulamanız** gerekir.

Mule Gateway için Wallarm connector yalnızca [in-line](../inline/overview.md) trafik analizini destekler:

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-mule-gateway-inline.png)

## Kullanım senaryoları

Bu çözüm, Mule Gateway tarafından yönetilen Mule API'lerini güvenceye almak için önerilen yaklaşımdır.

## Sınırlamalar

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* MuleSoft platformunu anlama.
* Anypoint Platform içinde Enterprise aboneliği (özel policy dağıtımı ve harici trafik yönlendirme için gereklidir).
* Ana sisteminizde [Docker](https://docs.docker.com/engine/install/) yüklü ve çalışır durumda.
* [Maven (`mvn`)](https://maven.apache.org/install.html).
* MuleSoft kullanıcınızın MuleSoft Anypoint Platform hesabınıza artifact yükleme yetkisi olması.
* [MuleSoft Exchange kimlik bilgileriniz (kullanıcı adı ve parola)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) `<MAVEN_DIRECTORY>/conf/settings.xml` dosyasında belirtilmiş olmalı.
* Uygulamanız ve API'niz bağlantılı olmalı ve Mule Gateway üzerinde çalışıyor olmalı.
* Wallarm Console içindeki [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim.

## Dağıtım

### 1. Bir Wallarm node'u dağıtın

Wallarm node, dağıtmanız gereken Wallarm platformunun çekirdek bir bileşenidir. Gelen trafiği inceler, kötü amaçlı etkinlikleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Gereksinim duyduğunuz kontrol seviyesine bağlı olarak, Wallarm tarafından barındırılan şekilde veya kendi altyapınızda dağıtabilirsiniz.

=== "Edge node"
    Connector için Wallarm tarafından barındırılan bir node dağıtmak üzere [talimatları](../security-edge/se-connector.md) izleyin.
=== "Self-hosted node"
    Self-hosted node dağıtımı için bir artifact seçin ve ekli talimatları izleyin:

    * Linux altyapıları (bare metal veya VM'ler) için [Tümü-bir-arada yükleyici](../native-node/all-in-one.md)
    * Container tabanlı dağıtımlar kullanan ortamlar için [Docker imajı](../native-node/docker-image.md)
    * AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Obtain and upload the Wallarm policy to MuleSoft Exchange

Wallarm policy'sini MuleSoft Exchange'e almak ve yüklemek için şu adımları izleyin:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyin ve platformunuz için bir code bundle indirin.

    Self-hosted node çalıştırıyorsanız, code bundle almak için sales@wallarm.com ile iletişime geçin.
1. Policy arşivini çıkarın.
1. `pom.xml` dosyası içinde aşağıdakileri belirtin:

    === "Küresel örnek"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → kurumunuzu seçin → kimliğini (ID) kopyalayın.
        1. Kopyalanan grup kimliğini `pom.xml` dosyasındaki `groupId` parametresine belirtin:

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "Bölgesel örnek"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → kurumunuzu seçin → kimliğini (ID) kopyalayın.
        1. Kopyalanan grup kimliğini `pom.xml` dosyasındaki `groupId` parametresine belirtin.
        1. Belirli bölgelerde barındırılan MuleSoft örnekleri için, `pom.xml` dosyasını ilgili bölgesel URL'leri kullanacak şekilde güncelleyin. Örneğin, Avrupa'daki bir MuleSoft örneği için:

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
1. `conf` dizinini oluşturun ve içinde aşağıdaki içerik ile bir `settings.xml` dosyası oluşturun:

    === "Kullanıcı adı ve parola"
        `username` ve `password` ifadelerini gerçek kimlik bilgilerinizle değiştirin:

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
    === "Token (MFA etkinse)"
        [`password` parametresinde token'ınızı oluşturun ve belirtin](https://docs.mulesoft.com/access-management/saml-bearer-token):

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
1. Aşağıdaki komutu kullanarak policy'yi MuleSoft'a dağıtın:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

Özel policy'niz artık MuleSoft Anypoint Platform Exchange içinde kullanılabilir.

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Policy'yi API'nize ekleyin

Wallarm policy'yi tek bir API'ye veya tüm API'lere ekleyebilirsiniz.

1. Policy'yi tek bir API'ye uygulamak için Anypoint Platform → **API Manager** → ilgili API'yi seçin → **Policies** → **Add policy** yolunu izleyin.
1. Policy'yi tüm API'lere uygulamak için Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy** yolunu izleyin.
1. Exchange içinden Wallarm policy'yi seçin.
1. `http://` veya `https://` dahil olmak üzere Wallarm node URL'sini belirtin.
1. Gerekirse diğer parametreleri değiştirin.
1. Policy'yi uygulayın.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

## Test

Dağıtılan policy'nin işlevselliğini test etmek için şu adımları izleyin:

1. API'nize test [Yol Geçişi][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki **Attacks** bölümünü açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzdeki saldırılar][attacks-in-ui-image]

    Wallarm node modu [engelleme](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmışsa ve trafik in-line akıyorsa, istek aynı zamanda engellenecektir.

## Sorun giderme

Çözüm beklendiği gibi çalışmıyorsa, MuleSoft Anypoint Platform → **Runtime Manager** → uygulamanız → **Logs** yoluyla API'nizin günlüklerine bakın.

Ayrıca **API Manager** içinde API'nize giderek ve **Policies** sekmesinde uygulanan policy'leri inceleyerek policy'nin API'ye uygulanıp uygulanmadığını doğrulayabilirsiniz. Automated policy'ler için, kapsanan API'leri ve varsa hariç tutma nedenlerini görmek üzere **See covered APIs** seçeneğini kullanabilirsiniz.

## Policy'yi yükseltme

Dağıtılan Wallarm policy'yi [daha yeni bir sürüme](code-bundle-inventory.md#mulesoft-mule-gateway) yükseltmek için:

1. Güncellenmiş Wallarm policy'yi indirin ve [Adım 2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)'de açıklandığı gibi MuleSoft Exchange'e yükleyin.
1. Yeni sürüm Exchange'de göründüğünde **API Manager** → API'niz → **Policies** → Wallarm policy → **Edit configuration** → **Advanced options** yolunu izleyin ve açılır listeden yeni policy sürümünü seçin.
1. Yeni sürüm ek parametreler getiriyorsa, gerekli değerleri sağlayın.

    Örneğin 2.x'ten 3.x'e yükseltiliyorsa:

    * **CLIENT HOST EXPRESSION**: özel bir değişiklik gerekmedikçe varsayılan değer `#[attributes.headers['x-forwarded-host']]` kullanın.
    * **CLIENT IP EXPRESSION**: özel bir değişiklik gerekmedikçe varsayılan değer `#[attributes.headers['x-forwarded-for']]` kullanın.
1. Değişiklikleri kaydedin.

Wallarm policy, automated policy olarak uygulanmışsa doğrudan yükseltme mümkün olmayabilir. Bu durumda mevcut policy'yi kaldırın ve yeni sürümü manuel olarak yeniden uygulayın.

Policy yükseltmeleri, özellikle ana sürüm güncellemelerinde, bir Wallarm node yükseltmesi gerektirebilir. Self-hosted Node sürüm notları ve yükseltme talimatları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) veya [Edge connector yükseltme prosedürüne](../security-edge/se-connector.md#upgrading-the-edge-node) bakın. Gelecekteki yükseltmeleri kolaylaştırmak ve kullanımdan kaldırmaları önlemek için düzenli node güncellemeleri önerilir.

## Policy'yi kaldırma

Wallarm policy'yi kaldırmak için, otomatik policy listesinde veya tek bir API'ye uygulanan policy'ler listesinde **Remove policy** seçeneğini kullanın.