[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

#  FAST Düğümünü Kayıt Modunda Çalıştırma

Bu modda, FAST düğümü hedef uygulama test edilmeden önce çalışır.

İsteklerin kaynağı, FAST düğümünü bir proxy olarak kullanacak şekilde yapılandırılır ve HTTP veya HTTPS isteklerini hedef uygulamaya gönderir.

FAST düğümü, proxy üzerinden geçen istekler arasından temel (baseline) istekleri belirler ve bunları bir test kaydına yerleştirir. 

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları takip etmek için bir [token][doc-get-token] almanız gerekir.
    
    Aşağıdaki değerler bu bölüm boyunca örnek olarak kullanılmaktadır:

    * `token_Qwe12345` bir token olarak.
    * `rec_0001` bir test kaydının tanımlayıcısı olarak.

!!! info "`docker-compose` Kurulumu"
    FAST düğümünün kayıt modunda nasıl çalıştığını göstermek için bu bölüm boyunca [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın kurulum talimatları [burada][link-docker-compose-install] mevcuttur.

## Kayıt Modunda Ortam Değişkenleri

FAST düğümü yapılandırması ortam değişkenleri aracılığıyla yapılır. Aşağıdaki tabloda, FAST düğümünü kayıt modunda yapılandırmak için kullanılabilecek tüm ortam değişkenleri yer almaktadır.

| Ortam Değişkeni   | Değer  | Gerekli mi? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Bir düğüm için token. | Evet |
| `WALLARM_API_HOST`   	| Kullanılacak Wallarm API sunucusunun alan adı. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` US cloud için;<br>`api.wallarm.com` EU cloud için.| Evet |
| `CI_MODE`            	| FAST düğümünün çalışma modu. <br>Gerekli değer: `recording`. | Evet |
| `TEST_RECORD_NAME`   	| Oluşturulacak yeni test kaydının adı. <br>Varsayılan değer benzer bir biçimdedir: “TestRecord Oct 08 12:18 UTC”. | Hayır |
| `INACTIVITY_TIMEOUT` 	| Belirtilen `INACTIVITY_TIMEOUT` aralığı içinde FAST düğümüne hiçbir temel (baseline) istek ulaşmazsa, kayıt işlemi FAST düğümüyle birlikte durdurulur.<br>İzin verilen değer aralığı: 1 ile 691200 saniye (1 hafta)<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
| `ALLOWED_HOSTS`       | FAST düğümü, bu ortam değişkeninde listelenen herhangi bir ana bilgisayarı hedefleyen istekleri kaydeder. <br>Varsayılan değer: boş dize (tüm gelen istekler kaydedilir). Ayrıntılar için [şu][doc-allowed-hosts] belgeye bakın.| Hayır |
| `BUILD_ID` | Bir CI/CD iş akışının tanımlayıcısı. Bu tanımlayıcı, aynı bulut FAST düğümünü kullanarak birden fazla FAST düğümünün eşzamanlı çalışmasına olanak tanır. Ayrıntılar için [şu][doc-concurrent-pipelines] belgeye bakın.| Hayır |

!!! info "Ayrıca bakınız"
    Belirli bir FAST düğümü çalışma moduna özel olmayan ortam değişkenlerinin açıklamaları [burada][doc-env-variables] mevcuttur.

## Kayıt Modunda FAST Düğümünün Dağıtımı

FAST’in kayıt modunda nasıl çalıştığını göstermek için örnek bir `docker-compose.yaml` yapılandırma dosyası kullanılacaktır (`CI_MODE` ortam değişkeninin değerine dikkat edin):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # Token değerini burada belirtin
        WALLARM_API_HOST: us1.api.wallarm.com    # Burada US cloud API sunucusu kullanılmaktadır. EU cloud API sunucusu için api.wallarm.com kullanın.
        CI_MODE: recording
      ports:
        - '8080:8080'                              
      networks:
        main:
          aliases:
            - fast

networks:
  main:
```

FAST düğümünü içeren bir Docker konteynerini çalıştırmak için `docker-compose.yaml` dosyasının bulunduğu dizine gidin ve `docker-compose up fast` komutunu çalıştırın.

Komut başarıyla çalışırsa, aşağıdakine benzer bir konsol çıktısı oluşacaktır:

```
  __      __    _ _
  \ \    / /_ _| | |__ _ _ _ _ __
   \ \/\/ / _` | | / _` | '_| '  \
    \_/\_/\__,_|_|_\__,_|_| |_|_|_|
             ___ _   ___ _____
            | __/_\ / __|_   _|
            | _/ _ \\__ \ | |
            |_/_/ \_\___/ |_|
 
 Loading...
 [info] Node connected to Wallarm Cloud
 [info] Loaded 0 custom extensions for fast scanner
 [info] Loaded 44 default extensions for fast scanner
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC starts to record

```

Bu çıktı, FAST düğümünün Wallarm Cloud’a başarıyla bağlandığını ve `rec_0001` tanımlayıcısına ve `TestRecord Oct 01 01:01 UTC.` adına sahip bir test kaydı oluşturduğunu bildirir. İstekleri almaya ve temel (baseline) istekleri kaydetmeye hazırdır.

!!! info "Test Kayıt Adları Hakkında Not"
    Varsayılan test kayıt adını değiştirmek için FAST düğümü Docker konteynerini başlatırken gerekli değeri `TEST_RECORD_NAME` ortam değişkeni üzerinden iletmeniz gerekir.

!!! warning "Test Yürütme"
    Şimdi hedef uygulama için mevcut testleri yürütme zamanı. FAST, temel (baseline) istekleri kaydedecek ve test kaydını bunlarla dolduracaktır.

## Kayıt Modunda FAST Düğümünü İçeren Docker Konteynerini Durdurma ve Kaldırma

Gerekli tüm temel (baseline) istekler kaydedildiğinde, FAST düğümü bir CI/CD aracı tarafından kapatılır ve bir çıkış kodu döndürür.

FAST düğümü hata ile karşılaşmaz ve temel kayıt işlemi başarıyla tamamlanırsa `0` çıkış kodu döndürülür.

FAST düğümü bazı hatalarla karşılaşırsa veya zaman aşımı nedeniyle temel kayıt işlemi durdurulursa ([`INACTIVITY_TIMEOUT`][anchor-recording-variables] ortam değişkeninin açıklamasına bakın), FAST düğümü otomatik olarak durur ve `1` çıkış kodu döndürülür.

FAST düğümü işini tamamladığında, ilgili Docker konteynerinin durdurulması ve kaldırılması gerekir.

FAST düğümü `1` çıkış koduyla otomatik olarak durdurulmamışsa ve gerekli tüm temel istekler kaydedilmişse, `docker-compose stop <container'ın adı>` komutunu çalıştırarak FAST düğümünün Docker konteynerini durdurabilirsiniz:

```
docker-compose stop fast
```

FAST düğümünün konteynerini kaldırmak için `docker-compose rm <container'ın adı>` komutunu çalıştırın:

```
docker-compose rm fast
```

Yukarıdaki örneklerde, durdurulacak veya kaldırılacak Docker konteynerinin adı olarak `fast` kullanılmıştır.

Alternatif olarak, `docker-compose.yaml` dosyasında tanımlanan tüm servislerin konteynerlerini durduran ve kaldıran `docker-compose down` komutunu kullanabilirsiniz.