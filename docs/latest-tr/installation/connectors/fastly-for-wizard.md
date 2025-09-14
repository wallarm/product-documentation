# Sihirbaz için Fastly

Wallarm Edge node, API'lerinizi çalıştıran Fastly'ye [eşzamanlı](../inline/overview.md) veya [eşzamansız](../oob/overview.md) modda - hiçbir isteği engellemeden - bağlanabilir.

Bağlantıyı yapılandırmak için aşağıdaki adımları izleyin.

**Wallarm kodunu Fastly üzerinde dağıtın**

1. Platformunuz için sağlanan kod paketini indirin.
1. Şuraya gidin: **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token**:

    * Type: Automation token
    * Scope: Global API access
    * Özel değişiklikler gerekmiyorsa diğer ayarları varsayılanlarında bırakın
1. Şuraya gidin: **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project** ve Wallarm için bir örnek oluşturun.
1. Oluşturulduktan sonra, üretilen `--service-id` değerini kopyalayın.
1. Wallarm paketini içeren yerel dizine gidin ve dağıtın:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    Başarı mesajı:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

**Wallarm Node ve arka uç hostlarını belirtin**

Analiz ve iletim için trafiğin doğru yönlendirilmesi adına, Fastly servis yapılandırmasında Wallarm Node ve arka uç hostlarını tanımlamanız gerekir:

1. Şuraya gidin: **Fastly** UI → **Compute** → **Compute services** → Wallarm service → **Edit configuration**.
1. Şuraya gidin: **Origins** ve **Create hosts**:

    * Analiz için trafiği Wallarm Node’a yönlendirmek amacıyla Wallarm Node URL’sini `wallarm-node` hostu olarak ekleyin.
    * Node'dan origin backend'inize trafiği iletmek için arka uç adresinizi başka bir host olarak ekleyin (örn. `backend`).
1. Yeni servis sürümünü **Activate**.

**Wallarm yapılandırma deposunu oluşturun**

Wallarm’a özgü ayarları tanımlayan `wallarm_config` yapılandırmasını oluşturun:

1. Şuraya gidin: **Fastly** UI → **Resources** → **Config stores** → **Create a config store** ve aşağıdaki anahtar-değer öğeleriyle `wallarm_config` deposunu oluşturun:

    * `WALLARM_BACKEND`: Compute service ayarlarında belirtilen Wallarm Node örneğinin ana makine adı.
    * `ORIGIN_BACKEND`: Compute service ayarlarında belirtilen arka uç için ana makine adı.
    * `WALLARM_MODE_ASYNC`: Orijinal akışı etkilemeden trafik [kopya](../oob/overview.md) analizini etkinleştirir (`true`) veya satır içi analizi (`false`, varsayılan).

    [Daha fazla parametre](fastly.md#configuration-options)
1. Config store'u Wallarm Compute service ile **Link**.

[Daha fazla bilgi](fastly.md)

<style>
  h1#fastly-for-wizard {
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