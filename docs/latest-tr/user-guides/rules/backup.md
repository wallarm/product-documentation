# Özel kurallar seti yedekleme ve geri yükleme

Yanlışlıkla yanlış yapılandırılmış veya silinmiş kurallardan kendinizi korumak için mevcut özel kurallar setinizi yedekleyebilirsiniz.

Aşağıdaki kural yedekleme seçenekleri vardır:

* Her bir [özel kurallar seti oluşturma](rules.md) sonrası otomatik yedek oluşturma. Otomatik yedeklerin sayısı 7 ile sınırlıdır: kuralları birkaç kez değiştirdiğiniz her gün, yalnızca son yedek korunur.
* Herhangi bir zamanda manuel yedek oluşturma. Standart olarak manuel yedeklerin sayısı 5 ile sınırlıdır. Daha fazlasına ihtiyacınız varsa, [Wallarm teknik destek](mailto:support@wallarm.com) ekibiyle iletişime geçin.

Yapabilecekleriniz:

* Mevcut yedeklere erişin: **Kurallar** bölümünde, **Yedekler**i tıklayın.
* Yeni bir yedek oluşturun: **Yedekler** penceresinde, **Yedek oluştur**'u tıklayın.
* Manuel yedek için isim ve açıklama belirleyin ve her an düzenleyin.

    !!! Bilgi "Otomatik yedekler için isimlendirme"
        Otomatik yedekler, sistem tarafından isimlendirilir ve yeniden adlandırılamaz.

* Mevcut yedekten yükleyin: gerekli yedeği için **Yükle**'yi tıklayın. Yedeği yüklerken, mevcut kural yapılandırmanız silinir ve yedekteki yapılandırmayla değiştirilir.
* Yedeği silin. 

    ![Kurallar - Yedek Oluşturma](../../images/user-guides/rules/rules-create-backup.png)

!!! uyarı "Kural değişiklik kısıtlamaları"
    Yedek oluşturma veya yedekten yükleme tamamlanana kadar kurallar oluşturamaz veya değiştiremezsiniz.
