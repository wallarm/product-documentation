[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png
[link-using-search]:        use-search.md

# Rapor Oluşturma

Olayları filtreleyebilir ve sonuçları PDF veya CSV raporu olarak dışa aktarabilirsiniz. Wallarm, oluşturulan raporu belirtilen adrese e‑postayla gönderir.

PDF, görsel olarak zengin bir rapordur; veri analizi ve sunum için uygundur. Bu rapor şunları içerir:

* attacks, vulnerabilities ve incidents için özetler
* Olaylara ilişkin ayrıntılı bilgiler

CSV, filtreyle eşleşen her bir olayın ayrıntılarını içerir ve teknik amaçlar için uygundur. Bunu panolar oluşturmak, benzersiz saldırgan IP’lerini elde etmek, saldırıya uğrayan API ana makineleri/uygulamalarının bir listesini üretmek vb. için kullanabilirsiniz.

CSV raporu, birden fazla CSV dosyası içerebilir; her bir olay türü için bir tane - attack, incident, vulnerability. Her CSV en fazla 10,000 olayı içerir ve en çok Hits olan olaylara göre sıralanır.

## Oluşturma

Wallarm Console’da, raporlar **Attacks**, **Incidents** veya **Vulnerabilities** bölümünden oluşturulabilir. Hangi bölümü kullanırsanız kullanın, rapor tüm olay türlerini içerir - attacks, incidents ve vulnerabilities. Rapor içeriği mevcut filtrelere bağlıdır. attacks için uygulanan filtreler otomatik olarak incidents için de uygulanır ve bunun tersi de geçerlidir. vulnerabilities için rapor, her zaman o anda aktif vulnerabilities listesini içerir.

Rapor oluşturmak için:

1. Wallarm Console’da **Attacks**, **Incidents** veya **Vulnerabilities** bölümüne gidin.
1. Olayları [Filtreleyin][link-using-search].
1. **Report**’a (veya **Vulnerabilities** için **PDF/CSV**’ye) tıklayın ve PDF veya CSV’yi seçin.
1. **Send to** e-posta adresini ayarlayın.

    ![Rapor oluşturma penceresi][img-custom-report]
1. **Export**’a tıklayın. Wallarm raporu oluşturacak ve e‑postayla gönderecektir.

## Önceki raporları indirme

Son 3 PDF rapor, [vulnerabilities için oluşturulanlar](../vulnerabilities.md#downloading-vulnerability-report) dahil, oluşturulma tarihinden itibaren 6 ay boyunca saklanır.

Gerekirse, bunları Export penceresinden indirin.

## E-posta ile düzenli raporlar alma

PDF raporunu e‑posta ile düzenli olarak - günlük, haftalık veya aylık - alabilirsiniz. Bu rapor, ilgili dönem için attacks, incidents verilerini ve aktif vulnerabilities’i içerir.

Bu tür bir raporu alıp almayacağınızı ve ne sıklıkta alacağınızı [e-posta raporu](../../user-guides/settings/integrations/email.md) entegrasyonunu yapılandırarak belirleyin.