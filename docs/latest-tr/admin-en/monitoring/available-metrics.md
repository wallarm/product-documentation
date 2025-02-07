```markdown
[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

#   Mevcut Metrikler

* [Metrik Formatı](#metric-format)
* [Wallarm Metrik Türleri](#types-of-wallarm-metrics)
* [NGINX Metrikleri ve NGINX Wallarm Module Metrikleri](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalytics Modül Metrikleri](#postanalytics-module-metrics)

## Metrik Formatı

`collectd` metrikleri aşağıdaki biçime sahiptir:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Metrik formatının ayrıntılı açıklamasına bu [link](../monitoring/intro.md#metrics-format) üzerinden ulaşabilirsiniz.

!!! note
    * Aşağıdaki mevcut metrikler listesinden, host adı (yani `host/` kısmı) atlanmıştır.
    * `collectd_nagios` yardımcı programı kullanılırken host adı atlanmalıdır. Host adı, `-H` parametresi kullanılarak ayrı olarak ayarlanır ([bu yardımcı programı kullanmaya dair detaylar][doc-nagios-details]).

## Wallarm Metrik Türleri

İzin verilen Wallarm metrik türleri aşağıda açıklanmıştır. Tür, `type` metrik parametresinde saklanır.

* `gauge`: Ölçülen değerin sayısal temsili. Değer artabilir veya azalabilir.

* `derive`: Önceki ölçümden bu yana ölçülen değerdeki değişim hızı (türetilmiş değer). Değer artabilir veya azalabilir.

* `counter`: `gauge` metriğine benzer. Değer yalnızca artabilir.

##  NGINX Metrikleri ve NGINX Wallarm Module Metrikleri 

### İstek Sayısı

Filtre düğümü kurulumundan bu yana işlenen tüm isteklerin sayısı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-abnormal`
* **Metrik değeri:**
    * `off` [modu](../configure-wallarm-mode.md#available-filtration-modes) için `0`
    * `monitoring`/`safe_blocking`/`block` [modu](../configure-wallarm-mode.md#available-filtration-modes) için `>0`
* **Sorun Giderme Önerileri:**
    1. Filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.
    2. [Kurulum kontrol talimatlarında](../installation-check-operation-en.md) belirtildiği üzere filtre düğümünün çalışmasını kontrol edin. Bir test saldırısı gönderildikten sonra değer `1` artmalıdır.

### Kayıp İstek Sayısı

Postanalytics modülü tarafından analiz edilmeyen ve Wallarm API'ye iletilmeyen istek sayısı. Bu isteklere bloklama kuralları uygulanır, ancak Wallarm hesabınızda görünmez ve sonraki isteklerin analizinde dikkate alınmaz. Bu sayı, [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] toplamıdır.

* **Metrik:** `curl_json-wallarm_nginx/gauge-requests_lost`
* **Metrik değeri:** [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] toplamı olan `0`
* **Sorun Giderme Önerileri:** [`tnt_errors`][anchor-tnt] ve [`api_errors`][anchor-api] için verilen talimatları izleyin.

#### Postanalytics Modülü Tarafından Analiz Edilmeyen İstek Sayısı

Postanalytics modülü tarafından analiz edilmeyen istek sayısı. Bu metrik, isteklerin postanalytics modülüne gönderilmesi yapılandırılmışsa toplanır ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)). Bu isteklere bloklama kuralları uygulanır, ancak Wallarm hesabınızda görünmez ve sonraki isteklerin analizinde dikkate alınmaz.

* **Metrik:** `curl_json-wallarm_nginx/gauge-tnt_errors`
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    * NGINX ve Tarantool loglarını alıp varsa hataları analiz edin.
    * Tarantool sunucu adresinin ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)) doğru ayarlandığını kontrol edin.
    * Tarantool için yeterli belleğin [ayrıldığını](../configuration-guides/allocate-resources-for-node.md#tarantool) doğrulayın.
    * Sorun çözülmezse [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçip yukarıdaki verileri sağlayın.

#### Wallarm API'ye İletilmeyen İstek Sayısı

Wallarm API'ye iletilmeyen istek sayısı. Bu metrik, isteklerin Wallarm API'ye gönderilmesi yapılandırılmışsa toplanır ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)). Bu isteklere bloklama kuralları uygulanır, ancak Wallarm hesabınızda görünmez ve sonraki isteklerin analizinde dikkate alınmaz.

