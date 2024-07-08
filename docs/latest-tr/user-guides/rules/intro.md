[link-request-processing]:      request-processing.md
[link-rules-compiling]:         rules.md

# Uygulama Profili Kuralları

*Kurallar* sekmesinde, geçerli uygulama profili için aktif olan istek işlemi kurallarını inceleyebilir ve değiştirebilirsiniz.

Uygulama profili, korunan uygulamalar hakkında bilinen bilgilerin bir topluluğudur. İsteklerin analizi ve sonraki işlemelerin post-analiz modülünde ve bulutta gerçekleştirilmesi sırasında sistemin davranışını ince ayarlamak için kullanılır.

Trafik işleme kurallarının nasıl uygulandığını daha iyi anlamak için, filtre düğümünün [istekleri nasıl analiz ettiğini][link-request-processing] öğrenmeniz önerilir.

Kurallara yapılan değişiklikler hakkında önemli bir nokta, bu değişikliklerin hemen yürürlüğe girmemesidir. [Kuralları derlemek][link-rules-compiling] ve bunları filtre düğümlerine indirmek biraz zaman alabilir.

## Terminoloji

#### Nokta

Bir nokta, bir HTTP istek parametresidir. Bir parametre, istek işleme için uygulanan filtrelerin sırası ile tanımlanabilir, örneğin, başlıklar, gövde, URL, Base64, vb. Bu sıralamaya da *nokta* denir.

İstek işleme filtrelerine ayrıca ayrıştırıcılar denir.

#### Kural Dalı

HTTP istek parametrelerinin ve koşullarının setine *dal* denir. Koşullar yerine getirilirse, bu dal ile ilgili kurallar uygulanır.

Örneğin, `example.com/**/*.*` kural dalı, `example.com` alan adının herhangi bir URL'sine yönelik tüm istekleri eşleştiren koşulları tanımlar.

#### Uç Nokta (Uç Nokta Dalı)
İç içe geçmiş kural dalları olmayan bir dal, *uç nokta dalı* olarak adlandırılır. İdeal olarak, bir uygulama uç noktası, korunan uygulamanın bir işlevine karşılık gelir. Örneğin, `example.com/login.php` bir yetkilendirme işlevi olabilir ve bir uç nokta kural dalına karşılık gelebilir.

#### Kural
Bir filtre düğümü, post-analiz modülü veya bulut için istek işleme ayarı bir *kural* olarak adlandırılır.

İşleme kuralları, dallara ya da uç noktalara bağlıdır. Bir kural, isteğin dalda belirtilen tüm koşulları karşılaması durumunda bir isteğe uygulanır.