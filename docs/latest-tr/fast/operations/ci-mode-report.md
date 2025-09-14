[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# Test Sonuçlarıyla Raporu Alma

FAST node, test sonuçlarını TXT ve JSON biçimlerinde almanıza olanak tanır:

* TXT dosyası, kısa test sonuçlarını — temel istatistikleri ve tespit edilen zafiyetlerin listesini — içerir.
* JSON dosyası ayrıntılı test sonuçlarını — güvenlik testi ve temel isteklerin ayrıntılarını ve ayrıca tespit edilen zafiyetlerin listesini — içerir. JSON dosyası içeriği, Wallarm hesabınız > **Test runs** bölümünde sunulan verilerle aynıdır.

Raporu almak için, rapor oluşturma yöntemini seçin ve aşağıdaki talimatları izleyin:

* [FAST node'u rapor modunda çalıştırma][anchor-report-mode]
* [Rapor indirme seçeneğiyle FAST node'u test modunda çalıştırma][doc-ci-mode-testing-report]

## FAST Node'u Rapor Modunda Çalıştırma {#running-fast-node-in-report-mode}

FAST node'u rapor modunda çalıştırmak için, [Docker kapsayıcısını dağıtırken][deploy-docker-with-fast-node] aşağıdaki adımları uygulayın:

<ol start="1"><li>Ortam değişkenlerini ayarlayın:</li></ol>

| Değişken           	| Açıklama 	| Zorunlu 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm Cloud'dan bir [token][doc-get-token]. | Evet |
| `WALLARM_API_HOST`   	| Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>Wallarm US cloud'daki sunucu için `us1.api.wallarm.com` ve <br>Wallarm EU cloud'daki sunucu için `api.wallarm.com`.| Evet |
| `CI_MODE`            	| FAST node'un çalışma modu.<br>`report` olmalıdır. | Evet |
| `TEST_RUN_ID`      	| Raporu almak için gereken test çalıştırması kimliği (ID).<br>Kimlik, Wallarm hesabınız > **Test runs** bölümünde ve FAST node'un test modunda çalıştırılması sırasında oluşturulan günlüklerde görüntülenir.<br>Varsayılan olarak, son test çalıştırmasının kimliği kullanılır. | Hayır |

<ol start="2"><li>Raporlar için klasörün yolunu <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code> seçeneği aracılığıyla iletin.</li></ol>

**FAST node Docker kapsayıcısını rapor modunda çalıştırma komutu örneği:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## Raporu Alma

Komut başarıyla yürütüldüyse, terminalde test çalıştırmasına ilişkin kısa verileri alırsınız:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

Rapor oluşturma tamamlandığında, `DIRECTORY_FOR_REPORTS` klasöründe aşağıdaki rapor dosyalarını bulacaksınız:

* `<TEST ÇALIŞTIRMASI ADI>.<UNIX ZAMANI>.txt`
* `<TEST ÇALIŞTIRMASI ADI>.<UNIX ZAMANI>.json`