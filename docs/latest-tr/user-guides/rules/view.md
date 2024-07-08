[img-rules-overview]:       ../../images/user-guides/rules/rules-overview.png
[img-view-rules]:           ../../images/user-guides/rules/view-rules.png

# Uygulama Profili Kurallarını İnceleme

Uygulama yapısındaki kuralları görüntülemek için Wallarm Konsolu'nun **Kurallar** bölümüne gidin. Bu bölüm, zaten bilinen dallar ve uç noktaları temsil eder.

![Kurallar sekmesine genel bakış][img-rules-overview]

Sistem otomatik olarak kuralları dallara gruplar, ortak koşulları vurgular ve ağaç benzeri bir yapı oluşturur. Sonuç olarak, bir dalın çocuk dalları olabilir. İç içe geçmiş dalları göstermek veya gizlemek için, dal açıklamasının solundaki mavi daireye tıklayın.

Bir dal açıklamasındaki iki yıldız `**`, herhangi bir sayıda iç içe geçmiş yolları ifade eder. Örneğin, `/**/*.php` dalı hem `/index.php` hem de `/app/admin/install.php` içerecektir.

Mavi dairenin boyutu, iç içe geçmiş dalların göreceli miktarını gösterir. Rengi, dal ve alt dallarındaki kuralların göreceli miktarını gösterir. Her iç içe geçme seviyesinde, dairelerin boyutu ve rengi birbirinden bağımsızdır.

Dal açıklamasının sağına, sistem bir turuncu numara gösterebilir; bu, o dalda (sadece doğrudan alt gruplar, iç içe geçmiş kurallar değil) olan kuralların sayısını gösterir. Numara görüntülenmiyorsa, o dal "sanal" dır - yalnızca benzer alt dalları gruplamak için kullanılır.

Kullanıcının (ayrıcalık modeline göre) kullanılabilir kuralları olmayan dallar otomatik olarak gizlenir.


## Kural Görüntüleme

Her bir dalda, kullanıcı ona eklenmiş kurallar listesine göz atabilir. Kural listesiyle bir sayfaya geçmek için, ilgili dalın açıklamasına tıklayın.

![Dal kurallarını görüntüleme][img-view-rules]

Bir dal içindeki kurallar *nokta* alanına göre gruplanır. Tüm isteği etkileyen kurallar, bireysel parametrelerden ziyade bir arada gruplanır. Tüm listeyi görmek için, çizgiye tıklayın.

Her kural için, sistem şu parametreleri görüntüler: son değiştirilme zamanı, miktar, türler ve nokta.

## Varsayılan kurallar

Herhangi bir uç noktaya bağlı olmayan belirtilmiş eylemle kurallar oluşturabilirsiniz - bunlar **varsayılan kurallar** olarak adlandırılır. Bu tür kurallar tüm uç noktalara uygulanır.

* Varsayılan bir kural oluşturmak için, [standart prosedür](rules.md) izleyin ancak URI'yi boş bırakın. Herhangi bir uç noktaya bağlı olmayan yeni bir kural oluşturulacak.
* Oluşturulan varsayılan kuralların listesini görmek için, **Varsayılan kurallar** düğmesine tıklayın.

!!! info "Trafik filtreleme modunun varsayılan kuralı"
    Wallarm, tüm müşteriler için `Filtreleme modunu ayarla` varsayılan kuralını otomatik olarak [oluşturur](wallarm-mode-rule.md#default-instance-of-rule) ve değerini [genel filtreleme modu](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) ayarına dayalı olarak belirler.

Varsayılan kurallar, tüm dallar tarafından [miras alınır](#distinct-and-inherited-rules).

## Ayrık ve kalıtımlı kurallar

Kurallar, kural dalının aşağısına miras alınır. Prensipler:

* Tüm dallar [varsayılan](#default-rules) kuralları miras alır.
* Bir dalda, çocuk uç noktaları ebeveynden kuralları miras alır.
* Ayrık, kalıtımdan önceliklidir.
* Doğrudan belirtilen, [regex](rules.md#condition-type-regex) üzerinde önceliklidir.
* Durum [duyarlı](rules.md#condition-type-equal), [hassas olmayan](rules.md#condition-type-iequal-aa) üzerinde önceliklidir.

Kural dalıyla çalışmanın bazı ayrıntıları aşağıda verilmiştir:

* Uç noktayı genişletmek için, mavi daireye tıklayın.
* Ayrı bir kuralı olmayan uç noktalar gri renkte ve tıklanabilir değillerdir.

    ![Uç nokta dalları](../../images/user-guides/rules/rules-branch.png)

* Uç nokta için kuralları görüntülemek için, ona tıklayın. Öncelikle, bu uç nokta için ayrı kurallar görüntülenecektir.
* Belirli bir uç nokta için kural listesini görüntülerken, kalıtımlı olanları görüntülemek için **Ayrı ve kalıtımlı kurallar** a tıklayın. Kalıtımlı kurallar, ayrılara göre daha soluk görünecek şekilde ayrılarla birlikte görüntülenir.

    ![Uç nokta için ayrık ve kalıtımlı kurallar](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## Kuralları almak için API çağrıları

Özel kuralları almak için, Wallarm Konsol UI'sini kullanmanın yanı sıra Wallarm API'sini doğrudan [çağırabilirsiniz](../../api/overview.md). Aşağıda, ilgili API çağrılarının bazı örnekleri verilmiştir.

**Tüm yapılandırılmış kuralları alın**

--8<-- "../include-tr/api-request-examples/get-all-configured-rules.md"

**Tüm kuralların yalnızca koşullarını alın**

--8<-- "../include-tr/api-request-examples/get-conditions.md"

**Belirli bir koşula ekli kuralları alın**

Belli bir koşulu belirtmek için, ID'sini kullanın - tüm kuralların koşullarını talep ederken alabilirsiniz.

--8<-- "../include-tr/api-request-examples/get-rules-by-condition-id.md"