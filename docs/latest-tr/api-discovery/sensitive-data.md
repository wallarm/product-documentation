# Hassas Veri Algılama <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API Discovery, API'larınız tarafından tüketilen ve taşınan hassas verileri tespit eder ve vurgular; bu sayede veriyi korumak, şifreleme, tokenizasyon veya diğer güvenlik kontrollerini uygulamak, veri ihlallerini önlemek ve hassas verilerin güvensiz kanallar veya yetkisiz sistemlere aktarılmasını engellemek mümkün olur. Bu makale, bu özelliğin nasıl kullanılacağını ve yapılandırılacağını anlatır.

Wallarm'ın hassas veri algılama sistemi, kapsamlı varsayılan yapılandırması ile kullanıma hazır gelir. Ayrıca yüksek derecede özelleştirilebilirdir: mevcut algılama sürecini ince ayar yapabilir ve tespit edilecek kendi veri türlerinizi ekleyebilirsiniz.

## Varsayılan Algılama

Varsayılan olarak, API Discovery aşağıdaki türde hassas verileri tespit eder:

* IP ve MAC adresleri gibi teknik veriler
* Gizli anahtarlar ve şifreler gibi giriş bilgileri
* Banka kartı numaraları gibi finansal veriler
* Tıbbi lisans numarası gibi medikal veriler
* Ad, soyad, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII)

Wallarm Console'da varsayılan [hassas veri desenleri](#customizing-sensitive-data-detection) listesini görmek için **API Discovery** → **Configure API Discovery** → **Sensitive data** bölümüne gidin.

## Hassas Veri Algılamanın Özelleştirilmesi

Hassas veri algılamayı, GDPR, HIPAA, PCI DSS gibi şirketinizin özel ihtiyaçlarına ve sektöre özgü düzenlemelere tamamen uyumlu hale getirmek için, API Discovery algılama sürecini ince ayar yapma yeteneği sunar (NGINX Node 5.0.3 veya Native Node 0.7.0 ve üstü gereklidir).

Özelleştirme, şirketinizin benzersiz veri koruma yükümlülüklerini karşılamanızı sağlar. Ek olarak, veri akışlarınızda herhangi bir gizli veya uzmanlaşmış hassas veri öğesi bulunuyorsa, bu öğelerin tam olarak tanımlanması için özel düzenli ifadeler tanımlama imkânından faydalanırsınız.

Hassas veri algılama, **hassas veri desenleri** adlı bir kümeyle yapılandırılır – her desen, belirli bir hassas veriyi ve bu verinin aranması için ayarları tanımlar. API Discovery, varsayılan desen kümesiyle birlikte gelir. Varsayılan desenleri Wallarm Console → **API Discovery** → **Configure API Discovery** → **Sensitive data** bölümünden değiştirebilir ve kendi desenlerinizi ekleyebilirsiniz.

Varsayılan (kutudan çıktığı haliyle) desenleri düzenleyebilir veya devre dışı bırakabilir ve gerekirse bunları ilk ayarlara hızlıca geri yükleyebilirsiniz. Kendi desenleriniz istediğiniz anda oluşturulabilir, değiştirilebilir, devre dışı bırakılabilir veya silinebilir.

**Güven Puanları**

Hassas veri algılamayı yapılandırmak için desenleri ve bağlam kelimelerini kullanabilirsiniz. Desenleriniz ve bağlam kelimeleriniz için `0.1` ile `1.0` arasında güven puanları seçin; bu, ifadenin eşleşmesinin veya hassas verinin yanında bulunan dize veya kelimenin bulunmasının, hassas verinin varlığı anlamına geldiği konusundaki güveninizi belirtir. Daha fazla gerçek varlığı tespit etmek ve daha az yanlış pozitif üretmek için uygun puanlar kullanın.

Hassas veri, `0.3` eşik puanı sağlanıp aşıldığında tespit edilir: bağlam kelimesi puanları toplanır, desenlerden en yüksek olanı alınır. Daha iyi anlaşılması için aşağıdaki örneklere bakın.

Gerçek trafik verileri üzerinde deneme yaptıktan sonra güven puanlarını ayarlamalısınız.

**Desen Tabanlı Algılama**

Beklenen hassas veri değerine eşleşmek için [PCRE](https://www.pcre.org/) formatında bir düzenli ifade kullanın. Düzenli ifade kullandığınızda, algılama çok daha hassas hale gelir. Farklı puanlara sahip birkaç desen kullanabilirsiniz. Herhangi biri eşleşirse, hassas veri tespit edilir.

Desenler, sabit uzunluklu tokenlar, kimlikler ve URI'ler için uygundur.

**Bağlam Kelimeleri**

Wallarm, desene uyan şüpheli hassas verinin çevresindeki kelimelere bakar. Eğer herhangi bir bağlam kelimesi bulunursa, elde edilen güven puanı yükseltilir. Bağlam, URL yolu, sorgu parametresi adı, JSON anahtarları ve onun yanındaki diğer parametrelerden gelebilir.

![API Discovery – Settings - Sensitive data](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd.png)

Örneğin, yukarıdaki resimde hassas veri şunlar sayesinde tespit edilecektir:

* `JWT` veya `AWS access key ID` desenine eşleşme hemen bulunduğunda.
* `AWS key (weak)` desenine eşleşme tek başına sonuç vermez ("0.1" puanı `0.3` eşik değerinin altında kalır).
* Ancak `access` (`0.1`) ve `api` (`0.1`) bağlam kelimeleri ile toplam `0.3` olur ve hassas veri tespit edilir.
* `auth` zorunlu olarak işaretlendiğinde, durum değişir: `auth` bulunmazsa, sunulan `access` ve `api` puanları dikkate alınmaz ve desenin puanını yükseltmez.

**Sadece Bağlam Kelime Tabanlı Algılama**

Desen belirtmeden sadece bağlam kelimeleri tanımlarsanız, Wallarm hassas verinin varlığına bu kelimelerin bulunmasına dayanarak karar verir. Güven puanlarının toplamı ne kadar yüksekse, parametrenin tarif ettiğiniz hassas veriyi taşıdığı işareti o kadar artar.

Bazı yalnızca bağlam aramaları için, bazı kelimeleri **zorunlu** olarak belirtmek gerekir: eğer zorunlu kelime değerin bağlamında yer almıyorsa, parametrede hassas veri bulunmaz.

Örnek: personal_name

Bağlam kelimeleri:

* name
* first
* middle

`middle_name` eşlemesi yapılmalıdır, ancak `name` veya `middle` tek başına eşleşmemelidir. Bu nedenle, `name` için puan `0.1` olarak belirlenir ki `name` ile eşleşmesin. Ancak "middle_name" güçlü bir kombinasyon olduğundan `middle` için yüksek bir puan olan `0.5` verilmelidir.

"middle" ifadesini `name` olmadan tespit etmemek için, bir varlık için `name` zorunlu olarak belirlenir. Eğer `name` bulunmazsa, hiçbir hassas veri tespit edilmez.

![API Discovery – Settings - Sensitive data - Creating custom pattern](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd-own-pattern.png)