[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png

[link-using-search]:        use-search.md

# Özel Rapor Oluşturma

Olayları filtreleyip sonuçları PDF veya CSV raporu olarak dışa aktarabilirsiniz. Wallarm, özel raporu belirtilen adrese e-posta ile gönderecektir.

PDF, görsel olarak zengin bir rapordur, veri analizi ve sunum için uygundur. Bu rapor şunları içerir:

* Saldırılar, güvenlik açıkları ve olaylar için özetler
* Olaylara dair detaylı bilgiler

CSV, filtreyle eşleşen her olayın detaylarını içerir ve teknik amaçlar için uygundur. Gösterge panelleri oluşturmak, benzersiz saldırgan IP'lerini almak, saldırıya uğramış API ana bilgisayarları/uygulamalarının bir listesini oluşturmak vb. için kullanabilirsiniz.

CSV raporu, her biri - saldırı, olay, güvenlik açığı - olay türü için birden çok CSV dosyasını içerebilir. Her CSV'nin olay sayısının en fazla 10.000 olduğu, en çok isabet alan olaylara göre sıralandığı bir rapordur.

## Rapor oluştur

1. **Olaylar** sekmesinde, olayları [filtreleyin][link-using-search].
1. **Dışa Aktar**'a tıklayın ve PDF veya CSV'yi seçin.
1. **Gönderilecek** e-postayı ayarlayın.

    ![Özel rapor oluşturma penceresi][img-custom-report]
1. **Dışa Aktar**'a tıklayın. Wallarm raporu oluşturacak ve e-posta ile gönderecektir.

## Daha önce oluşturulan PDF raporunu indirme

Son üç PDF raporu, [güvenlik açıkları için oluşturulanlar](../vulnerabilities.md#downloading-vulnerability-report) dahil olmak üzere kaydedildi. Gerekirse, onları dışa aktarma penceresinden indirin.