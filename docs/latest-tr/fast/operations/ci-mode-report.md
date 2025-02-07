[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# Test Sonuçlarıyla Raporu Alma

FAST node, test sonuçlarını TXT ve JSON formatlarında almanızı sağlar:

* TXT dosyası, temel istatistikler ile tespit edilen güvenlik açıklarının listesinden oluşan özet test sonuçlarını içerir.
* JSON dosyası, güvenlik testine ilişkin detaylar, temel istekler ve tespit edilen güvenlik açıklarının listesini içeren ayrıntılı test sonuçlarını sunar. JSON dosyasının içeriği, Wallarm hesabınızdaki > **Test runs** bölümünde sunulan verilerle uyumludur.

Raporu almak için, rapor oluşturma yöntemini seçin ve aşağıdaki talimatları uygulayın:

* [Report modunda FAST node çalıştırma][anchor-report-mode]
* [Test modunda FAST node çalıştırma ve raporu indirme seçeneği ile][doc-ci-mode-testing-report]

## Report Modunda FAST Node Çalıştırma

FAST node'u report modunda çalıştırmak için, [Docker konteynerini dağıtırken][deploy-docker-with-fast-node] aşağıdaki adımları izleyin:

<ol start="1"><li>Ortam değişkenlerini ayarlayın:</li></ol>

| Değişken                | Açıklama  | Gereklilik  |
|-------------------------|-----------|-------------|
| `WALLARM_API_TOKEN`     | Wallarm Cloud üzerinden alınan bir [token][doc-get-token]. | Evet |
| `WALLARM_API_HOST`      | Wallarm API sunucusunun adresi. <br>Kabul edilen değerler: <br>`us1.api.wallarm.com` Wallarm US cloud sunucusu için ve <br>`api.wallarm.com` Wallarm EU cloud sunucusu için. | Evet |
| `CI_MODE`               | FAST node'un çalışma modu.<br>`report` olmalıdır. | Evet |
| `TEST_RUN_ID`           | Raporu almak için gerekli test çalıştırma kimliği.<br>Kimlik, Wallarm hesabınızdaki > **Test runs** bölümünde ve FAST node'un test modunda çalıştırılmasının loglarında görüntülenir.<br>Varsayılan olarak, son test çalıştırmasının kimliği kullanılır. | Hayır |

<ol start="2"><li>Rapor klasörünün yolunu <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code> seçeneği ile geçirin.</li></ol>

**Report modunda FAST node Docker konteynerini çalıştırmak için örnek komut:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## Raporu Alma

Komut başarıyla yürütüldüğünde, terminalde test çalıştırmasına ait özet veriler görüntülenecektir:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

Rapor oluşturma tamamlandığında, `DIRECTORY_FOR_REPORTS` klasöründe aşağıdaki rapor dosyalarını bulacaksınız:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`