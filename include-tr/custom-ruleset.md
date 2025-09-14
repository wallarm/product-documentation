### Özel kurallar kümesi oluşturma

Wallarm Console → **Security Controls** → **Rules** veya **Mitigation Controls** içinde yeni bir rule/mitigation control eklemek, mevcut olanları silmek veya değiştirmek, özel bir kurallar kümesi derlemesini başlatır. Oluşturma sürecinde, kurallar ve kontroller optimize edilir ve filtreleme düğümü için uyarlanmış bir biçime derlenir. Özel bir kurallar kümesi oluşturma süreci, az sayıda kural için birkaç saniyeden karmaşık kural ağaçları için bir saate kadar sürebilir.

### Filtreleme düğümüne yükleme

Özel kurallar kümesi derlemesi, filtreleme düğümü ile Wallarm Cloud arasındaki senkronizasyon sırasında filtreleme düğümüne yüklenir. Varsayılan olarak, filtreleme düğümü ile Wallarm Cloud senkronizasyonu her 2‑4 dakikada bir başlatılır. [Filtreleme düğümü ve Wallarm Cloud senkronizasyonunun yapılandırması hakkında daha fazla ayrıntı →][link-cloud-node-synchronization]

Özel kurallar kümesinin filtreleme düğümüne yüklenme durumu `/opt/wallarm/var/log/wallarm/wcli-out.log` dosyasına kaydedilir.

Aynı Wallarm hesabına bağlı tüm Wallarm düğümleri, trafik filtreleme için aynı varsayılan ve özel kural setini alır. Yine de uygun uygulama kimliklerini (application ID’ler) veya başlıklar, sorgu dizesi parametreleri vb. gibi benzersiz HTTP istek parametrelerini kullanarak farklı uygulamalar için farklı kurallar uygulayabilirsiniz.

### Yedekleme ve geri yükleme

Yanlış yapılandırılmış veya yanlışlıkla silinmiş kurallara karşı korunmak için, mevcut özel kurallar kümenizi yedekleyebilirsiniz.

Aşağıdaki kural yedekleme seçenekleri vardır: 

* Her [özel kurallar kümesi derlemesinden](#custom-ruleset-building) sonra otomatik yedek oluşturma. Otomatik yedek sayısı 7 ile sınırlıdır: aynı gün içinde kuralları birkaç kez değiştirirseniz yalnızca son yedek tutulur.
* İstediğiniz zaman manuel yedek oluşturma. Manuel yedek sayısı varsayılan olarak 5 ile sınırlıdır. Daha fazlasına ihtiyacınız varsa, [Wallarm teknik destek](mailto:support@wallarm.com) ekibiyle iletişime geçin.

Şunları yapabilirsiniz:

* Mevcut yedeklere erişin: **Rules** bölümünde **Backups**’a tıklayın.
* Yeni bir yedeği manuel olarak oluşturun: **Backups** penceresinde **Create backup**’a tıklayın.
* Manuel yedek için ad ve açıklama belirleyin ve bunları istediğiniz anda düzenleyin.

    !!! info "Otomatik yedekler için adlandırma"
        Otomatik yedekler sistem tarafından adlandırılır ve yeniden adlandırılamaz.

* Mevcut yedekten yükleyin: ilgili yedek için **Load**’a tıklayın. Yedekten yükleme sırasında mevcut kural yapılandırmanız silinir ve yedekteki yapılandırma ile değiştirilir.
* Yedeği silin.

    ![Rules - Yedek oluşturma][img-rules-create-backup]

!!! warning "Kural değiştirme kısıtlamaları"
    Yedek oluşturma veya yedekten yükleme tamamlanana kadar rules veya mitigation controls öğelerini oluşturamaz ya da değiştiremezsiniz.