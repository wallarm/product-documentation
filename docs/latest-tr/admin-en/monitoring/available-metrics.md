[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

#   Kullanılabilir Metrikler

* [Metrik Formatı](#metric-format)
* [Wallarm Metrik Türleri](#types-of-wallarm-metrics)
* [NGINX Metrikleri ve NGINX Wallarm Modül Metrikleri](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalytics Modül Metrikleri](#postanalytics-module-metrics)

!!! warning "Silinen metrikler nedeniyle kırılma değişiklikleri"
    Sürüm 4.0'dan itibaren, Wallarm düğümü aşağıdaki metrikleri toplamaz:
    
    * `wallarm_nginx/gauge-requests` - bunun yerine [`wallarm_nginx/gauge-abnormal`](#number-of-requests) metriğini kullanabilirsiniz
    * `wallarm_nginx/gauge-attacks`
    * `wallarm_nginx/gauge-blocked`
    * `wallarm_nginx/gauge-time_detect`
    * `wallarm_nginx/derive-requests`
    * `wallarm_nginx/derive-attacks`
    * `wallarm_nginx/derive-blocked`
    * `wallarm_nginx/derive-abnormal`
    * `wallarm_nginx/derive-requests_lost`
    * `wallarm_nginx/derive-tnt_errors`
    * `wallarm_nginx/derive-api_errors`
    * `wallarm_nginx/derive-segfaults`
    * `wallarm_nginx/derive-memfaults`
    * `wallarm_nginx/derive-softmemfaults`
    * `wallarm_nginx/derive-time_detect`

## Metrik Formatı

`collectd` metriklerinin görünümü aşağıdaki gibidir:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Metrik formatının ayrıntılı açıklaması bu [bağlantı](../monitoring/intro.md#how-metrics-look) mevcuttur.

!!! note
    * Aşağıda yer alan kullanılabilir metrikler listesinde, ana bilgisayar adı (the `host/` parçası) yoktur.
    * `collectd_nagios` yardımcı programını kullanırken, ana bilgisayar adının çıkarılması gerekir. Bu,  `-H` parametresini kullanarak ayrı olarak ayarlanır ([bu yardımcı programın kullanımına dair daha fazla bilgi][doc-nagios-details]).

## Wallarm Metrik Türleri

İzin verilen Wallarm metrik türleri aşağıda açıklanmıştır. Tür, `type` metrik parametresinde saklanır.

* `gauge` ölçülen değerin sayısal temsilidir. Değer hem artabilir hem de azalabilir.

* `derive` önceki ölçüme göre ölçülen değerin değişim hızıdır (türetilmiş değer). Değer hem artabilir hem de azalabilir.

* `counter` `gauge` metriğine benzer. Değer yalnızca artabilir.

##  NGINX Metrikleri ve NGINX Wallarm Modül Metrikleri 

### Talep Sayısı

Filtre düğümünün yüklemesinden bu yana işlenen tüm taleplerin sayısı.

* **Metrik:** `wallarm_nginx/gauge-abnormal`
* **Metrik değeri:**
    * `0` `off` [modu](../configure-wallarm-mode.md#available-filtration-modes) için
    * `>0`  `monitoring`/`safe_blocking`/`block` [modu](../configure-wallarm-mode.md#available-filtration-modes) için
* **Hata Ayıklama Önerileri:**
    1. Filtre düğümü ayarlarının doğru olduğunu kontrol edin.
    2. Filtre düğümünün işlemesini [talimatlara](../installation-check-operation-en.md) göre kontrol edin. Bir test saldırısı gönderildikten sonra değerin `1` artması gerekir.

### Kaybolan Taleplerin Sayısı

Postanalytics modülü tarafından analiz edilmeyen ve Wallarm API'ye geçmeyen taleplerin sayısı. Bu taleplere engelleme kuralları uygulanır, ancak talepler Wallarm hesabınızda görünmez ve sonraki talepleri analiz ederken dikkate alınmaz. Sayı, [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] toplamıdır.

* **Metrik:** `wallarm_nginx/gauge-requests_lost`
* **Metrik değeri:** `0`, [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] toplamı
* **Hata Ayıklama Önerileri:** [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] için talimatları uygulayın

#### Postanalytics Modülü Tarafından Analiz Edilmeyen Taleplerin Sayısı

Postanalytics modülü tarafından analiz edilmeyen taleplerin sayısı. Bu metrik, taleplerin postanalytics modülüne gönderilmesi yapılandırıldığında ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)) toplanır. Bu taleplere engelleme kuralları uygulanır, ancak talepler Wallarm hesabınızda görünmez ve sonraki talepleri analiz ederken dikkate alınmaz.

* **Metrik:** `wallarm_nginx/gauge-tnt_errors`
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    * NGINX ve Tarantool günlüklerini alın ve hataları analiz edin.
    * Tarantool sunucu adresinin ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)) doğru olup olmadığını kontrol edin.
    * Tarantool için yeterli belleğin [atandığından](../configuration-guides/allocate-resources-for-node.md#tarantool) emin olun.
    * Sorun çözülmezse, yukarıdaki verileri [Wallarm destek ekibine](mailto:support@wallarm.com) sağlayın.

#### Wallarm API'sine Geçmeyen Taleplerin Sayısı

Wallarm API'ye geçmeyen taleplerin sayısı. Bu metrik, Wallarm API'ye taleplerin geçmesi yapılandırıldığında ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)) toplanır. Bu taleplere engelleme kuralları uygulanır, ancak talepler Wallarm hesabınızda görünmez ve sonraki talepleri analiz ederken dikkate alınmaz.

* **Metrik:** `wallarm_nginx/gauge-api_errors`
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    * NGINX ve Tarantool günlüklerini alın ve hataları analiz edin.
    * Wallarm API ayarlarının ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)) doğru olup olmadığını kontrol edin.
    * Tarantool için yeterli belleğin [atandığından](../configuration-guides/allocate-resources-for-node.md#tarantool) emin olun.
    * Sorun çözülmezse, yukarıdaki verileri [Wallarm destek ekibine](mailto:support@wallarm.com) sağlayın.

### Anormal Tamamlanan NGINX İşleyici Süreci Sorunlarının Sayısı 

Anormal tamamlamanın en yaygın nedeni NGINX'teki kritik bir hatadır.

* **Metrik:** `wallarm_nginx/gauge-segfaults`
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    1. Mevcut durum hakkında veri toplamak için `/usr/share/wallarm-common/collect-info.sh` scriptini kullanın.
    2. Oluşturulan dosyayı [Wallarm destek ekibi](mailto:support@wallarm.com)'ne inceleme için sağlayın.

### Sanal Bellek Sınırının Aşıldığı Durumların Sayısı

Sanal bellek sınırının aşıldığı durumların sayısı.

* **Metrik:**
    * `wallarm_nginx/gauge-memfaults` eğer sistem sınırlarını aştıysa
    * `wallarm_nginx/gauge-softmemfaults` eğer proton.db +lom limiti aşıldıysa ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    1. Mevcut durum hakkında veri toplamak için `/usr/share/wallarm-common/collect-info.sh` scriptini kullanın.
    2. Oluşturulan dosyayı [Wallarm destek ekibine](mailto:support@wallarm.com) iletilmesi için sağlayın.

### proton.db Hatalarının Sayısı

[Sanal bellek limitinin aşıldığı](#number-of-situations-exceeding-the-virtual-memory-limit) durumlar dışında ortaya çıkan proton.db hatalarının sayısı.

* **Metrik:** `wallarm_nginx/gauge-proton_errors`
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    1. NGINX günlüklerinden hata kodunu kopyalayın (`wallarm: proton error: <HATA_NUMARASI>`).
    1. Mevcut durum hakkında veri toplamak için `/usr/share/wallarm-common/collect-info.sh` scriptini kullanın.
    1. Topladığınız verileri [Wallarm destek ekibine](mailto:support@wallarm.com) iletilmesi için sağlayın.

### proton.db Versiyonu

Kullanılan proton.db versiyonu.

* **Metrik:** `wallarm_nginx/gauge-db_id`
* **Metrik değeri:** sınırlama yok

### son güncelleme zamanı proton.db dosyasının

proton.db dosyasının son güncelleme Unix zamanı.

* **Metrik:** `wallarm_nginx/gauge-db_apply_time`
* **Metrik değeri:** sınırlama yok 

### Özel Kural Seti Versiyonu (eski adı LOM)

Kullanılan [özel kural seti][doc-lom] versiyonu

* **Metrik:** `wallarm_nginx/gauge-custom_ruleset_id`

    (Wallarm düğümü 3.4 ve altında, `wallarm_nginx/gauge-lom_id`. Eski adıyla metrik hala toplanıyor ancak yakında kullanımdan kalkacak.)
* **Metrik değeri:** sınırlama yok

### Özel Kural Setinin Son Güncellenme Zamanı (eski adı LOM)

[Özel kural seti][doc-lom] son güncelleme Unix zamanı 

* **Metrik:** `wallarm_nginx/gauge-custom_ruleset_apply_time`

    (Wallarm düğümü 3.4 ve altında, `wallarm_nginx/gauge-lom_apply_time`. Eski adıyla metrik hala toplanıyor ancak yakında kullanımdan kalkacak.)
* **Metrik değeri:** sınırlama yok

### proton.db ve LOM Çiftleri

#### proton.db ve LOM çiftlerinin Sayısı

Kullanılan proton.db ve [LOM][doc-lom] çiftlerinin sayısı.

* **Metrik:** `wallarm_nginx/gauge-proton_instances-total`
* **Metrik değeri:** `>0`
* **Hata Ayıklama Önerileri:**
    1. Filtre düğümü ayarlarının doğru olduğunu kontrol edin.
    2. proton.db dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Başarıyla İndirilen proton.db ve LOM Çiftlerinin Sayısı

Başarıyla indirilen ve okunan proton.db ve [LOM][doc-lom] çiftlerinin sayısı

* **Metrik:** `wallarm_nginx/gauge-proton_instances-success`
* **Metrik değeri:** [`proton_instances-total`](#number-of-protondb-and-lom-pairs) ile eşit
* **Hata Ayıklama Önerileri:**
    1. Filtre düğümü ayarlarının doğru olduğunu kontrol edin.
    2. proton.db dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Son Kaydedilen Dosyalardan İndirilen proton.db ve LOM Çiftlerinin Sayısı

Son kaydedilen dosyalardan indirilen proton.db ve [LOM][doc-lom] çiftlerinin sayısı. Bu dosyalar son başarıyla indirilen çiftleri saklar. Çiftler güncellendi ancak indirilmediyse, son kaydedilen dosyaların verileri kullanılır.

* **Metrik:** `wallarm_nginx/gauge-proton_instances-fallback`
* **Metrik değeri:** `>0`
* **Hata Ayıklama Önerileri:**
    1. Filtre düğümü ayarlarının doğru olduğunu kontrol edin.
    2. proton.db dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Aktif Olmayan proton.db ve LOM Çiftlerinin Sayısı

Okunamayan yönlendirilmemiş proton.db ve [LOM][doc-lom] çiftlerinin sayısı.

* **Metrik:** `wallarm_nginx/gauge-proton_instances-failed`
* **Metrik değeri:** `0`
* **Hata Ayıklama Önerileri:**
    1. Filtre düğümü ayarlarının doğru olduğunu kontrol edin.
    2. proton.db dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasına giden yolun doğru belirtildiğinden emin olun ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

##  Postanalytics Modül Metrikleri

### Son İşlenen İsteğin Kimliği

Son işlenen talebin kimliği. Değer artabilir ve azalabilir.

* **Metrik:**
    * `wallarm-tarantool/counter-last_request_id` eğer değer artıyorsa
    * `wallarm-tarantool/gauge-last_request_id` eğer değer artıyor veya azalıyorsa
* **Metrik değeri:** sınırlama yok
* **Hata Ayıklama Önerileri:** gelen talepler varsa ancak değer değişmiyorsa, filtre düğümü ayarlarının doğru olduğundan emin olun

### Silinen Talepler

#### Silinen Taleplerin Göstergesi

Saldırılarla ilgili taleplerin postanalytics modülünden silindiğine, ancak [buluta](../../about-wallarm/overview.md#cloud) gönderilmediğine dair bayrak.

* **Metrik:** `wallarm-tarantool/gauge-export_drops_flag`
* **Metrik değeri:**
    * `0` eğer talepler silinmediyse
    * `1` eğer talepler silindi (yetersiz bellek, lütfen aşağıdaki talimatları izleyin)
* **Hata Ayıklama Önerileri:**
    * [Tarantool için daha fazla bellek tahsis edin](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü aşağıdaki [talimatlara](../installation-postanalytics-en.md) göre ayrı bir sunucu havuzunda yükleyin.

#### Silinen Taleplerin Sayısı

Saldırılarla ilgili taleplerin postanalytics modülünden silindiği, ancak [buluta](../../about-wallarm/overview.md#cloud) gönderilmediği sayısı. Talepteki saldırıların sayısı değeri etkilemez. Metrik, [`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests) olduğunda toplanır.

Monitoring bildirimlerini yapılandırırken [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) metriğini kullanmanız önerilir.

* **Metrik:** `wallarm-tarantool/gauge-export_drops`
* **Metrik değeri:** `0`
* **Değişim oranı:** `wallarm-tarantool/derive-export_drops`
* **Hata Ayıklama Önerileri:**
    * [Tarantool için daha fazla bellek tahsis edin](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü aşağıdaki [talimatlara](../installation-postanalytics-en.md) göre ayrı bir sunucu havuzunda yükleyin.

### Talep Aktarım Gecikmesi (saniye cinsinden)

Postanalytics modülü tarafından bir talebin kaydedilmesi ve saldırı bilgilerinin Wallarm bulutuna indirilmesi arasındaki gecikme.

* **Metrik:** `wallarm-tarantool/gauge-export_delay`
* **Metrik değeri:**
    * optimal eğer `<60`
    * uyarı eğer `>60`
    * kritik eğer `>300`
* **Hata Ayıklama Önerileri:**
    * `/var/log/wallarm/export-attacks.log` dosyasından günlükleri okuyun ve hataları analiz edin. Artan bir değer, filtre düğümünden Wallarm’ın API servisine düşük ağ veriminden kaynaklanabilir.
    * Tarantool için yeterli belleğin [atandığından](../configuration-guides/allocate-resources-for-node.md#tarantool) emin olun. Ayrılan bellek aşıldığında [`tnt_errors`][anchor-tnt] metriği de artar.

### Postanalytics Modülünde Taleplerin Saklanma Süresi (saniye cinsinden)

Postanalytics modülünün talepleri saklama süresi. Değer, postanalytics modülüne tahsis edilen bellek miktarına ve işlenen HTTP taleplerinin boyutuna ve özelliklerine bağlıdır. İnterval ne kadar kısa olursa, algılama algoritmaları o kadar kötü çalışır; çünkü tarihsel verilere dayanır. Sonuç olarak, aralıklar çok kısa olursa, saldırgan fark edilmeden daha hızlı kaba kuvvet saldırıları gerçekleştirebilir. Bu durumda, saldırganın davranış geçmişi hakkında daha az veri elde edilir.

* **Metrik:** `wallarm-tarantool/gauge-timeframe_size`
* **Metrik değeri:**
    * optimal eğer `>900`
    * uyarı eğer `<900`
    * kritik eğer `<300`
* **Hata Ayıklama Önerileri:**
    * [Tarantool için daha fazla bellek tahsis edin](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü aşağıdaki [talimatlara](../installation-postanalytics-en.md) göre ayrı bir sunucu havuzunda yükleyin.