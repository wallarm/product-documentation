# Wallarm Kullanıcı Kabul Testi Kontrol Listesi

Bu bölüm, Wallarm örneğinizin doğru çalıştığından emin olmanız için bir kontrol listesi sunar.

| İşlem                                                                                                                                                           | Beklenen davranış                           | Kontrol |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|---------|
| [Wallarm node saldırıları tespit eder](#wallarm-node-detects-attacks)                                                                       | Saldırılar tespit edilir                     |         |
| [Wallarm arayüzüne giriş yapabilirsiniz](#you-can-log-into-the-wallarm-interface)                                                           | Giriş yapabilirsiniz                         |         |
| [Wallarm arayüzü saniyede istekleri gösterir](#wallarm-interface-shows-requests-per-second)                                                   | İstek istatistiklerini görürsünüz            |         |
| [Wallarm istekleri yanlış olarak işaretler ve engellemeyi durdurur](#wallarm-marks-requests-as-false-and-stops-blocking-them)                   | Wallarm, istekleri engellemez                |         |
| [Wallarm güvenlik açıklarını tespit eder ve güvenlik olayları oluşturur](#wallarm-detects-vulnerabilities-and-creates-security-incidents)       | Güvenlik olayı oluşturulur                   |         |
| [Wallarm çevreyi tespit eder](#wallarm-detects-perimeter)                                                                                    | Kapsam keşfedilir                            |         |
| [IP beyaz liste, kara liste ve gri listeleme çalışır](#ip-allowlisting-denylisting-and-graylisting-work)                                                            | IP adresleri engellenir                      |         |
| [Kullanıcılar yapılandırılabilir ve uygun erişim haklarına sahip olur](#users-can-be-configured-and-have-proper-access-rights)                     | Kullanıcılar oluşturulup güncellenebilir       |         |
| [Kullanıcı etkinlik günlüğünde kayıtlar bulunur](#user-activity-log-has-records)                                                            | Günlükte kayıtlar mevcuttur                  |         |
| [Raporlama çalışır](#reporting-works)                                                                                                        | Raporlar alırsınız                           |         |


## Wallarm Node Saldırıları Tespit Eder

1. Kaynağınıza kötü amaçlı bir istek gönderin:

   ```
   http://<resource_URL>/etc/passwd
   ```

2. Saldırı sayısının arttığını kontrol etmek için aşağıdaki komutu çalıştırın:

   ```
   curl http://127.0.0.8/wallarm-status
   ```

Ayrıca bkz. [Filtre node çalışmasını kontrol etme](installation-check-operation-en.md)

## Wallarm Arayüzüne Giriş Yapabilirsiniz

1. Kullandığınız buluta karşılık gelen bağlantıya gidin: 
    *   Eğer US bulutunu kullanıyorsanız, <https://us1.my.wallarm.com> bağlantısına gidin.
    *   Eğer EU bulutunu kullanıyorsanız, <https://my.wallarm.com/> bağlantısına gidin.
2. Başarılı bir şekilde giriş yapıp yapamadığınızı kontrol edin.

Ayrıca bkz. [Threat Prevention Dashboard genel bakışı](../user-guides/dashboards/threat-prevention.md).

## Wallarm Arayüzü Saniyede İstekleri Gösterir

1. Kaynağınıza bir istek gönderin:

   ```
   curl http://<resource_URL>
   ```

   Veya bash betiği ile birkaç istek gönderin:

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<resource_URL> ;
   done
   ```

   Bu örnek 10 istek içindir.

2. Wallarm arayüzünde saniyede tespit edilen istekleri kontrol edin.

Ayrıca bkz. [Threat Prevention Dashboard](../user-guides/dashboards/threat-prevention.md).

## Wallarm İstekleri Yanlış Olarak İşaretler ve Engellemeyi Durdurur

1. *Attacks* sekmesinde bir saldırıyı genişletin. 
2. Bir vuruş seçin ve *False* tuşuna tıklayın.
3. Yaklaşık 3 dakika bekleyin.
4. İsteği yeniden gönderin ve Wallarm’ın bu isteği saldırı olarak tespit edip engellemediğini kontrol edin.

Ayrıca bkz. [Yanlış saldırılarla çalışma](../user-guides/events/check-attack.md#false-positives).

## Wallarm Güvenlik Açıklarını Tespit Eder ve Güvenlik Olayları Oluşturur

1. Kaynağınızda açık bir güvenlik açığı olduğundan emin olun.
2. Güvenlik açığından yararlanmak için kötü amaçlı bir istek gönderin.
3. Wallarm arayüzünde tespit edilen bir olay olup olmadığını kontrol edin.

Bkz. [Olayları kontrol etme](../user-guides/events/check-incident.md).

## Wallarm Çevreyi Tespit Eder

1. *Scanner* sekmesinde, kaynağınızın alan adını ekleyin.
2. Eklenen alan adıyla ilişkili tüm kaynakların Wallarm tarafından keşfedildiğini kontrol edin.

Ayrıca bkz. [Scanner ile çalışma](../user-guides/scanner.md).

## IP beyaz liste, kara liste ve gri listeleme çalışır

1. [IP listelerinin temel mantığını öğrenin](../user-guides/ip-lists/overview.md).
2. IP adreslerini [beyaz listeye](../user-guides/ip-lists/overview.md), [kara listeye](../user-guides/ip-lists/overview.md) ve [gri listeye](../user-guides/ip-lists/overview.md) ekleyin.
3. Eklenen IP adreslerinden kaynaklanan isteklerin filtre düğümü tarafından doğru işlendiğini kontrol edin.

## Kullanıcılar Yapılandırılabilir ve Uygun Erişim Haklarına Sahiptir

1. Wallarm sisteminde *Administrator* rolüne sahip olduğunuzdan emin olun.
2. [Kullanıcıların yapılandırılması](../user-guides/settings/users.md) bölümünde belirtildiği gibi bir kullanıcı oluşturun, rolünü değiştirin, devre dışı bırakın ve silin.

Ayrıca bkz. [Kullanıcıların yapılandırılması](../user-guides/settings/users.md).

## Kullanıcı Etkinlik Günlüğünde Kayıtlar Var

1. *Settings* –> *Users* bölümüne gidin.
2. *User Activity Log* (Kullanıcı Etkinlik Günlüğü) kısmında kayıtların bulunduğunu doğrulayın.

Ayrıca bkz. [Kullanıcı etkinlik günlüğü](../user-guides/settings/audit-log.md).

## Raporlama Çalışır

1. *Attacks* sekmesinde bir arama sorgusu girin.
2. Sağdaki rapor butonuna tıklayın.
3. E-posta adresinizi girin ve tekrar rapor butonuna tıklayın.
4. Raporu alıp almadığınızı kontrol edin.

Ayrıca bkz. [Özel rapor oluşturma](../user-guides/search-and-filters/custom-report.md).