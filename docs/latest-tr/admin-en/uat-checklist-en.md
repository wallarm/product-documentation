[ptrav-attack-docs]:             ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart.png

# Düğüm Dağıtımından Sonra Wallarm Sağlık Kontrolü

Bu belge, yeni bir filtreleme düğümü dağıtımından sonra Wallarm’ın doğru çalıştığından emin olmak için bir kontrol listesi sunar. Bu prosedürü mevcut herhangi bir düğümün sağlık durumunu test etmek için de kullanabilirsiniz.

!!! info "Sağlık kontrolü sonuçları"
    Beklenen sonuç ile gerçek sonuç arasındaki fark, düğümün işleyişinde bir sorun işareti olabilir. Bu tür farklılıklara özel dikkat göstermeniz ve gerekirse yardım için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçmeniz önerilir.

## Düğüm Cloud'a kayıtlı

Kontrol etmek için:

1. Wallarm Console → **Configuration** → **Nodes**'u açın.
1. Yalnızca aktif düğümleri görmek için filtre uygulayın.
1. Listenizde düğümünüzü bulun. Ayrıntıları görmek için tıklayın.

## Düğüm saldırıları kaydeder {#node-registers-attacks}

Kontrol etmek için:

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Düğüm tüm trafiği kaydeder {#node-registers-all-traffic}

Trafiğinizin tam görünürlüğünü sağlamak için, Wallarm’ın [API Sessions](../api-sessions/overview.md) özelliği tüm istekleri – kötü amaçlı ve meşru – adım adım kullanıcı oturumları biçiminde görüntüler.

Kontrol etmek için:

1. Düğümünüz tarafından korunan kaynağa bir istek gönderin:

      ```
      curl http://<resource_URL>
      ```

      Veya bir bash betiği ile birkaç istek gönderin:

      ```
      for (( i=0 ; $i<10 ; i++ )) ;
      do 
         curl http://<resource_URL> ;
      done
      ```

      Bu örnek 10 istek içindir.

1. **Events** → **API Sessions**'ı açın.
1. İsteklerinizin ve daha önce gönderdiğiniz saldırının bulunduğu oturumu bulun – hepsi tek bir oturumda.

## Düğüm istatistik hizmeti çalışıyor {#node-statistics-service-works}

Filtreleme düğümünün çalışma istatistiklerini `/wallarm-status` URL’ine istek göndererek alabilirsiniz.

!!! info "İstatistik hizmeti"
    İstatistik hizmeti ve nasıl yapılandırılacağı hakkında daha fazla bilgiyi [buradan](../admin-en/configure-statistics-service.md) okuyabilirsiniz.

Kontrol etmek için:

1. Düğümün kurulu olduğu makinede şu komutu çalıştırın:

      ```
      curl http://127.0.0.8/wallarm-status
      ```

1. Çıktıyı kontrol edin. Şuna benzer olmalıdır:

      ```json
      {
            "requests": 11,
            "streams": 0,
            "messages": 0,
            "attacks": 1,
            "blocked": 0,
            "blocked_by_acl": 0,
            "blocked_by_antibot": 0,
            "acl_allow_list": 0,
            "abnormal": 11,
            "tnt_errors": 0,
            "api_errors": 0,
            "requests_lost": 0,
            "overlimits_time": 0,
            "segfaults": 0,
            "memfaults": 0,
            "softmemfaults": 0,
            "proton_errors": 0,
            "time_detect": 0,
            "db_id": 199,
            "lom_id": 1726,
            "custom_ruleset_id": 1726,
            "custom_ruleset_ver": 56,
            "db_apply_time": 1750365841,
            "lom_apply_time": 1750365842,
            "custom_ruleset_apply_time": 1750365842,
            "proton_instances": {
                  "total": 2,
                  "success": 2,
                  "fallback": 0,
                  "failed": 0
            },
            "stalled_workers_count": 0,
            "stalled_workers": [],
            "ts_files": [
            {
                  "id": 1726,
                  "size": 11887,
                  "mod_time": 1750365842,
                  "fname": "/opt/wallarm/etc/wallarm/custom_ruleset"
            }
            ],
            "db_files": [
            {
                  "id": 199,
                  "size": 355930,
                  "mod_time": 1750365841,
                  "fname": "/opt/wallarm/etc/wallarm/proton.db"
            }
            ],
            "startid": 2594491974706159096,
            "compatibility": 4,
            "config_revision": 0,
            "rate_limit": {
            "shm_zone_size": 67108864,
            "buckets_count": 2,
            "entries": 0,
            "delayed": 0,
            "exceeded": 0,
            "expired": 0,
            "removed": 0,
            "no_free_nodes": 0
            },
            "timestamp": 1750371146.209885,
            "split": {
            "clients": [
                  {
                  "client_id": null,
                  "requests": 11,
                  "streams": 0,
                  "messages": 0,
                  "attacks": 1,
                  "blocked": 0,
                  "blocked_by_acl": 0,
                  "blocked_by_antibot": 0,
                  "overlimits_time": 0,
                  "time_detect": 0,
                  "applications": [
                  {
                        "app_id": -1,
                        "requests": 11,
                        "streams": 0,
                        "messages": 0,
                        "attacks": 1,
                        "blocked": 0,
                        "blocked_by_acl": 0,
                        "blocked_by_antibot": 0,
                        "overlimits_time": 0,
                        "time_detect": 0
                  }
                  ]
                  }
            ]
            }
      }
      ```

      Bu, filtreleme düğümü istatistik hizmetinin çalıştığı ve düzgün çalıştığı anlamına gelir.

## Düğüm günlükleri toplanıyor {#node-logs-are-collected}

Kontrol etmek için:

1. Düğümün kurulu olduğu makinede `/opt/wallarm/var/log/wallarm` dizinine gidin.
1. `wcli-out.log` içindeki verileri kontrol edin: brute force tespiti, saldırıların Cloud’a aktarımı ve düğümün Cloud ile senkronizasyon durumu dahil olmak üzere çoğu Wallarm hizmetinin günlükleri.

Diğer günlükler ve günlük yapılandırmasıyla ilgili ayrıntılar için [buraya](../admin-en/configure-logging.md) bakın.

## Düğüm güvenlik açıklarını kaydeder

Wallarm, uygulama API’lerinizdeki [güvenlik açıklarını](../glossary-en.md#vulnerability) tespit eder.

Kontrol etmek için:

1. Kaynağınıza bir istek gönderin:

      ```
      curl <RECOURSE_URL> -H 'jwt: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJjbGllbmRfaWQiOiIxIn0.' -H 'HOST: <TEST_HOST_NAME>'
      ```

      Ana makine için zaten bir [weak JWT](../attacks-vulns-list.md#weak-jwt) güvenlik açığınız varsa (herhangi bir durumda, kapalı olsa bile), yeni güvenlik açığının kaydedildiğini görmek için farklı bir `TEST_HOST_NAME` belirtmeniz gerekir.

1. Zayıf JWT güvenlik açığının listelenip listelenmediğini kontrol etmek için Wallarm Console → **Events** → **Vulnerabilities**'i açın.

## IP listeleri çalışıyor

Wallarm’da, isteklerin geldiği IP adreslerini Allowlist, Denylist ve Graylist’e alarak uygulama API’lerinize erişimi kontrol edebilirsiniz. IP listelerinin temel mantığını [burada](../user-guides/ip-lists/overview.md) öğrenin.

Kontrol etmek için:

1. Wallarm Console → **Events** → **Attacks**'ı açın ve [Düğüm saldırıları kaydeder](#node-registers-attacks) kontrolü sırasında oluşturduğunuz saldırıyı bulun.
1. Saldırının kaynak IP’sini kopyalayın.
1. Security Controls → **IP Lists** → **Allowlist**'e gidin ve kopyaladığınız kaynak IP’yi bu listeye ekleyin.
1. Yeni IP list durumu filtreleme düğümüne yüklenene kadar bekleyin (yaklaşık 2 dakika).
1. Aynı saldırıyı bu IP’den tekrar gönderin. **Attacks** içinde hiçbir şey görünmemelidir.
1. IP’yi **Allowlist**'ten kaldırın.
1. IP’yi **Denylist**'e ekleyin.
1. [Düğüm tüm trafiği kaydeder](#node-registers-all-traffic) adımındaki gibi meşru istekler gönderin. Bu istekler (meşru olsalar bile) **Attacks** içinde engellenmiş olarak görünmelidir.

## Kurallar çalışıyor

Wallarm’da, sistemin kötü amaçlı istekleri nasıl tespit ettiğini ve bu tür kötü amaçlı istekler tespit edildiğinde nasıl davrandığını değiştirmek için [kurallar](../user-guides/rules/rules.md) kullanabilirsiniz. Kuralları Wallarm Console üzerinden Cloud’da oluşturursunuz, özel kurallar kümenizi oluştururlar, ardından Cloud bunları filtreleme düğümüne gönderir ve çalışmaya başlarlar.

Kontrol etmek için:

1. Aşağıdaki yöntemlerden birini kullanarak geçerli özel kurallar kümesi kimliğini (ID) ve tarihini kontrol edin:

      * Wallarm Console → **Configuration** → **Nodes** içinde, düğüm ayrıntılarınıza erişin ve custom_ruleset kimlik numarası ile kurulum zamanını not edin.
      * [Düğüm istatistiklerinde](#node-statistics-service-works) `custom_ruleset_id` ve `custom_ruleset_apply_time` değerlerini not edin.
      * `wcli-out.log` [düğüm günlüğünde](#node-logs-are-collected), `"lom"` içeren son satırı not edin, o satırdaki `version` ve `time` değerlerine dikkat edin.

1. **Security Controls** → **Rules**’a gidin.
1. **Add rule** → **Fine-tuning attack detection** → **Ignore certain attacks**'i kullanın, isteğin `uri` bölümünde **Path traversal**'ı yok saymayı seçin ve ardından kuralı oluşturun.
1. İlk adımdaki verilerin güncellendiğini kontrol edin (2-4 dakika sürebilir).
1. [Düğüm saldırıları kaydeder](#node-registers-attacks) kontrolündeki saldırıyı tekrarlayın. Artık bu saldırı yok sayılmalı ve **Attacks** içinde görüntülenmemelidir.
1. Kuralı silin.