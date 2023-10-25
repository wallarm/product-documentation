# Wallarm Kullanıcı Kabul Testi Kontrol Listesi

Bu bölüm, Wallarm örneğinizin doğru bir şekilde çalıştığından emin olmanız için bir kontrol listesi sağlar.

| İşlem                                                                                                                                                        | Beklenen davranış                  | Kontrol |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|---------|
| [Wallarm node saldırıları algılar](#wallarm-node-detects-attacks)                                                                     | Saldırılar algılanır                 |         |
| [Wallarm arayüzüne giriş yapabilirsiniz](#you-can-log-into-the-wallarm-interface)                                                 | Giriş yapabilirsiniz                  |         |
| [Wallarm arayüzü saniyedeki istekleri gösterir](#wallarm-interface-shows-requests-per-second)                                       | İstek istatistiklerini görürsünüz    |         |
| [Wallarm istekleri yanlış olarak işaretler ve onları engellemeyi durdurur](#wallarm-marks-requests-as-false-and-stops-blocking-them)               | Wallarm istekleri engellemez         |         |
| [Wallarm güvenlik açıklarını tespit eder ve güvenlik olayları oluşturur](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | Güvenlik olayları oluşturulır |         |
| [Wallarm çevresel unsurları tespit eder](#wallarm-detects-perimeter)                                                                           | Kapsam keşfedilir                     |         |
| [IP izin verme, red ve gri liste işlemleri çalışır](#ip-allowlisting-denylisting-and-graylisting-work)                                                                                      | IP adresleri engellenir              |         |
| [Kullanıcılar yapılandırabilir ve uygun erişim haklarına sahip olabilir](#users-can-be-configured-and-have-proper-access-rights)                   | Kullanıcılar oluşturulabilir ve güncellenebilir |         |
| [Kullanıcı etkinliği logunun kayıtları vardır](#user-activity-log-has-records)                                                                   | Log kayıtları vardır                 |         |
| [Raporlama çalışır](#reporting-works)                                                                                                | Raporları alırsınız                  |         | |

## Wallarm Node Saldırıları Algılar

1. Kaynaklarınıza kötü niyetli bir istek gönderin:

   ```
   http://<kaynak_URL>/etc/passwd
   ```

2. Aşağıdaki komutu çalıştırarak saldırı sayısının artıp artmadığını kontrol edin:

   ```
   curl http://127.0.0.8/wallarm-status
   ```

Ayrıca bakınız: [Filtre düğüm işlemi kontrol etme](installation-check-operation-en.md)

## Wallarm Arayüzüne Giriş Yapabilirsiniz

1. Kullandığınız buluta karşılık gelen bağlantıya gidin:
   * Eğer ABD bulutunu kullanıyorsanız, <https://us1.my.wallarm.com> linkine gidin.
   * Eğer Avrupa bulutunu kullanıyorsanız, <https://my.wallarm.com/> linkine gidin.
2. Başarılı bir şekilde giriş yapabilir miyim, kontrol edin.

Ayrıca bakınız: [Tehdit Önleme Gösterge Tablosu genel bakış](../user-guides/dashboards/threat-prevention.md).

## Wallarm Arayüzü Saniyedeki İstekleri Gösterir

1. Kaynağınıza bir istek gönderin:

   ```
   curl http://<kaynak_URL>
   ```

   Veya bash scripti ile birkaç istek gönderin:

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<kaynak_URL> ;
   done
   ```

   Bu örnek 10 istek içindir.

2. Wallarm arayüzünün saniyedeki algılanan istekleri gösterip göstermediğini kontrol edin.

Ayrıca bakınız: [Tehdit Önleme Gösterge Tablosu](../user-guides/dashboards/threat-prevention.md).

## Wallarm İstekleri Yanlış Olarak İşaretler ve Onları Engellemeyi Durdurur

1. *Saldırılar* sekmesinde bir saldırıyı genişletin.
2. Bir tıklama seçin ve *Yanlış* düğmesini tıklayın.
3. Yaklaşık 3 dakika bekleyin.
4. İsteği yeniden gönderin ve Wallarm'ın bu isteği bir saldırı olarak algılayıp engelleyip engellemediğini kontrol edin.

Ayrıca bakınız: [Yanlış saldırılarla çalışma](../user-guides/events/false-attack.md).

## Wallarm Güvenlik Açıklarını Tespit Eder ve Güvenlik Olayları Oluşturur

1. Kaynağınızda açık bir güvenlik açığı olduğundan emin olun.
2. Açığı istismar etmek için kötü niyetli bir istek gönderin.
3. Wallarm arayüzünde algılanan bir olay olup olmadığını kontrol edin.

Ayrıca bakınız: [Saldırıları ve olayları kontrol etme](../user-guides/events/check-attack.md).

## Wallarm Çevresel Unsuru Tespit Eder

1. *Tarayıcı* sekmesinde, kaynağınızın domainini ekleyin.
2. Wallarm'ın eklenen domaine bağlı tüm kaynakları keşfedip keşfetmediğini kontrol edin.

Ayrıca bakınız: [Tarayıcı işlemleri](../user-guides/scanner.md).

## IP izin verme, red ve gri liste işlemleri çalışır

1. [IP listeleri temel mantığını](../user-guides/ip-lists/overview.md) öğrenin.
2. IP adreslerini [izin verilenler listesine](../user-guides/ip-lists/allowlist.md), [engellenenler listesine](../user-guides/ip-lists/denylist.md) ve [gri listeye](../user-guides/ip-lists/graylist.md) ekleyin.
3. Filtreleme düğümünün, listelere eklenmiş IP'lerden gelen istekleri doğru bir şekilde işleyip işlemediğini kontrol edin.

## Kullanıcılar Yapılandırılabilir ve Uygun Erişim Haklarına Sahip Olabilir

1. Wallarm sistemine *Yönetici* rolünden sahip olduğunuzdan emin olun.
2. Bir kullanıcı oluşturun, rolünü değiştirin, devre dışı bırakın ve silin, [Kullanıcıları yapılandırma](../user-guides/settings/users.md) bölümünde anlatıldığı gibi.

Ayrıca bakınız: [Kullanıcıları yapılandırma](../user-guides/settings/users.md).

## Kullanıcı Etkinliği Logunun Kayıtları Vardır

1. *Ayarlar* –> *Kullanıcılar* menüsüne gidin.
2. *Kullanıcı Etkinliği Logu*nda kayıtlar olduğunu kontrol edin.

Ayrıca bakınız: [Kullanıcı etkinlik logu](../user-guides/settings/audit-log.md).

## Raporlama Çalışır

1. *Saldırılar* sekmesinde bir arama sorgusu girin.
2. Sağdaki raporlama butonuna tıklayın.
3. E-posta adresinizi girin ve raporlama butonuna tekrar tıklayın.
5. Raporu alıp alamadığınızı kontrol edin.

Ayrıca bakınız: [Özel bir rapor oluşturma](../user-guides/search-and-filters/custom-report.md).