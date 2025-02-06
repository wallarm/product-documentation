[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

#  Kayıt Modunda FAST Node Çalıştırma

Bu modda, FAST node hedef uygulama test edilmeden önce çalışır.

İstek kaynağı, FAST node'u proxy olarak kullanacak şekilde yapılandırılır ve hedef uygulamaya HTTP veya HTTPS istekleri gönderir.

FAST node, proxy yoluyla iletilen istekler arasından temel (baseline) istekleri belirler ve bunları bir test kaydına yerleştirir.

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları izleyebilmek için bir [token][doc-get-token] elde etmeniz gerekir.
    
    Bu bölüm boyunca aşağıdaki değerler örnek olarak kullanılmaktadır:

    * Token olarak `token_Qwe12345`.
    * Bir test kaydının tanımlayıcısı olarak `rec_0001`.

!!! info "`docker-compose` Kurulumu"
    Bu bölümde FAST node'un kayıt modunda nasıl çalıştığını göstermek için [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın kurulum talimatlarına [buradan][link-docker-compose-install] ulaşabilirsiniz.

## Kayıt Modunda Ortam Değişkenleri

FAST node yapılandırması ortam değişkenleri aracılığıyla yapılır. Aşağıdaki tabloda, kayıt modunda bir FAST node yapılandırmak için kullanılabilecek tüm ortam değişkenleri yer almaktadır.

| Ortam Değişkeni     | Değer  | Gerekli mi? |
|---------------------|--------|-------------|
| `WALLARM_API_TOKEN` | Bir node için token. | Evet |
| `WALLARM_API_HOST`  | Kullanılacak Wallarm API sunucusunun alan adı.<br>İzin verilen değerler: <br>`us1.api.wallarm.com` ABD bulutu kullanımı için;<br>`api.wallarm.com` AB bulutu kullanımı için.| Evet |
| `CI_MODE`           | FAST node'un çalışma modu.<br>Zorunlu değer: `recording`. | Evet |
| `TEST_RECORD_NAME`  | Oluşturulacak yeni test kaydının adı.<br>Varsayılan değer benzer formatta: “TestRecord Oct 08 12:18 UTC”. | Hayır |
| `INACTIVITY_TIMEOUT`| FAST node'a `INACTIVITY_TIMEOUT` süresi içinde hiç temel istek ulaşmazsa, kayıt işlemi FAST node ile birlikte durdurulur.<br>İzin verilen değer aralığı: 1 ile 691200 saniye (1 hafta)<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
| `ALLOWED_HOSTS`     | FAST node, bu ortam değişkeninde listelenen herhangi bir hedefe yönelik istekleri kaydedecektir.<br>Varsayılan değer: boş dize (tüm gelen istekler kaydedilecektir). Detaylar için [buna][doc-allowed-hosts] bakınız.| Hayır |
| `BUILD_ID`          | Bir CI/CD iş akışının tanımlayıcısı. Bu tanımlayıcı, aynı bulut FAST node'u kullanılarak birden fazla FAST node'un eşzamanlı çalışmasını sağlar. Detaylar için [buna][doc-concurrent-pipelines] bakınız.| Hayır |

!!! info "Ayrıca Bakınız"
    Belirli bir FAST node çalışma moduna özgü olmayan ortam değişkenlerinin açıklamaları [burada][doc-env-variables] mevcuttur.

## Kayıt Modunda FAST Node Dağıtımı

Aşağıdaki örnek `docker-compose.yaml` yapılandırma dosyası, FAST'in kayıt modunda nasıl çalıştığını göstermektedir (dikkat ediniz: `CI_MODE` ortam değişkeninin değeri):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # Token değerini buraya belirtin
        WALLARM_API_HOST: us1.api.wallarm.com    # Burada ABD bulut API sunucusu kullanılmaktadır. AB bulutu için api.wallarm.com kullanın.
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

FAST node içeren bir Docker konteynerini çalıştırmak için, `docker-compose.yaml` dosyasının bulunduğu dizine gidin ve `docker-compose up fast` komutunu çalıştırın.

Komut başarıyla çalıştırılırsa, aşağıda gösterilen konsol çıktısına benzer bir çıktı elde edilecektir:

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

Bu çıktı, FAST node'un Wallarm Cloud'a başarıyla bağlanıp, `rec_0001` tanımlayıcısı ve `TestRecord Oct 01 01:01 UTC` adı ile bir test kaydı oluşturduğunu gösterir. Node, istekleri almaya ve temel (baseline) istekleri kaydetmeye hazırdır.

!!! info "Test Kaydı İsimlerine Dair Not"
    Varsayılan test kaydı adını değiştirmek için, FAST node Docker konteyneri başlatılırken gerekli değeri `TEST_RECORD_NAME` ortam değişkeni aracılığıyla iletmeniz gerekmektedir.

!!! warning "Test Yürütme"
    Hedef uygulama için mevcut testlerin yürütülme zamanı gelmiştir. FAST, temel (baseline) istekleri kaydedecek ve test kaydını bunlarla dolduracaktır.

## Kayıt Modunda FAST Node İçeren Docker Konteynerinin Durdurulması ve Kaldırılması

Gerekli temel istekler kaydedildiğinde, CI/CD aracı FAST node'u kapatır ve bir çıkış kodu döndürür.

FAST node herhangi bir hata ile karşılaşmaz ve temel kayıt işlemi başarıyla tamamlanırsa, `0` çıkış kodu döndürülür.

FAST node bazı hatalarla karşılaşır veya temel kayıt işlemi `INACTIVITY_TIMEOUT` ortam değişkeninin [açıklamasında][anchor-recording-variables] belirtildiği gibi zaman aşımına uğrarsa, FAST node otomatik olarak durur ve `1` çıkış kodu döndürülür.

FAST node işini bitirdiğinde, ilgili Docker konteynerinin durdurulup kaldırılması gerekir.

FAST node `1` çıkış kodu ile otomatik olarak durdurulmazsa ve gerekli tüm temel istekler kaydedilmişse, FAST node'un Docker konteynerini `docker-compose stop <container's name>` komutunu çalıştırarak durdurabilirsiniz:

```
docker-compose stop fast
```

FAST node konteynerini kaldırmak için, `docker-compose rm <container's name>` komutunu çalıştırın:

```
docker-compose rm fast
```

Yukarıdaki örneklerde, `fast` Docker konteynerinin durdurulması veya kaldırılması için kullanılan isimdir.

Alternatif olarak, `docker-compose.yaml` dosyasında tanımlanan tüm servislerin konteynerlerini durduran ve kaldıran `docker-compose down` komutunu kullanabilirsiniz.