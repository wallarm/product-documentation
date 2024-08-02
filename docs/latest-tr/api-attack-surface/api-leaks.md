# API Sızıntılarının Giderilmesi

**API Sızıntıları** modülü, Wallarm platformunun binlerce kamuya açık depoyu ve kaynağı taradığı ve API belirteçlerinin sızıntılarını kontrol etmek ve sızan kimlik bilgilerinin kullanımını, konuşlandırılmış Wallarm [düğüm(ler)i](../installation/supported-deployment-options.md) aracılığıyla engelleme olanağı sunan bir sistemdir. Bu makale, API Sızıntılarına genel bir bakış sunar: bunun tarafından ele alınan sorunlar, amacı ve başlıca imkanları.

**API Sızıntıları** modülünün nasıl kullanılacağına dair bilgi için lütfen [kullanıcı kılavuzuna](../user-guides/api-leaks.md) başvurunuz.

![API Sızıntıları](../images/api-attack-surface/api-leaks.png)

## API Sızıntıları Tarafından Ele Alınan Sorunlar

Organizasyonunuz, API'nizin farklı bölümlerine erişimi sağlamak için bir dizi API belirteci kullanabilir. Bu belirteçler sızarsa, bir güvenlik tehlikesi haline gelirler.

API'lerinizi korumak için, sızan her bir API belirtecini bulmak üzere kamuya açık depoları izlemeniz gerekmektedir, tek bir örneği bile kaçırmamanız gerekmektedir - aksi takdirde, hala risk altındasınızdır. Bunu başarmak için, sürekli olarak büyük miktarda veriyi tekrar tekrar analiz etmeniz gerekmektedir.

Sızdırılan API sırları bulunursa, API'lerinize zarar gelmemesi için çok yönlü bir yanıt gereklidir. Bu, sızan sırların kullanıldığı tüm yerleri bulmayı, tüm bu yerlerde onları yeniden oluşturmayı ve tehlikeye giren versiyonların kullanımını engellemeyi içerir - ve bunun hızlı ve tam bir şekilde yapılması gerekmektedir. Bunu manuel olarak başarmak zordur.

**API Sızıntıları** Wallarm modülü, aşağıdakileri sağlayarak bu sorunları çözmeye yardımcı olur:

* Kamu kaynaklarından sızan API belirteçlerinin otomatik tespiti ve tespit edilen sızıntıların Wallarm Konsol UI'de günlük oluşturulması.
* Risk seviyesi tespiti.
* Sızıntıları manuel olarak ekleyebilme.
* Sızan veri sorunlarının her durumda nasıl giderilmesi gerektiğine dair kendi kararlarınızı verebilme yeteneği.

## Bulunan Sızıntıların Görselleştirilmesi

**API Sızıntıları** bölümü, bulunan API sızıntılarına ilişkin güncel durumunuz için zengin görsel bir temsil sunar. Bu temsil, etkileşimlidir: diyagram öğelerine tıklayarak sızıntıları risk seviyelerine ve kaynaklarına göre filtreleyebilirsiniz.

![API Sızıntıları - Görselleştirme](../images/api-attack-surface/api-leaks-visual.png)

## API Sızıntılarına Erişim

* Sızdırılan API belirteçleri tehdidinin hafifletilmesi için, Wallarm [düğüm(ler)i](../user-guides/nodes/nodes.md) konuşlandırılmalıdır.
* Varsayılan olarak, API Sızıntıları modülü devre dışıdır. Modüle erişim sağlamak için, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ekibine bir istekte bulununuz.