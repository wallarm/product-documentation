[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#getting-the-report-about-the-test
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# Test Sonuçları ile Raporu Alma

FAST düğümü, test sonuçlarınızı TXT ve JSON formatlarında almanıza olanak sağlar:

* TXT dosyası, temel istatistikleri ve algılanan güvenlik açıklığı listesini içeren kısa test sonuçlarını içerir.
* JSON dosyası, ayrıntılı test sonuçlarını — güvenlik testi ve temel istekler hakkında ayrıntılar ile algılanan güvenlik açıklığı listesini içerir. JSON dosyasının içeriği, Wallarm hesabınızdaki **Test çalışmaları**ndaki verilere karşılık gelir.

Rapor almak için, rapor oluşturma yöntemini seçin ve aşağıdaki talimatlara uyun:

* [Rapor modunda FAST düğümü çalıştırma][anchor-report-mode]
* [Rapor indirme seçeneğiyle test modunda FAST düğümü çalıştırma][doc-ci-mode-testing-report]

## Rapor Modunda FAST Düğümü Çalıştırma

FAST düğümünü rapor modunda çalıştırmak için, [Docker konteynerini dağıtırken][deploy-docker-with-fast-node] aşağıdaki adımları gerçekleştirin:

<ol start="1"><li>Ortam değişkenlerini ayarlayın:</li></ol>

| Değişken           	| İçerik 	| Gereklilik 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm bulutundan bir [token][doc-get-token]. | Evet |
| `WALLARM_API_HOST`   	| Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm ABD bulutundaki sunucu için ve <br>`api.wallarm.com` Wallarm AB bulutundaki sunucu için.| Evet |
| `CI_MODE`               	| FAST düğümünün işletim modu.<br>`report` olmalıdır. | Evet |
| `TEST_RUN_ID`        	| Rapor almak için gereken test yürütme ID'si.<br>ID, Wallarm hesabınızdaki **Test çalışmaları**nda ve test modunda FAST düğümü çalıştırma günlüklerinde görüntülenir.<br>Varsayılan olarak, son test çalışmasının ID'si kullanılır. | Hayır |

<ol start="2"><li>Raporlar için klasörün yolunu <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code> seçeneğiyle iletin.</li></ol>

**Rapor modunda FAST düğümü Docker konteynerini çalıştırmak için komut örneği:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v belgeler/raporlar:/opt/raporlar/ wallarm/fast
```

## Raporu Alma

Komut başarıyla çalıştırılırsa, terminalde test çalışması hakkında kısa veriler alırsınız:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

Rapor oluşturma tamamlandığında, `DIRECTORY_FOR_REPORTS` klasöründe aşağıdaki rapor dosyalarını bulabilirsiniz:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`