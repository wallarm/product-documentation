[acl-access-phase]: ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 

# Filtrasyon modunun konfigürasyonu

Filtrasyon modu, gelen isteklerin işlenmesi sırasında filtreleme düğümünün davranışını tanımlar. Bu talimatlar, mevcut filtreleme modlarını ve konfigürasyon yöntemlerini açıklar.

## Mevcut filtreleme modları

Wallarm filtreleme düğümü, gelen istekleri aşağıdaki modlarda işleyebilir (en yumuşaktan en sıkıya):

* **Devre dışı** (`off`)
* **İzleme** (`monitoring`)
* **Güvenli engelleme** (`safe_blocking`)
* **Engelleme** (`block`)

--8<-- "../include-tr/wallarm-modes-description-latest.md"

## Filtrasyon modu konfigürasyon yöntemleri

Filtrasyon modu aşağıdaki şekillerde yapılandırılabilir:

* Filtreleme düğümünün konfigürasyon dosyasındaki `wallarm_mode` yönergesine bir değer atayın.

    !!! uyarı "CDN düğümündeki `wallarm_mode` yönergesinin desteği"
        Lütfen `wallarm_mode` yönergesinin [Wallarm CDN düğümlerinde](../installation/cdn-node.md) yapılandırılamayacağını unutmayın. CDN düğümlerinin filtreleme modunu yapılandırmak için  lütfen diğer mevcut yöntemleri kullanın.
* Wallarm Konsolu'nda genel filtreleme kuralını tanımlayın.
* Wallarm Konsolu'nun **Kurallar** bölümünde bir filtreleme modu kuralı oluşturun.

Filtrasyon modu konfigürasyon yöntemlerinin öncelikleri, [`wallarm_mode_allow_override` yönergesi](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override) ile belirlenir. Varsayılan olarak, Wallarm Konsolu'nda belirtilen ayarlar, değer ağırlığı ne olursa olsun `wallarm_mode` yönergesinden daha yüksek önceliğe sahiptir.

### `wallarm_mode` yönergesinde filtreleme modunu belirtme

!!! uyarı "CDN düğümündeki `wallarm_mode` yönergesinin desteği"
    Lütfen `wallarm_mode` yönergesinin [Wallarm CDN düğümlerinde](../installation/cdn-node.md) yapılandırılamayacağını unutmayın. CDN düğümlerinin filtreleme modunu yapılandırmak için lütfen diğer mevcut yöntemleri kullanın.

Filtreleme düğümünün konfigürasyon dosyasındaki `wallarm_mode` yönergesini kullanarak, farklı bağlamlar için filtreleme modlarını tanımlayabilirsiniz. Bu bağlamlar, en genel olanından en yerel olanına kadar aşağıdaki liste şeklinde düzenlenmiştir:

* `http`: `http` bloğu içindeki yönergeler HTTP sunucusuna gönderilen isteklere uygulanır.
* `server`: `server` bloğu içindeki yönergeler sanal sunucuya gönderilen isteklere uygulanır.
* `location`: `location` bloğu içindeki yönergeler, sadece belirtilen yolu içeren isteklere uygulanır.

`http`, `server` ve `location` blokları için farklı `wallarm_mode` yönerge değerleri tanımlanmışsa, en yerel yapılandırma en yüksek önceliğe sahip olur.

