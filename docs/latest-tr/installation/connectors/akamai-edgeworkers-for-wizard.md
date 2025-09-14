# Sihirbaz için Akamai

Wallarm Edge node'u Akamai'ye bağlayarak trafiği [senkron](../inline/overview.md) veya [asenkron](../oob/overview.md) modda — hiçbir isteği engellemeden — inceleyebilirsiniz.

Bağlantıyı kurmak için aşağıdaki adımları izleyin.

**1. Wallarm paketlerinden EdgeWorkers oluşturun**

1. Platformunuz için sağlanan kod paketini indirin.
1. Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID** bölümüne gidin, ardından `wallarm-main` kod paketini içe aktarın.
1. Başka bir EdgeWorker ID oluşturun ve `wallarm-sp` paketini içe aktarın.

**2. Wallarm Node property’sini oluşturun** 

1. Akamai Property Manager içinde yeni bir property oluşturun:

    * **Property name / hostname**: ayrılmış Node hostname’i (ör. `node.customer.com`). Bu hostname, kontrol ettiğiniz bir DNS bölgesine ait olmalıdır.
    * **Property type**: `Dynamic Site Accelerator`.
    * **Origin type**: `Web server`.
    * **Origin Hostname**: Wallarm node URL’si.
1. Property için TLS yapılandırın:

    * Ya **Akamai Managed Certificate** seçin (Akamai, `node.customer.com` için bir sertifika düzenleyip yönetecektir), ya da
    * Gerekirse kendi sertifikanızı yükleyin.
1. Property’yi kaydedin. Akamai bir Edge Hostname oluşturacaktır, ör. `node.customer.com.edgesuite.net`.
1. DNS bölgenizde, Node hostname’inizi Edge Hostname’e işaret eden bir CNAME kaydı oluşturun, ör. `node.customer.com → node.customer.com.edgesuite.net`.
1. [Property’yi staging’de etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-stage), çalışmasını doğrulayın, ardından [production’da etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

**3. Origin property’de değişkenleri yapılandırın**

Mevcut origin property’nizi açın → **Edit New Version** ve aşağıdaki değişkenleri yapılandırın:

* `PMUSER_WALLARM_NODE`: `wallarm-main` EdgeWorker’ı için oluşturduğunuz property adı.
* `PMUSER_WALLARM_HEADER_SECRET`: rastgele bir gizli dize (ör. `aj8shd82hjd72hs9`). Belirtilen değer, EdgeWorker isteği aynı property’ye geri ilettiğinde istek başlığı `x-wlrm-checked` olarak geçirilir. Bu, döngüleri önler ve sahte başlıklara sahip istekleri engeller.
* `PMUSER_WALLARM_ASYNC`: [asenkron (out-of-band)](../oob/overview.md) modu kullanılıyorsa, değişkeni `true` olarak ayarlayın.

Gerekirse [diğer değişkenleri](akamai-edgeworkers.md#4-configure-variables-in-the-origin-property) değiştirin.

**4. Wallarm EdgeWorker kuralı ekleyin**

Origin property içinde yeni bir boş kural oluşturun:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Behavior: EdgeWorkers → the `wallarm-main` EdgeWorker

**5. Spoofing önleme kuralı ekleyin**

Origin property içinde başka bir yeni boş kural oluşturun:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Behavior: EdgeWorkers → the `wallarm-sp` EdgeWorker

**6. Property’yi kaydedin ve etkinleştirin**

1. Yeni origin property sürümünü kaydedin.
1. [Staging ortamında etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-stage).
1. Doğrulamanın ardından, [production’da etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

[Daha fazla ayrıntı](akamai-edgeworkers.md)

<style>
  h1#akamai-for-wizard {
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