* **Metrik:** `curl_json-wallarm_nginx/gauge-api_errors`
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    * NGINX ve Tarantool loglarını alıp varsa hataları analiz edin.
    * Wallarm API ayarlarının ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)) doğru olup olmadığını kontrol edin.
    * Tarantool için yeterli belleğin [ayrıldığını](../configuration-guides/allocate-resources-for-node.md#tarantool) doğrulayın.
    * Sorun çözülmezse [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçip yukarıdaki verileri sağlayın.

### NGINX Worker Sürecinin Anormal Şekilde Sonlanmasına Yol Açan Sorun Sayısı

NGINX worker sürecinin anormal sonlanmasına neden olan sorun sayısı. Anormal sonlanmanın en yaygın nedeni NGINX’de kritik bir hatadır.

* **Metrik:** `curl_json-wallarm_nginx/gauge-segfaults`
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    1. `/opt/wallarm/collect-info.sh` betiğini kullanarak mevcut durum ile ilgili veri toplayın.
    2. Soruşturma için oluşturulan dosyayı [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.

### Sanal Bellek Limitinin Aşıldığı Durum Sayısı

Sanal bellek limitinin aşıldığı durum sayısı.

* **Metrik:**
    * Sisteminizde limit aşıldığında `curl_json-wallarm_nginx/gauge-memfaults`
    * Proton.db +lom limiti aşıldığında `curl_json-wallarm_nginx/gauge-softmemfaults` ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    1. `/opt/wallarm/collect-info.sh` betiğini kullanarak mevcut durum ile ilgili veri toplayın.
    2. Oluşturulan dosyayı [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.

### proton.db Hatalarının Sayısı

[Virtual memory limit was exceeded](#number-of-situations-exceeding-the-virtual-memory-limit) durumları dışında oluşan proton.db hatalarının sayısı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-proton_errors`
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    1. NGINX loglarından hata kodunu kopyalayın (`wallarm: proton error: <ERROR_NUMBER>`).
    2. `/opt/wallarm/collect-info.sh` betiğini kullanarak mevcut durum ile ilgili veri toplayın.
    3. Toplanan verileri [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.

### proton.db Sürümü

Kullanılan proton.db sürümü.

* **Metrik:** `curl_json-wallarm_nginx/gauge-db_id`
* **Metrik değeri:** herhangi bir limit yok

### proton.db Dosyasının Son Güncellenme Zamanı

Proton.db dosyasının son güncellenme Unix zamanı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-db_apply_time`
* **Metrik değeri:** herhangi bir limit yok

### Custom Ruleset Sürümü (eski terimi LOM)

Kullanılan [custom ruleset'in][doc-lom] sürümü.

* **Metrik:** `curl_json-wallarm_nginx/gauge-custom_ruleset_id`

    (Wallarm node 3.4 ve öncesinde, `curl_json-wallarm_nginx/gauge-lom_id`. Eski isimli metrik hâlâ toplanıyor ancak yakın gelecekte kullanımdan kaldırılacak.)
* **Metrik değeri:** herhangi bir limit yok

### Custom Ruleset'in (eski terimi LOM) Son Güncellenme Zamanı

[Custom ruleset'in][doc-lom] son güncellenme Unix zamanı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-custom_ruleset_apply_time`

    (Wallarm node 3.4 ve öncesinde, `curl_json-wallarm_nginx/gauge-lom_apply_time`. Eski isimli metrik hâlâ toplanıyor ancak yakın gelecekte kullanımdan kaldırılacak.)
* **Metrik değeri:** herhangi bir limit yok

### proton.db ve LOM Çiftleri

#### Toplam proton.db ve LOM Çifti Sayısı

Kullanılan proton.db ve [LOM][doc-lom] çiftlerinin sayısı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-proton_instances-total`
* **Metrik değeri:** `>0`
* **Sorun Giderme Önerileri:**
    1. Filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.
    2. proton.db dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Başarıyla İndirilen proton.db ve LOM Çiftleri Sayısı

Başarıyla indirilip okunan proton.db ve [LOM][doc-lom] çiftlerinin sayısı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-proton_instances-success`
* **Metrik değeri:** [`proton_instances-total`](#number-of-protondb-and-lom-pairs) ile aynıdır
* **Sorun Giderme Önerileri:**
    1. Filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.
    2. proton.db dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Son Kaydedilen Dosyalardan İndirilen proton.db ve LOM Çiftleri Sayısı

Son başarıyla indirilen çiftlerin saklandığı dosyalardan indirilen proton.db ve [LOM][doc-lom] çiftlerinin sayısı. Çiftler güncellendiyse fakat indirilmediyse, son kaydedilen dosyalardan alınan veri kullanılır.

* **Metrik:** `curl_json-wallarm_nginx/gauge-proton_instances-fallback`
* **Metrik değeri:** `>0`
* **Sorun Giderme Önerileri:**
    1. Filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.
    2. proton.db dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Okunamayan proton.db ve LOM Çiftleri Sayısı

Okunamayan, bağlantısı kurulmuş proton.db ve [LOM][doc-lom] çiftlerinin sayısı.

* **Metrik:** `curl_json-wallarm_nginx/gauge-proton_instances-failed`
* **Metrik değeri:** `0`
* **Sorun Giderme Önerileri:**
    1. Filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.
    2. proton.db dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. LOM dosyasının yolunun doğru belirtildiğini kontrol edin ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

##  Postanalytics Modül Metrikleri

### Son İşlenen İsteğin Tanımlayıcısı

Son işlenen isteğin ID'si. Değer artabilir veya azalabilir.

* **Metrik:**
    * Değer arttığında `wallarm-tarantool/counter-last_request_id`
    * Değer artıp azalabilirse `wallarm-tarantool/gauge-last_request_id`
* **Metrik değeri:** herhangi bir limit yok
* **Sorun Giderme Önerileri:** Gelen istekler olmasına rağmen değer değişmiyorsa, filtre düğümü ayarlarının doğru olup olmadığını kontrol edin.

### Silinen İstekler

#### Silinen İsteklerin Göstergesi

Postanalytics modülünden saldırı içeren isteklerin silindiğine ama [cloud](../../about-wallarm/overview.md#cloud) gönderilmediğine dair bayrak.

* **Metrik:** `wallarm-tarantool/gauge-export_drops_flag`
* **Metrik değeri:**
    * İstekler silinmediyse `0`
    * İstekler silindiyse (yetersiz bellek, lütfen aşağıdaki talimatları izleyin) `1`
* **Sorun Giderme Önerileri:**
    * [Tarantool için daha fazla bellek ayırın](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü ayrı bir sunucu havuzuna kurun; ayrıntılar için [talimatlara](../installation-postanalytics-en.md) bakın.

#### Silinen İstek Sayısı

Postanalytics modülünden silinip [cloud](../../about-wallarm/overview.md#cloud) gönderilmeyen saldırı içeren isteklerin sayısı. İstek içindeki saldırı sayısı değeri etkilemez. Bu metrik, [`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests) olduğunda toplanır.

İzleme bildirimi yapılandırılırken [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) metriğinin kullanılması önerilir.

* **Metrik:** `wallarm-tarantool/gauge-export_drops`
* **Metrik değeri:** `0`
* **Değişim Hızı:** `wallarm-tarantool/derive-export_drops`
* **Sorun Giderme Önerileri:**
    * [Tarantool için daha fazla bellek ayırın](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü ayrı bir sunucu havuzuna kurun; ayrıntılar için [talimatlara](../installation-postanalytics-en.md) bakın.

### İstek Dışa Aktarma Gecikmesi (Saniye)

Postanalytics modülü tarafından bir isteğin kaydedilmesi ile Wallarm cloud’a tespit edilen saldırılara ilişkin bilgilerin indirilmesi arasındaki gecikme.

* **Metrik:** `wallarm-tarantool/gauge-export_delay`
* **Metrik değeri:**
    * `<60` ise optimal
    * `>60` ise uyarı
    * `>300` ise kritik
* **Sorun Giderme Önerileri:**
    * `/opt/wallarm/var/log/wallarm/wcli-out.log` dosyasındaki logları inceleyin. Artan değer, filtre düğümünden Wallarm'ın API servisine düşük ağ aktarım hızı nedeniyle oluşabilir.
    * Tarantool için yeterli belleğin [ayrıldığını](../configuration-guides/allocate-resources-for-node.md#tarantool) kontrol edin. [`tnt_errors`][anchor-tnt] metriği, ayrılan bellek aşıldığında da artar.

### Postanalytics Modülünde İsteklerin Saklanma Süresi (Saniye)

Postanalytics modülünde isteklerin saklandığı süre. Değer, postanalytics modülüne ayrılan bellek miktarına ve işlenen HTTP isteklerinin boyut ve özelliklerine bağlıdır. Aralık ne kadar kısa olursa, geçmiş verilere dayanan tespit algoritmaları o kadar kötü çalışır. Sonuç olarak, aralıklar çok kısa olursa saldırgan, kaba kuvvet saldırılarını daha hızlı ve fark edilmeden gerçekleştirebilir. Bu durumda, saldırganın geçmiş davranışlarına ilişkin daha az veri elde edilir.

* **Metrik:** `wallarm-tarantool/gauge-timeframe_size`
* **Metrik değeri:**
    * `>900` ise optimal
    * `<900` ise uyarı
    * `<300` ise kritik
* **Sorun Giderme Önerileri:**
    * [Tarantool için daha fazla bellek ayırın](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Postanalytics modülünü ayrı bir sunucu havuzuna kurun; ayrıntılar için [talimatlara](../installation-postanalytics-en.md) bakın.
```