**`wallarm_mode` yönergesinin kullanım örneği:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode off;
    }
    
    server {
        server_name SERVER_C;
        wallarm_mode off;
        
        location /main/content {
            wallarm_mode monitoring;
        }
        
        location /main/login {
            wallarm_mode block;
        }

        location /main/reset-password {
            wallarm_mode safe_blocking;
        }
    }
}
```

Bu örnekte, kaynaklar için filtrasyon modları aşağıdaki şekilde tanımlanmıştır:

1. `monitoring` modu, HTTP sunucusuna gönderilen isteklere uygulanır.
2. `monitoring` modu, `SERVER_A` adlı sanal sunucuya gönderilen isteklere uygulanır.
3. `off` modu, `SERVER_B` adlı sanal sunucuya gönderilen isteklere uygulanır.
4. `off` modu, `SERVER_C` adlı sanal sunucuya gönderilen isteklere uygulanır, ancak `/main/content`, `/main/login` veya `/main/reset-password` yolunu içeren istekler hariç.
    1. `monitoring` modu, `SERVER_C` adlı sanal sunucuya gönderilen ve `/main/content` yolunu içeren isteklere uygulanır.
    2. `block` modu, `SERVER_C` adlı sanal sunucuya gönderilen ve `/main/login` yolunu içeren isteklere uygulanır.
    3. `safe_blocking` modu, `SERVER_C` adlı sanal sunucuya gönderilen ve `/main/reset-password` yolunu içeren isteklere uygulanır.

### Wallarm Konsolu'nda genel filtrasyon kuralını ayarlama

[ABD Wallarm Bulutu](https://us1.my.wallarm.com/settings/general) veya [AB Wallarm Bulutu](https://my.wallarm.com/settings/general)'ndaki Wallarm Konsolu ayarlarının **Genel** sekmesindeki radyo düğmeleri, tüm gelen istekler için genel filtrasyon modunu tanımlar. Konfigürasyon dosyasındaki `http` bloğunda belirlenen `wallarm_mode` yönerge değeri, bu düğmelerle aynı eylem kapsamına sahiptir.

Wallarm Konsolu'nun **Kurallar** sekmesindeki yerel filtrasyon modu ayarları, **Genel** sekmedeki global ayarlardan daha yüksek önceliğe sahiptir.

**Genel** sekmede, aşağıdaki filtreleme modlarından birini belirtebilirsiniz: 

* **Yerel ayarlar (varsayılan)**: [`wallarm_mode` yönergesi](#specifying-the-filtering-mode-in-the-wallarm_mode-directive) kullanılarak belirlenen filtreleme modu uygulanır
* [**İzleme**](#available-filtration-modes)
* [**Güvenli engelleme**](#available-filtration-modes)
* [**Engelleme**](#available-filtration-modes)
    
![Genel ayarlar sekmesi](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

!!! bilgi "Wallarm Bulutu ve filtreleme düğümü senkronizasyonu"
    Wallarm Konsolu'nda tanımlanan kurallar, Wallarm Bulutu ve filtreleme düğümünün senkronizasyon süreci sırasında uygulanır ve bu süreç her 2-4 dakikada bir gerçekleşir.

    [Filtreleme düğümü ve Wallarm Bulutu senkronizasyonu konfigürasyonu hakkında daha fazla detay →](configure-cloud-node-synchronization-en.md)

### "Kurallar" sekmesinde filtreleme kurallarını ayarlama

Wallarm Konsolu'nun **Kurallar** sekmesinde, özel koşullarınıza uyan isteklerin işlenmesi için filtreleme modunu hassas bir şekilde ayarlayabilirsiniz. Bu kurallar, [Wallarm Konsolu'nda belirlenen genel filtreleme kuralından](#setting-up-the-general-filtration-rule-in-wallarm-console) daha yüksek önceliğe sahiptir.

* [**Kurallar** sekmesinde kurallarla çalışma ayrıntıları →](../user-guides/rules/rules.md)
* [Filtrasyon modunu yöneten bir kural oluşturma adım-adım kılavuzu →](../user-guides/rules/wallarm-mode-rule.md)

!!! bilgi "Wallarm Bulutu ve filtreleme düğümü senkronizasyonu"
    Wallarm Konsolu'nda tanımlanan kurallar, Wallarm Bulutu ve filtreleme düğümünün senkronizasyon süreci sırasında uygulanır ve bu süreç her 2-4 dakikada bir gerçekleşir.

    [Filtreleme düğümü ve Wallarm Bulutu senkronizasyon konfigürasyonu hakkında daha fazla detay →](configure-cloud-node-synchronization-en.md)

### `wallarm_mode_allow_override` kullanarak filtreleme modu konfigürasyon yöntemlerinin önceliklerini ayarlama

!!! uyarı "`wallarm_mode_allow_override` yönergesinin CDN düğümündeki desteği"
    Lütfen `wallarm_mode_allow_override` yönergesinin [Wallarm CDN düğümlerinde](../installation/cdn-node.md) yapılandırılamayacağını unutmayın.

`wallarm_mode_allow_override` yönergesi, filtreleme düğümünün konfigürasyon dosyasındaki `wallarm_mode` yönerge değerlerini kullanmak yerine Wallarm Konsolu'nda tanımlanan kuralların uygulanabilirliğini yönetir.

`wallarm_mode_allow_override` yönergesi için geçerli olan aşağıdaki değerler bulunmaktadır:

* `off`: Wallarm Konsolu'nda belirtilen kurallar yoksayılır. Konfigürasyon dosyasındaki `wallarm_mode` yönergesi tarafından belirtilen kurallar uygulanır.
* `strict`: Konfigürasyon dosyasındaki `wallarm_mode` yönergesi tarafından belirlenenlerden daha sıkı filtreleme modlarını tanımlayan Wallarm Bulutu'nda belirtilen kurallar uygulanır.

    Mevcut filtrasyon modları, en yumuşaktan en sıkıya doğru sıralanarak [yukarıda](#available-filtration-modes) listelenmiştir.

* `on` (varsayılan): Wallarm Konsolu'nda belirtilen kurallar uygulanır. Konfigürasyon dosyasındaki `wallarm_mode` yönergesi tarafından belirtilen kurallar yoksayılır.

`wallarm_mode_allow_override` yönergesi değerinin tanımlanabileceği bağlamlar, en genel olanından en yerel olanına kadar, aşağıdaki listeye sunulmuştur:

* `http`: `http` bloğu içindeki yönergeler HTTP sunucusuna gönderilen isteklere uygulanır.
* `server`: `server` bloğu içindeki yönergeler sanal sunucuya gönderilen isteklere uygulanır.
* `location`: `location` bloğu içindeki yönergeler, sadece belirtilen yolu içeren isteklere uygulanır.

`http`, `server` ve `location` bloklarında farklı `wallarm_mode_allow_override` yönerge değerleri tanımlanırsa, en yerel yapılandırma en yüksek önceliğe sahip olur.

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

Bu konfigürasyon örneği, Wallarm Konsolu'ndan gelen filtrasyon modu kurallarının aşağıdaki uygulamaları ile sonuçlanır:

1. `SERVER_A` adlı sanal sunucuya gönderilen istekler için Wallarm Konsolu'nda belirlenen filtrasyon modu kuralları yoksayılır. `SERVER_A` sunucusuna karşılık gelen `server` bloğunda belirli `wallarm_mode` yönergesi yoktur, bu nedenle bu tür istekler için `http` bloğunda belirtilen `monitoring` filtreleme modu uygulanır.
2. Wallarm Konsolu'nda belirlenen filtrasyon modu kuralları, `/main/login` yolunu içermeyen istekler dışında `SERVER_B` adlı sanal sunucuya gönderilen isteklere uygulanır.
3. `SERVER_B` adlı sanal sunucuya gönderilen ve `/main/login` yolunu içeren isteklere, Wallarm Konsolu'nda belirlenen filtrasyon modu kuralları sadece `monitoring` modundan daha sıkı bir filtrasyon modu belirlediklerinde uygulanır.

## Filtrasyon modu konfigürasyon örneği

Yukarıda belirtilen tüm yöntemleri kullanan bir filtreleme modu konfigürasyonuna bir örnek verelim.

### Filtreleme düğümü konfigürasyon dosyasında filtrasyon modunu ayarlama

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
    }
}
```

