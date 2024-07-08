# API Keşif Kontrol Paneli <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

**API Keşfi** Wallarm kontrol paneli, [API Keşifi](../../api-discovery/overview.md) modülü tarafından toplanan API'niz hakkındaki verileri özetler. API envanterinize, aşağıdaki metriklere dayanarak kapsamlı bir genel bakış sunar:

* Risk seviyesine göre uç nokta sayısı
* Tüm API envanteri ve son 7 günde yeni keşfedilen uç noktalar arasında [en riskli](../../api-discovery/overview.md#endpoint-risk-score) uç noktalar

    En riskli uç noktalar, aktif güvenlik açıkları, uç noktaların [yeni](../../api-discovery/overview.md#tracking-changes-in-api) veya [gölgede](../../api-discovery/overview.md#shadow-orphan-and-zombie-apis) olması ve diğer risk faktörleri nedeniyle bir saldırı hedefi olmaları muhtemeldir. Her riskli uç nokta, hedef alınan hitlerin sayısıyla birlikte sunulur.
            
* API'nizdeki değişikliklerin son 7 günde türüne göre (yeni, değişmiş, kullanılmayan API'ler)
* Keşfedilen toplam uç nokta sayısı ve bunların kaçının dış ve iç olduğu
* API'deki hassas veriler gruplara (kişisel, finans, vb.) ve türlere göre
* API envanteri: API hostuna ve uygulamaya göre uç nokta sayısı

![API Keşif widget'ı](../../images/user-guides/dashboard/api-discovery-widget.png)

Kontrol paneli, riskli sıklıkla kullanılan uç noktalar veya API'nizin transfer ettiği hassas verilerin yüksek hacmi gibi anomallikleri ortaya çıkarabilir. Ayrıca, API'deki değişikliklere dikkat çeker, bu da uç noktaların saldırı hedefi olmasını önlemek için güvenlik kontrollerini uygulamanıza yardımcı olur.

Widget'ın öğelerine tıklayarak **API Keşfi** bölümüne gidin ve filtrelenmiş verileri görüntüleyin. Hit numarasını tıklarsanız, son 7 gün için saldırı verileriyle [etkinlik listesi](../events/check-attack.md)ne yönlendirilirsiniz.