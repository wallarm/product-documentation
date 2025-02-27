```markdown
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable
[link-wallarm-mode-override]:       ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]:            ../user-guides/events/check-attack.md#attack-analysis_1
[acl-access-phase]:                 ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 
[img-mode-rule]:                    ../images/user-guides/rules/wallarm-mode-rule.png

# Filtreleme Modu

Filtreleme modu, gelen istekleri işlerken filtreleme düğümünün davranışını tanımlar. Bu yönergeler, mevcut filtreleme modlarını ve yapılandırma yöntemlerini açıklar.

## Mevcut filtreleme modları

Wallarm filtreleme düğümü, gelen istekleri aşağıdaki modlarda işleyebilir (en hafif olandan en katı olanına doğru):

* **Disabled** (`off`)
* **Monitoring** (`monitoring`)
* **Safe blocking** (`safe_blocking`)
* **Blocking** (`block`)

--8<-- "../include/wallarm-modes-description-latest.md"

## Yapılandırma yöntemleri

Filtreleme modu, aşağıdaki yollarla yapılandırılabilir:

* [Düğüm tarafında `wallarm_mode` direktifini ayarlayın](#setting-wallarm_mode-directive)
* [Wallarm Console'da genel filtreleme kuralını tanımlayın](#general-filtration-rule-in-wallarm-console)
* [Wallarm Console'da uç noktaya yönelik filtreleme kurallarını tanımlayın](#endpoint-targeted-filtration-rules-in-wallarm-console)

Filtreleme modu yapılandırma yöntemlerinin öncelikleri, [`wallarm_mode_allow_override` direktifinde](#prioritization-of-methods) belirlenir. Varsayılan olarak, Wallarm Console'da belirtilen ayarlar, değer şiddetine bakılmaksızın `wallarm_mode` direktifi tarafından belirtilen ayarlardan daha yüksek önceliğe sahiptir.

### `wallarm_mode` direktifinin ayarlanması

Düğüm tarafında `wallarm_mode` direktifini kullanarak düğüm filtreleme modunu ayarlayabilirsiniz. Farklı dağıtımlarda `wallarm_mode` direktifinin nasıl ayarlandığına dair ayrıntılar aşağıda açıklanmıştır.

Belirtilen yapılandırmanın yalnızca [in-line](../installation/inline/overview.md) dağıtımlar için geçerli olduğunu unutmayın - [out-of-band (OOB)](../installation/oob/overview.md) çözümlerinde yalnızca `monitoring` modu etkin olabilir.

=== "All-in-one installer"

    Linux üzerinde [all-in-one installer](../installation/nginx/all-in-one.md) kullanılarak kurulan NGINX tabanlı düğümler için, filtreleme düğümü yapılandırma dosyasında `wallarm_mode` direktifini ayarlayabilirsiniz. Farklı bağlamlar için filtreleme modlarını tanımlayabilirsiniz. Bu bağlamlar, en globalden en yerel olana doğru aşağıdaki sırayla düzenlenmiştir:

    * `http`: direktifler HTTP sunucusuna gönderilen isteklere uygulanır.
    * `server`: direktifler sanal sunucuya gönderilen isteklere uygulanır.
    * `location`: sadece belirtilen yol içeren isteklere direktifler uygulanır.

    `http`, `server` ve `location` blokları için farklı `wallarm_mode` direktif değerleri tanımlanırsa, en yerel yapılandırma en yüksek önceliğe sahiptir.

    Aşağıdaki [yapılandırma örneğine](#configuration-example) bakınız.

=== "Docker NGINX‑based image"

    Docker konteynerleri üzerinden NGINX tabanlı Wallarm düğümleri dağıtırken, [environment variable olarak geçin](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_MODE`:

    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/node:5.3.0
    ```

    Alternatif olarak, [yapılandırma dosyasına ekleyin](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) ve bu dosyayı monte ederek konteyneri çalıştırın.

=== "Docker Envoy‑based image"

    Docker konteynerleri üzerinden Envoy tabanlı Wallarm düğümleri dağıtırken, [environment variable olarak geçin](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) `WALLARM_MODE`:

    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/envoy:4.8.0-1
    ```

    Alternatif olarak, [yapılandırma dosyasına ekleyin](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) ve bu dosyayı monte ederek konteyneri çalıştırın.

