[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

#  Kayıt Modunda Bir FAST (Hızlı Açık Kaynaklı Güvenlik Testi) Node'u Çalıştırma

Bu modda, FAST node, hedef uygulamayı test etmeden önce çalışır.

Taleplerin kaynağı FAST node'un bir proxy olarak kullanılmasını ve HTTP veya HTTPS taleplerini hedef uygulamaya göndermesini sağlar. 

FAST node, proxy edilenler arasında temel talepleri belirler ve bunları bir test kaydında saklar.

!!! info "Bölüm Önkoşulları"
    Bu bölümdeki adımları takip edebilmek için bir [tokene][doc-get-token] ihtiyacınız var.
    
    Bu bölüm boyunca aşağıdaki değerler örnek olarak kullanılmıştır:

    * `token_Qwe12345` bir token olarak.
    * `rec_0001` bir test kaydının kimliği olarak.

!!! info "`docker-compose` Yüklemeniz gerekiyor"
    Bu bölüm boyunca FAST node'un kayıt modunda nasıl çalıştığını göstermek için [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın yükleme talimatları [burada][link-docker-compose-install] bulunabilir.

## Kayıt Modunda Çevre Değişkenleri

FAST node yapılandırması çevre değişkenleri aracılığıyla yapılır. Aşağıdaki tablo, kayıt modunda bir FAST node'yu yapılandırmak için kullanılabilecek tüm çevre değişkenlerini içerir.

| Çevre Değişkeni | Değer  | Gerekli mi? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Node için bir token. | Evet |
| `WALLARM_API_HOST`   	| Kullanılacak Wallarm API sunucusunun alan adı. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` ABD bulutuyla kullanım için;<br>`api.wallarm.com` AB bulutuyla kullanım için.| Evet |
| `CI_MODE`            	| FAST node'un işletim modu. <br>Gerekli değer: `recording`. | Evet |
| `TEST_RECORD_NAME`   	| Oluşturulacak yeni bir test kaydının adı. <br>Varsayılan değer benzer bir biçimde: “TestRecord Oct 08 12:18 UTC”. | Hayır |
| `INACTIVITY_TIMEOUT` 	| Eğer FAST node'a herhangi bir temel talep, `INACTIVITY_TIMEOUT` aralığı içinde ulaşmazsa, kayıt işlemi ve FAST node durdurulur.<br>İzin verilen değer aralığı: 1 ile 691200 saniye arası (1 hafta)<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
| `ALLOWED_HOSTS`       | FAST node, bu çevre değişkeninde listelenen herhangi bir ana bilgisayara yönelik talepleri kaydeder. <br>Varsayılan değer: boş dizi (tüm gelen talepler kaydedilir). [Bu][doc-allowed-hosts] belgeye bakın.| Hayır |
| `BUILD_ID` | Bir CI/CD iş akışının kimliği. Bu kimlik, aynı bulut FAST node'unu kullanan birkaç FAST node'unun eş zamanlı çalışmasına izin verir. [Bu][doc-concurrent-pipelines] belgeye bakın.| Hayır |

!!! info "Ayrıca bakınız"
    Herhangi bir FAST node işleme moduna özgü olmayan çevre değişkenlerinin açıklamaları [burada][doc-env-variables] bulunabilir.

## Kayıt Modunda bir FAST Node'un Dağıtımı

Bir örnek `docker-compose.yaml` yapılandırma dosyası, FAST'ın kayıt modunda nasıl çalıştığını göstermek için kullanılacaktır (`CI_MODE` çevre değişkeninin değerine dikkat edin):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # Token değerini buraya girin
        WALLARM_API_HOST: us1.api.wallarm.com    # Burada ABD bulutu API sunucusu kullanılır. AB bulutu API sunucusu için api.wallarm.com kullanın.
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

FAST node içeren bir Docker konteynırını çalıştırmak için, `docker-compose.yaml` dosyasını içeren dizine gidin ve `docker-compose up fast` komutunu çalıştırın.

Eğer komut başarıyla çalıştırılırsa, aşağıdakine benzer bir konsol çıktısı üretilir:

```
  __      __    _ _
  \ \    / /_ _| | |__ _ _ _ _ __
   \ \/\/ / _` | | / _` | '_| '  \
    \_/\_/\__,_|_|_\__,_|_| |_|_|_|
             ___ _   ___ _____
            | __/_\ / __|_ _|
            | _/ _ \\__ \ | |
            |_/_/ \_\___/ |_||
 
 Yükleniyor...
 [info] Node, Wallarm Bulutuna bağlandı
 [info] Hızlı tarayıcı için 0 özel uzantı yüklendi
 [info] Hızlı tarayıcı için 44 varsayılan uzantı yüklendi
 [info] Test Record#rec_0001, TestRecord Oct 01 01:01 UTC kayda başladı

```

Bu çıktı, FAST node'un başarıyla Wallarm bulutuna bağlandığını ve `rec_0001` kimliği ve `TestRecord Oct 01 01:01 UTC` adıyla bir test kaydı oluşturduğunu bize bildirir. Talepleri almak ve temel talepleri kaydetmeye hazırdır.

!!! info "Test Kaydı Adları Hakkında Not"
    Varsayılan test kaydı adını değiştirmek için, FAST node'un Docker konteynırını başlatırken `TEST_RECORD_NAME` çevre değişkeni üzerinden gerekli değeri geçirmeniz gerekmektedir.

!!! warning "Test Uygulaması"
    Şimdi hedef uygulama için var olan testleri uygulamanın zamanıdır. FAST, temel talepleri kaydeder ve bunları test kaydıyla doldurur.

## Kayıt Modunda FAST Node ile Docker Konteynırının Durma ve Kaldırılması

Gerekli tüm temel talepler kaydedildiğinde, FAST node bir CI/CD aracı tarafından kapatılır ve bir çıkış kodu döner.

Eğer FAST node hiçbir hatayla karşılaşmaz ve temel kayıt süreci başarıyla tamamlanırsa, o zaman `0` çıkış kodu döner.

Eğer FAST node bazı hatalarla karşılaşırsa veya temel kayıt işlemi zaman aşımına uğradıysa (bkz. [`INACTIVITY_TIMEOUT`][anchor-recording-variables] çevre değişkeninin açıklaması), o zaman FAST node otomatik olarak durur ve `1` çıkış kodu döner.

FAST node işini bitirdiğinde, ilgili Docker konteynırı durdurulmalı ve kaldırılmalıdır.

Eğer FAST node otomatik olarak `1` çıkış koduyla durmaz ve gerekli tüm temel talepler kaydedilmişse, o zaman FAST node'un Docker konteynırını `docker-compose stop <konteynırın adı>` komutunu çalıştırarak durdurabilirsiniz:

```
docker-compose stop fast
```

FAST node'un konteynırını kaldırmak için, `docker-compose rm <konteynırın adı>` komutunu çalıştırın:

```
docker-compose rm fast
```

Yukarıdaki örneklerde, `fast` Docker konteynırını durdurmak veya kaldırmak için kullanılan konteynır adıdır.

Alternatif olarak, `docker-compose.yaml` dosyasında tanımlanan tüm hizmetler için konteynırları durdurup kaldıran `docker-compose down` komutunu kullanabilirsiniz.