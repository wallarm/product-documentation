[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png
[link-using-search]:        use-search.md

# Rapor Oluşturma

Olayları filtreleyebilir ve ardından sonuçları PDF veya CSV raporu olarak dışa aktarabilirsiniz. Wallarm, oluşturulan raporu belirtilen adrese e-posta ile gönderir.

PDF, veri analizi ve sunum için uygun, görsel olarak zengin bir rapordur. Bu rapor şunları içerir:

* Saldırılar, zafiyetler ve olaylar için özetler
* Olayların ayrıntılı bilgileri

CSV, filtreye uyan her olayla ilgili ayrıntıları içerir ve teknik amaçlar için uygundur. Bunu, kontrol panoları oluşturmak, benzersiz saldırgan IP'lerini elde etmek, saldırıya uğramış API sunucuları/uygulamaları listesi oluşturmak vb. işlemler için kullanabilirsiniz.

CSV raporu, her olay türü için (saldırı, olay, zafiyet) ayrı bir CSV dosyası olmak üzere birkaç CSV dosyası içerebilir. Her CSV dosyası, en fazla 10.000 olayı içerir; olaylar, en çok vuruş alanlardan başlayarak sıralanır.

## Oluşturma

Wallarm Console'da, raporlar **Attacks**, **Incidents** veya **Vulnerabilities** bölümünden oluşturulabilir. Hangi bölümü kullanırsanız kullanın, rapor saldırılar, olaylar ve zafiyetler dahil olmak üzere tüm olay türlerini içerir. Rapor içeriği mevcut filtrelere bağlıdır. Saldırılar için uygulanan filtreler, otomatik olarak olaylar için de uygulanır ve tersine. Zafiyetler için rapor her zaman geçerli aktif zafiyetlerin listesini içerir.

Rapor oluşturmak için:

1. Wallarm Console'da, **Attacks**, **Incidents** veya **Vulnerabilities** bölümüne gidin.
1. Olayları [filtreleyin][link-using-search].
1. **Report** (veya **Vulnerabilities** için **PDF/CSV**) seçeneğine tıklayın ve PDF veya CSV'yi seçin.
1. **Send to** e-postasını ayarlayın.

    ![Report creation window][img-custom-report]
1. **Export**'a tıklayın. Wallarm, raporu oluşturup e-posta ile gönderecektir.

## Önceki raporları indirme

Zafiyetler için oluşturulanlar da dahil olmak üzere son 3 PDF raporu, oluşturulma tarihinden itibaren 6 ay boyunca saklanır.

Gerektiğinde, bunları dışa aktarma penceresinden indirebilirsiniz.

## E-posta yoluyla düzenli rapor alma

E-posta yoluyla düzenli olarak (günlük, haftalık veya aylık) PDF raporu alabilirsiniz. Bu rapor, ilgili döneme ait saldırılar, olaylar ve aktif zafiyetler hakkında veriler içerir.

Böyle bir rapor alıp almayacağınızı ve ne sıklıkla alacağınızı, [email report](../../user-guides/settings/integrations/email.md) entegrasyonunu yapılandırarak belirleyin.