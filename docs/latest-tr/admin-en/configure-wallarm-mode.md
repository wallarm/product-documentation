[api-discovery-enable-link]:        ../api-discovery/setup.md#enable
[link-wallarm-mode-override]:       ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]:            ../user-guides/events/check-attack.md#attack-analysis_1
[acl-access-phase]:                 ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 
[img-mode-rule]:                    ../images/user-guides/rules/wallarm-mode-rule.png

# Filtreleme Modu

Filtreleme modu, gelen istekleri işlerken filtreleme düğümünün davranışını tanımlar. Bu talimatlar, mevcut filtreleme modlarını ve bunların yapılandırma yöntemlerini açıklar.

## Kullanılabilir filtreleme modları

Wallarm filtreleme düğümü, gelen istekleri aşağıdaki modlarda (en hafiften en sıkıya doğru) işleyebilir:

* `off`
* `monitoring`
* `safe_blocking` - yalnızca engellemenin güvenli olduğu durumlarda engeller ([gri liste](../user-guides/ip-lists/overview.md)).
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

## Yapılandırma yöntemleri

Filtreleme modu aşağıdaki yollarla yapılandırılabilir:

* [Düğüm tarafında `wallarm_mode` yönergesini ayarlayın](#setting-wallarm_mode-directive)
* [Genel filtreleme modunu Wallarm Console içinde tanımlayın](#general-filtration-mode)
* [Koşullu filtreleme modu ayarlarını Wallarm Console içinde tanımlayın](#conditioned-filtration-mode)

Filtreleme modu yapılandırma yöntemlerinin öncelikleri, [`wallarm_mode_allow_override` yönergesinde](#prioritization-of-methods) belirlenir. Varsayılan olarak, değerin katılığı ne olursa olsun Wallarm Console içinde belirtilen ayarlar `wallarm_mode` yönergesinden daha yüksek önceliğe sahiptir.

### `wallarm_mode` yönergesinin ayarlanması

Düğüm filtreleme modunu, düğüm tarafında [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) yönergesini kullanarak ayarlayabilirsiniz. `wallarm_mode` yönergesinin farklı dağıtımlarda nasıl ayarlandığının özellikleri aşağıda açıklanmıştır.

Burada açıklanan yapılandırmanın yalnızca [inline](../installation/inline/overview.md) dağıtımlar için geçerli olduğunu, [out-of-band (OOB)](../installation/oob/overview.md) çözümler için yalnızca `monitoring` modunun etkin olabileceğini unutmayın.

=== "All-in-one yükleyici"

    Linux üzerinde [all-in-one installer](../installation/nginx/all-in-one.md) ile kurulan NGINX tabanlı düğümler için, `wallarm_mode` yönergesini filtreleme düğümü yapılandırma dosyasında ayarlayabilirsiniz. Farklı bağlamlar için filtreleme modlarını tanımlayabilirsiniz. Bu bağlamlar aşağıdaki listede en genelden en yerele doğru sıralanmıştır:

    * `http`: yönergeler HTTP sunucuya gönderilen isteklere uygulanır.
    * `server`: yönergeler sanal sunucuya gönderilen isteklere uygulanır.
    * `location`: yönergeler yalnızca belirli bu yolu içeren isteklere uygulanır.

    `http`, `server` ve `location` blokları için farklı `wallarm_mode` yönerge değerleri tanımlanmışsa, en yerel yapılandırma en yüksek önceliğe sahiptir.

    Aşağıda [yapılandırma örneğine](#configuration-example) bakın.

=== "Docker NGINX tabanlı imaj"

    NGINX tabanlı Wallarm düğümlerini Docker konteynerleri ile dağıtırken, `WALLARM_MODE` ortam değişkenini [iletin](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables):

    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/node:6.5.1
    ```

    Alternatif olarak, ilgili parametreyi yapılandırma dosyasına [ekleyin](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) ve konteyneri bu dosyayı iliştirerek çalıştırın.

=== "NGINX Ingress controller"

    NGINX Ingress controller için, `wallarm-mode` ek açıklamasını kullanın:

    ```
    kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
    ```

    Filtreleme modunu `monitoring` olarak ayarlayarak NGINX tabanlı Ingress controller’ınız için trafik analizinin nasıl [etkinleştirildiğine](../admin-en/installation-kubernetes-en.md#step-2-enabling-traffic-analysis-for-your-ingress) ilişkin örneğe bakın.

=== "Sidecar"

    Wallarm Sidecar çözümü için, varsayılan `values.yaml` dosyasının Wallarm’a özel bölümünde `mode` parametresini ayarlayın:

    ```
    config:
    wallarm:
        ...
        mode: monitoring
        modeAllowOverride: "on"
    ```

    Sidecar için filtreleme modunun belirtilmesine dair ayrıntılar için [buraya](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md) bakın.

=== "Edge Connector’lar"

    [Security Edge connectors](../installation/security-edge/se-connector.md) için, bağlayıcı dağıtımı sırasında **Filtration mode** seçicisinde `wallarm_mode` değerini belirtirsiniz.
=== "Native Node"
    * Native Node all-in-one installer ve Docker imajı için [`route_config.wallarm_mode`](../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parametresini kullanın.
    * Native Node Helm chart için [`config.connector.route_config.wallarm_mode`](../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_mode) parametresini kullanın.

### Genel filtreleme modu

Tüm gelen istekler için genel filtreleme modunu mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği) veya kurallar ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği) kullanarak tanımlayabilirsiniz..

=== "Mitigation controls"

    Tüm gelen istekler için genel filtreleme modu, "all traffic" **Real-time blocking mode** [mitigation control](../about-wallarm/mitigation-controls-overview.md) ile tanımlanır:

    | Ayar | Filtreleme modu |
    | --- | --- |
    | **Inherited** | Filtreleme modu, [all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode) ve Wallarm düğümünün [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) ayarlarından miras alınır. |
    | **Excluding** | `off` |
    | **Monitoring** | `monitoring` |
    | **Safe blocking** | `safe_blocking` |
    | **Blocking** | `block` |

    Varsayılan değer **Inherited**’dır. Genel modu istediğiniz anda değiştirebilirsiniz.

=== "Kurallar"
    
    Tüm gelen istekler için genel filtreleme modunu [US](https://us1.my.wallarm.com/settings/general) veya [EU](https://my.wallarm.com/settings/general) Cloud’daki **Settings** → **General** bölümünde tanımlayabilirsiniz.
    
    ![Genel ayarlar sekmesi](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

    Genel filtreleme modu ayarı, **Rules** bölümünde **Set filtration mode** [default](../user-guides/rules/rules.md#default-rules) kuralı olarak temsil edilir. Bu bölümde uç noktayı hedefleyen filtreleme kurallarının daha yüksek önceliğe sahip olduğunu unutmayın.

### Koşullu filtreleme modu

Belirli dallar, uç noktalar ve diğer koşullara dayanarak filtreleme modunu mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği) veya kurallar ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği) kullanarak ayarlayabilirsiniz.

=== "Mitigation controls"

    Belirli dallar, uç noktalar ve diğer koşullara dayanarak filtreleme modunu ayarlayabilirsiniz. Wallarm, **Real-time blocking mode** [mitigation control](../about-wallarm/mitigation-controls-overview.md) sağlar.

    Devam etmeden önce: herhangi bir mitigation control için **Scope** ve **Mitigation mode**’un nasıl ayarlandığını öğrenmek üzere [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) makalesini kullanın.

    Yeni bir filtreleme modu mitigation control’ü oluşturmak için:

    1. Wallarm Console → **Mitigation Controls** bölümüne gidin.
    1. **Add control** → **Real-time blocking mode** kullanın.
    1. Mitigation control’ün uygulanacağı **Scope**’u tanımlayın.
    1. **Mitigation mode** bölümünde, belirtilen kapsam için filtreleme modunu seçin:

        | Ayar | Filtreleme modu |
        | --- | --- |
        | **Inherited** | Filtreleme modu, [all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode) ve Wallarm düğümünün [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) ayarlarından miras alınır. |
        | **Excluding** | `off` |
        | **Monitoring** | `monitoring` |
        | **Safe blocking** | `safe_blocking` |
        | **Blocking** | `block` |

    1. Değişiklikleri kaydedin ve [mitigation control derlemesinin tamamlanmasını](../about-wallarm/mitigation-controls-overview.md#ruleset-lifecycle) bekleyin.

=== "Kurallar"

    Belirli dallar, uç noktalar ve diğer koşullara dayanarak filtreleme modunu ayarlayabilirsiniz. Wallarm, bunu yapmak için **Set filtration mode** [rule](../user-guides/rules/rules.md) sağlar. Bu tür kurallar, [Wallarm Console’da ayarlanan genel filtreleme kuralından](#general-filtration-mode) daha yüksek önceliğe sahiptir.

    Yeni bir filtreleme modu kuralı oluşturmak için:

    --8<-- "../include/rule-creation-initial-step.md"

    1. **Fine-tuning attack detection** → **Override filtration mode** seçin. 
    1. **If request is** içinde, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring). Kuralı belirli bir dal, hit veya uç nokta için başlattıysanız, kapsamı onlar belirler – gerekirse daha fazla koşul ekleyebilirsiniz.
    1. Belirtilen kapsam için filtreleme modunu seçin:

        | Ayar | Filtreleme modu |
        | --- | --- |
        | **Default** | Filtreleme modu, [global filtreleme modu ayarından](../admin-en/configure-wallarm-mode.md#general-filtration-mode) ve Wallarm düğümünün [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) ayarlarından miras alınır. |
        | **Disabled** | `off` |
        | **Monitoring** | `monitoring` |
        | **Safe blocking** | `safe_blocking` |
        | **Blocking** | `block` |

    1. Değişiklikleri kaydedin ve [kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

    Bir filtreleme modu kuralı oluşturmak için, [Wallarm API’yi doğrudan çağırabileceğinizi](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application) unutmayın.

### Yöntemlerin önceliklendirilmesi

!!! warning "`wallarm_mode_allow_override` yönergesinin Edge düğümünde desteği"
    Lütfen `wallarm_mode_allow_override` yönergesinin Wallarm Edge [inline](../installation/security-edge/inline/deployment.md) ve [connector](../installation/security-edge/se-connector.md) düğümlerinde özelleştirilemeyeceğini unutmayın.

`wallarm_mode_allow_override` yönergesi, filtreleme düğümü yapılandırma dosyasındaki `wallarm_mode` yönergesi değerlerini kullanmak yerine Wallarm Console’da tanımlanan mod kurallarını/mitigation controls uygulama yeteneğini yönetir.

`wallarm_mode_allow_override` yönergesi için aşağıdaki değerler geçerlidir:

* `off`: Wallarm Console’da belirtilen mod kuralları/mitigation controls yok sayılır. Yapılandırma dosyasındaki `wallarm_mode` yönergesiyle belirtilen kurallar uygulanır.
* `strict`: yalnızca yapılandırma dosyasındaki `wallarm_mode` yönergesinin tanımladığından daha sıkı filtreleme modlarını tanımlayan Wallarm Cloud’da belirtilen mod kuralları/mitigation controls uygulanır.

    Kullanılabilir filtreleme modları, en hafiften en sıkıya doğru [yukarıda](#available-filtration-modes) listelenmiştir.

* `on` (varsayılan): Wallarm Console’da belirtilen mod kuralları/mitigation controls uygulanır. Yapılandırma dosyasındaki `wallarm_mode` yönergesiyle belirtilen kurallar yok sayılır.

`wallarm_mode_allow_override` yönerge değerinin tanımlanabileceği bağlamlar, en genelden en yerele doğru aşağıdaki listede sunulmuştur:

* `http`: `http` bloğu içindeki yönergeler HTTP sunucuya gönderilen isteklere uygulanır.
* `server`: `server` bloğu içindeki yönergeler sanal sunucuya gönderilen isteklere uygulanır.
* `location`: `location` bloğu içindeki yönergeler yalnızca belirli bu yolu içeren isteklere uygulanır.

`wallarm_mode_allow_override` yönergesinin `http`, `server` ve `location` bloklarında farklı değerleri tanımlanmışsa, en yerel yapılandırma en yüksek önceliğe sahiptir.

**`wallarm_mode_allow_override` yönergesinin kullanım örneği:**

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

Bu yapılandırma örneği, Wallarm Console’daki filtreleme modu kurallarının aşağıdaki şekilde uygulanmasıyla sonuçlanır:

1. Wallarm Console’da tanımlanan filtreleme modu kuralları/mitigation controls, `SERVER_A` sanal sunucusuna gönderilen istekler için yok sayılır. `SERVER_A` sunucusuna karşılık gelen `server` bloğunda belirtilmiş bir `wallarm_mode` yönergesi olmadığından, bu tür istekler için `http` bloğunda belirtilen `monitoring` filtreleme modu uygulanır.
2. Wallarm Console’da tanımlanan filtreleme modu kuralları/mitigation controls, `/main/login` yolunu içeren istekler hariç `SERVER_B` sanal sunucusuna gönderilen isteklere uygulanır.
3. Hem `SERVER_B` sanal sunucusuna gönderilen hem de `/main/login` yolunu içeren istekler için, Wallarm Console’da tanımlanan filtreleme modu kuralları yalnızca `monitoring` modundan daha sıkı bir filtreleme modu tanımlıyorlarsa uygulanır.

## Yapılandırma örneği

Yukarıda bahsedilen tüm yöntemleri kullanan bir filtreleme modu yapılandırması örneğini ele alalım.

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

### Wallarm Console’daki ayarlar

* [Genel filtreleme modu](#general-filtration-mode): **Monitoring**.
* [Koşullu filtreleme modu ayarları](#conditioned-filtration-mode):
    * İstek aşağıdaki koşulları sağlıyorsa:
        * Yöntem: `POST`
        * Yolun ilk bölümü: `main`
        * Yolun ikinci bölümü: `apply`,
        
        o halde **Default** filtreleme modunu uygulayın.
        
    * İstek aşağıdaki koşulu sağlıyorsa:
        * Yolun ilk bölümü: `main`,
        
        o halde **Blocking** filtreleme modunu uygulayın.
        
    * İstek aşağıdaki koşulları sağlıyorsa:
        * Yolun ilk bölümü: `main`
        * Yolun ikinci bölümü: `login`,
        
        o halde **Monitoring** filtreleme modunu uygulayın.

### İstek örnekleri

Yapılandırılmış `SERVER_A` sunucusuna gönderilen isteklerin örnekleri ve Wallarm filtreleme düğümünün bunlara uyguladığı işlem aşağıdaki gibidir:

* `/news` yoluna sahip kötü amaçlı istek, `SERVER_A` sunucusu için `wallarm_mode monitoring;` ayarı nedeniyle işlenir ancak engellenmez.

* `/main` yoluna sahip kötü amaçlı istek, `SERVER_A` sunucusu için `wallarm_mode monitoring;` ayarı nedeniyle işlenir ancak engellenmez.

    Wallarm Console’da tanımlanan **Blocking** kuralı, `SERVER_A` sunucusu için `wallarm_mode_allow_override off;` ayarı nedeniyle buna uygulanmaz.

* `/main/login` yoluna sahip kötü amaçlı istek, `/main/login` yoluna sahip istekler için `wallarm_mode block;` ayarı nedeniyle engellenir.

    Wallarm Console’da tanımlanan **Monitoring** kuralı, filtreleme düğümü yapılandırma dosyasındaki `wallarm_mode_allow_override strict;` ayarı nedeniyle buna uygulanmaz.

* `/main/signup` yoluna sahip kötü amaçlı istek, `/main/signup` yoluna sahip istekler için `wallarm_mode_allow_override strict;` ayarı ve `/main` yolu için Wallarm Console’da tanımlanan **Blocking** kuralı nedeniyle engellenir.
* `/main/apply` yoluna ve `GET` metoduna sahip kötü amaçlı istek, `/main/apply` yoluna sahip istekler için `wallarm_mode_allow_override on;` ayarı ve `/main` yolu için Wallarm Console’da tanımlanan **Blocking** kuralı nedeniyle engellenir.
* `/main/apply` yoluna ve `POST` metoduna sahip kötü amaçlı istek, `/main/apply` yoluna sahip bu istekler için `wallarm_mode_allow_override on;` ayarı, Wallarm Console’da tanımlanan **Default** kuralı ve filtreleme düğümü yapılandırma dosyasında `/main/apply` yoluna sahip istekler için `wallarm_mode block;` ayarı nedeniyle engellenir.
* `/main/feedback` yoluna sahip kötü amaçlı istek, filtreleme düğümü yapılandırma dosyasında `/main/feedback` yoluna sahip istekler için `wallarm_mode safe_blocking;` ayarı nedeniyle yalnızca [gri listeye alınmış bir IP’den](../user-guides/ip-lists/overview.md) geliyorsa engellenir.

    Wallarm Console’da tanımlanan **Monitoring** kuralı, filtreleme düğümü yapılandırma dosyasındaki `wallarm_mode_allow_override off;` ayarı nedeniyle buna uygulanmaz.

## Filtreleme modunu kademeli uygulamaya ilişkin en iyi uygulamalar

Yeni bir Wallarm düğümünün başarılı şekilde devreye alınması için, filtreleme modlarını değiştirmek üzere şu adım adım önerileri izleyin:

1. Wallarm filtreleme düğümlerini üretim dışı ortamlarınızda `monitoring` çalışma moduna ayarlı olarak dağıtın.
1. Wallarm filtreleme düğümlerini üretim ortamınızda `monitoring` çalışma moduna ayarlı olarak dağıtın.
1. Wallarm bulut tabanlı arka ucunun uygulamanızı öğrenmesi için tüm ortamlarınızdaki (test ve üretim dahil) trafiğin 7‑14 gün boyunca filtreleme düğümleri üzerinden akmasını sağlayın.
1. Tüm üretim dışı ortamlarınızda Wallarm `block` modunu etkinleştirin ve korunan uygulamanın beklendiği gibi çalıştığını doğrulamak için otomatik veya manuel testler kullanın.
1. Üretim ortamında Wallarm `block` modunu etkinleştirin ve uygulamanın beklendiği gibi çalıştığını doğrulamak için mevcut yöntemleri kullanın.