=== "NGINX Ingress controller"

    NGINX Ingress controller için `wallarm-mode` anotasyonunu kullanın:

    ```
    kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
    ```

    Filtreleme modunu `monitoring` olarak ayarlayarak NGINX tabanlı Ingress controller'ınız için trafik analizinin nasıl [etkinleştirildiğine](../admin-en/installation-kubernetes-en.md#step-2-enabling-traffic-analysis-for-your-ingress) dair örneğe bakınız.

=== "Sidecar"

    Wallarm Sidecar çözümü için, varsayılan `values.yaml` dosyasının Wallarm ile ilgili bölümünde `mode` parametresini ayarlayın:

    ```
    config:
    wallarm:
        ...
        mode: monitoring
        modeAllowOverride: "on"
    ```

    Sidecar için filtreleme modunun nasıl belirtileceğine dair detayları [burada](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md) görebilirsiniz.

=== "Edge Connectors"

    [Security Edge connectors](../installation/se-connector.md) için, bağlantı dağıtımı sırasında **Filtration mode** seçicide `wallarm_mode` değerini belirtirsiniz.
=== "Native Node"
    * Native Node all-in-one installer ve Docker image için [`route_config.wallarm_mode`](../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parametresini kullanın.
    * Native Node Helm chart için [`config.connector.mode`](../installation/native-node/helm-chart-conf.md#configconnectormode) parametresini kullanın.

### Wallarm Console'da Genel Filtreleme Kuralı

Gelen tüm istekler için genel filtreleme modunu **Settings** → **General** bölümünde [US](https://us1.my.wallarm.com/settings/general) veya [EU](https://my.wallarm.com/settings/general) Cloud üzerinden tanımlayabilirsiniz.
    
![The general settings tab](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

Genel filtreleme modu ayarı, **Rules** bölümünde **Set filtration mode** [default](../user-guides/rules/rules.md#default-rules) kuralı olarak temsil edilir. Bu bölümdeki uç noktaya yönelik filtreleme kurallarının daha yüksek önceliğe sahip olduğunu unutmayın.

### Wallarm Console'da Uç Noktaya Yönelik Filtreleme Kuralları

Belirli dallar, uç noktalar ve diğer koşullara bağlı olarak filtreleme modunu ayarlayabilirsiniz. Wallarm, bunu yapmak için **Set filtration mode** [kuralını](../user-guides/rules/rules.md) sağlar. Bu tür kurallar, [Wallarm Console'da ayarlanan genel filtreleme kuralından](#general-filtration-rule-in-wallarm-console) daha yüksek önceliğe sahiptir.

Yeni bir filtreleme modu kuralı oluşturmak için:

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection** → **Override filtration mode** seçeneğini seçin. 
1. **If request is** kısmında, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring). Kuralı belirli bir dal, istek veya uç nokta için başlattıysanız, kapsam onlar tarafından tanımlanır - gerekirse daha fazla koşul ekleyebilirsiniz.
1. İstenen modu seçin.
1. Değişiklikleri kaydedin ve [kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

Filtreleme modu kuralı oluşturmak için ayrıca [Wallarm API'sini doğrudan çağırabileceğinizi](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application) unutmayın.

### Yöntemlerin Önceliklendirilmesi

!!! warning "Edge düğümünde `wallarm_mode_allow_override` direktifinin desteği"
    Lütfen, `wallarm_mode_allow_override` direktifinin Wallarm Edge [inline](../installation/security-edge/deployment.md) ve [connector](../installation/se-connector.md) düğümlerinde özelleştirilemeyeceğini unutmayın.

`wallarm_mode_allow_override` direktifi, filtreleme düğümü yapılandırma dosyasındaki `wallarm_mode` direktifi değerlerini kullanmak yerine Wallarm Console'da tanımlanan kuralların uygulanabilmesini yönetir.

`wallarm_mode_allow_override` direktifi için geçerli olan değerler şunlardır:

* `off`: Wallarm Console'da belirtilen kurallar göz ardı edilir. Konfigürasyon dosyasında `wallarm_mode` direktifiyle belirtilen kurallar uygulanır.
* `strict`: Sadece, konfigürasyon dosyasında `wallarm_mode` direktifiyle belirtilenlerden daha katı filtreleme modlarını tanımlayan Wallarm Cloud'daki kurallar uygulanır.

    Mevcut filtreleme modları, en hafif olandan en katı olana doğru yukarıda [listelenmiştir](#available-filtration-modes).

* `on` (varsayılan): Wallarm Console'da belirtilen kurallar uygulanır. Konfigürasyon dosyasında `wallarm_mode` direktifiyle belirtilen kurallar göz ardı edilir.

`wallarm_mode_allow_override` direktifi değerinin tanımlanabileceği bağlamlar, en globalden en yerel olana doğru aşağıdaki listede sunulmuştur:

* `http`: `http` bloğu içindeki direktifler, HTTP sunucusuna gönderilen isteklere uygulanır.
* `server`: `server` bloğu içindeki direktifler, sanal sunucuya gönderilen isteklere uygulanır.
* `location`: `location` bloğu içindeki direktifler, yalnızca ilgili yolu içeren isteklere uygulanır.

`http`, `server` ve `location` blokları için farklı `wallarm_mode_allow_override` direktif değerleri tanımlanırsa, en yerel yapılandırma en yüksek önceliğe sahiptir.

**`wallarm_mode_allow_override` direktifinin kullanım örneği:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

Bu yapılandırma örneği, Wallarm Console'dan gelen filtreleme modu kurallarının uygulanmasıyla ilgili aşağıdaki durumları oluşturur:

1. Sanal sunucu `SERVER_A`'ya gönderilen istekler için Wallarm Console'da tanımlanan filtreleme modu kuralları göz ardı edilir. `SERVER_A` sunucusuna karşılık gelen `server` bloğunda `wallarm_mode` direktifi belirtilmemiş olduğundan, `http` bloğunda belirtilen `monitoring` filtreleme modu bu istekler için uygulanır.
2. Sanal sunucu `SERVER_B`'ye gönderilen istekler için Wallarm Console'da tanımlanan filtreleme modu kuralları, `/main/login` yolunu içeren istekler hariç uygulanır.
3. Sanal sunucu `SERVER_B`'ye gönderilen ve `/main/login` yolunu içeren istekler için, Wallarm Console'da tanımlanan filtreleme modu kuralları yalnızca `monitoring` modundan daha katı bir filtreleme modu tanımlıyorsa uygulanır.

## Yapılandırma Örneği

Yukarıda bahsedilen tüm yöntemlerin kullanıldığı bir filtreleme modu yapılandırması örneğini ele alalım.

### Düğüm yapılandırma dosyası

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
        
        location /main/feedback {
            wallarm_mode safe_blocking;
            wallarm_mode_allow_override off;
        }
    }
}
```

### Wallarm Console'daki Kurallar

* [Genel filtreleme kuralı](#general-filtration-rule-in-wallarm-console): **Monitoring**.
* [Filtreleme kuralları](#endpoint-targeted-filtration-rules-in-wallarm-console):
    * Eğer istek aşağıdaki koşulları sağlıyorsa:
        * Yöntem: `POST`
        * Yolun ilk bölümü: `main`
        * Yolun ikinci bölümü: `apply`,
        
        o zaman **Default** filtreleme modu uygulanır.
        
    * Eğer istek aşağıdaki koşulu sağlıyorsa:
        * Yolun ilk bölümü: `main`,
        
        o zaman **Blocking** filtreleme modu uygulanır.
        
    * Eğer istek aşağıdaki koşulları sağlıyorsa:
        * Yolun ilk bölümü: `main`
        * Yolun ikinci bölümü: `login`,
        
        o zaman **Monitoring** filtreleme modu uygulanır.

### İstek örnekleri

`SERVER_A` yapılandırılmış sunucusuna gönderilen istek örnekleri ve Wallarm filtreleme düğümünün bu isteklere uyguladığı işlemler aşağıdaki gibidir:

* `/news` yoluna sahip kötü niyetli istek, `SERVER_A` sunucusu için ayarlanan `wallarm_mode monitoring;` nedeniyle işlenir ancak engellenmez.

* `/main` yoluna sahip kötü niyetli istek, `SERVER_A` sunucusu için ayarlanan `wallarm_mode monitoring;` nedeniyle işlenir ancak engellenmez.

    Wallarm Console'da tanımlanan **Blocking** kuralı, `SERVER_A` sunucusu için ayarlanan `wallarm_mode_allow_override off;` nedeniyle uygulanmaz.

* `/main/login` yoluna sahip kötü niyetli istek, `/main/login` yoluna özel `wallarm_mode block;` nedeniyle engellenir.

    Filtreleme düğümü yapılandırma dosyasında belirtilen `wallarm_mode_allow_override strict;` nedeniyle Wallarm Console'da tanımlanan **Monitoring** kuralı uygulanmaz.

* `/main/signup` yoluna sahip kötü niyetli istek, `/main/signup` yolundaki `wallarm_mode_allow_override strict;` ayarı ve `/main` yolu için Wallarm Console'da tanımlanan **Blocking** kuralı nedeniyle engellenir.
* `/main/apply` yoluna sahip ve `GET` yöntemiyle gelen kötü niyetli istek, `/main/apply` yolundaki `wallarm_mode_allow_override on;` ayarı ve `/main` yolu için Wallarm Console'da tanımlanan **Blocking** kuralı nedeniyle engellenir.
* `/main/apply` yoluna sahip ve `POST` yöntemiyle gelen kötü niyetli istek, `/main/apply` yolundaki `wallarm_mode_allow_override on;` ayarı, Wallarm Console'da tanımlanan **Default** kuralı ve `/main/apply` yolu için yapılandırma dosyasında belirtilen `wallarm_mode block;` nedeniyle engellenir.
* `/main/feedback` yoluna sahip kötü niyetli istek, sadece [graylisted IP](../user-guides/ip-lists/overview.md) kaynaklıysa, `/main/feedback` yoluna özel `wallarm_mode safe_blocking;` nedeniyle engellenir.

    Filtreleme düğümü yapılandırma dosyasında belirtilen `wallarm_mode_allow_override off;` nedeniyle Wallarm Console'da tanımlanan **Monitoring** kuralı uygulanmaz.

## Kademeli Filtreleme Modu Uygulaması için En İyi Uygulamalar

Yeni bir Wallarm düğümünün başarılı bir şekilde devreye alınması için, filtreleme modlarını değiştirmek adına şu adım adım önerileri izleyin:

1. Test dışı (non-production) ortamlarda çalışacak şekilde Wallarm filtreleme düğümlerini `monitoring` modunda dağıtın.
2. Üretim ortamınızda çalışan Wallarm filtreleme düğümlerini `monitoring` modunda dağıtın.
3. Wallarm cloud tabanlı backend'in uygulamanız hakkında bilgi sahibi olabilmesi için, tüm ortamlarınızda (test ve üretim dahil) filtreleme düğümleri üzerinden geçen trafiği 7‑14 gün boyunca akışta tutun.
4. Tüm test dışı (non-production) ortamlarda Wallarm `block` modunu etkinleştirin ve korunan uygulamanın beklendiği gibi çalıştığını otomatik veya manuel testlerle doğrulayın.
5. Üretim ortamınızda Wallarm `block` modunu etkinleştirin ve mevcut yöntemleri kullanarak uygulamanın beklendiği gibi çalıştığını doğrulayın.
```