### Wallarm Konsolu'nda filtreleme modunu ayarlama

* [Genel filtrasyon kuralı](#setting-up-the-general-filtration-rule-in-wallarm-console): **İzleme**.
* [Filtrasyon kuralları](#setting-up-the-filtration-rules-on-the-rules-tab):
    * İsteğin aşağıdaki koşulları karşılaması durumunda:
        * Yöntem: `POST`
        * Yolun ilk kısmı: `main`
        * Yolun ikinci kısmı: `apply`,
        
        o zaman **Varsayılan** filtreleme modu uygulanır.
        
    * İsteğin aşağıdaki koşulu karşılaması durumunda:
        * Yolun ilk kısmı: `main`,
        
        o zaman **Engelleme** filtreleme modu uygulanır.
        
    * İsteğin aşağıdaki koşulları karşılaması durumunda:
        * Yolun ilk kısmı: `main`
        * Yolun ikinci kısmı: `login`,
        
        o zaman **İzleme** filtreleme modu uygulanır.

### `SERVER_A` sunucusuna gönderilen isteklerin örnekleri

Yapılandırılmış `SERVER_A` sunucusuna gönderilen isteklerin örnekleri ve Wallarm filtreleme düğümünün bunlara hangi eylemleri uyguladığı aşağıdaki gibidir:

* `/news` yoluna sahip zararlı istek, `SERVER_A` sunucusu için `wallarm_mode monitoring;` ayarı nedeniyle işlenir ancak engellenmez.

* `/main` yoluna sahip zararlı istek, `SERVER_A` sunucusu için `wallarm_mode monitoring;` ayarı nedeniyle işlenir ancak engellenmez.

    Wallarm Konsolu'nda belirlenen **Engelleme** kuralı, `SERVER_A` sunucusu için `wallarm_mode_allow_override off;` ayarı nedeniyle uygulanmaz.

* `/main/login` yolu olan zararlı istek, `/main/login` yolundaki istekler için `wallarm_mode block;` ayarı nedeniyle engellenir.

    Wallarm Konsolu'nda belirlenen **İzleme** kuralı, filtreleme düğümü konfigürasyon dosyasında `wallarm_mode_allow_override strict;` ayarı nedeniyle uygulanmaz.

* `/main/signup` yoluna sahip zararlı istek, `wallarm_mode_allow_override strict;` set for the requests with the `/main/signup` path and the **Blocking** rule defined in Wallarm Console for the requests with the `/main` path.
* `/main/apply` yoluna ve `GET` yöntemine sahip zararlı istek, `wallarm_mode_allow_override on;` set for the requests with the `/main/apply` path and the **Blocking** rule defined in Wallarm Console for the requests with the `/main` path.
* `/main/apply` yoluna ve `POST` yöntemine sahip zararlı istek, `/main/apply` yoluna sahip istekler için `wallarm_mode_allow_override on;` ayarı, Wallarm Konsolu'nda belirlenen **Varsayılan** kuralı ve filtreleme düğümü konfigürasyon dosyasındaki `/main/apply` yolundaki istekler için `wallarm_mode block;` ayarını nedeniyle engellenir.

## Kademeli filtrasyon modu uygulaması üzerine en iyi uygulamalar

Yeni bir Wallarm düğümünü başarıyla devreye almak için, bu adım adım önerilere filtreleme modlarını değiştirme konusunda uyun:

1. İşlem modunu `monitoring` olarak ayarlayarak Wallarm filtreleme düğümlerini üretim dışı ortamlarınızda yerleştirin.
1. İşlem modunu `monitoring` olarak ayarlayarak Wallarm filtreleme düğümlerini üretim ortamınızda yerleştirin.
1. Wallarm bulut tabanlı uygulamanız hakkında biraz bilgi edinmesi için arka uçta biraz zaman tanımak üzere, tüm ortamlarınızdaki (test ve üretim dahil) filtreleme düğümleri aracılığıyla trafiği 7-14 gün boyunca akıtın.
1. Korumalı uygulamanın beklendiği gibi çalıştığını otomatik veya manuel testler ile doğrulayarak Wallarm'ın `block` modunu tüm üretim dışı ortamlarınızda etkinleştirin.
1. Uygulamanın beklendiği gibi çalıştığını doğrulayacak mevcut yöntemleri kullanarak Wallarm'ın `block` modunu üretim ortamında etkinleştirin.