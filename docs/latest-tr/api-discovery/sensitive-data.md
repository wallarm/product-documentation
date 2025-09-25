# Hassas Veri Tespiti <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API Discovery, API’leriniz tarafından tüketilen ve taşınan hassas verileri tespit eder ve vurgular; böylece bu verileri korumak ve veri ihlallerini veya hassas verilerin güvensiz kanallar üzerinden ya da yetkisiz sistemlere iletilmesini önlemek için şifreleme, tokenleştirme veya diğer güvenlik kontrollerini uygulayabilirsiniz. Bu makale özelliğin nasıl kullanılacağını ve yapılandırılacağını açıklar.

Wallarm’ın hassas veri tespiti kapsamlı varsayılan yapılandırma ile kullanıma hazır gelir. Ayrıca oldukça özelleştirilebilirdir: mevcut tespit sürecine ince ayar yapabilir ve tespit edilmesi için kendi veri tiplerinizle genişletebilirsiniz.

## Varsayılan tespit

Varsayılan olarak, API Discovery aşağıdaki türde hassas verileri tespit eder:

* IP ve MAC adresleri gibi teknik veriler
* Gizli anahtarlar ve parolalar gibi oturum açma kimlik bilgileri
* Banka kartı numaraları gibi finansal veriler
* Tıbbi lisans numarası gibi tıbbi veriler
* Tam ad, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII)

Wallarm Console’da, listelenen her tür için sağlanan varsayılan [hassas veri desenleri](#customizing-sensitive-data-detection) listesini görmek için **API Discovery** → **Configure API Discovery** → **Sensitive data** bölümüne gidin.

## Hassas veri tespitinin özelleştirilmesi {#customizing-sensitive-data-detection}

Hassas veri tespitini şirketinizin özel ihtiyaçlarına ve GDPR, HIPAA, PCI DSS vb. sektör spesifik düzenlemelere tam uyumlu hale getirmek için API Discovery, tespit sürecine ince ayar yapma olanağı sunar (NGINX Node 5.0.3 veya Native Node 0.7.0 ya da üzeri gereklidir).

Özelleştirme, şirketinizin benzersiz veri koruma yükümlülüklerini karşılamanıza olanak tanır. Ayrıca, veri akışlarınızda herhangi bir tescilli veya özel hassas veri öğesi bulunuyorsa, bunları tam olarak tanımlamak için özel düzenli ifadeler tanımlama olanağından yararlanırsınız.

Hassas veri tespiti, bir dizi **hassas veri deseni** ile yapılandırılır – her desen belirli bir hassas veriyi ve onun aranmasına yönelik ayarları tanımlar. API Discovery varsayılan desen seti ile gelir. Varsayılan desenleri değiştirebilir ve kendi desenlerinizi Wallarm Console → **API Discovery** → **Configure API Discovery** → **Sensitive data** üzerinden ekleyebilirsiniz.

Varsayılan (kutudan çıkar çıkmaz) desenleri değiştirebilir veya devre dışı bırakabilir ve gerekirse bunları hızla ilk ayarlarına geri yükleyebilirsiniz. Kendi desenleriniz ise istenen anda oluşturulabilir, değiştirilebilir, devre dışı bırakılabilir ve silinebilir.

**Güven puanları**

Hassas veri tespitinizi yapılandırmak için desenler ve bağlam kelimelerini kullanabilirsiniz. Desenleriniz ve bağlam kelimeleriniz için `0.1` ile `1.0` arasında güven puanları seçerek, bu ifadeyle eşleşmenin veya hassas verinin yanında ilgili dize ya da kelimenin bulunmasının, hassas verinin varlığı anlamına geldiğinden ne kadar emin olduğunuzu belirtin. Daha fazla gerçek varlığı tespit etmek ve daha az yanlış pozitif üretmek için uygun puanları kullanın.

Puan eşik değeri `0.3`’e ulaşıldığında veya aşıldığında hassas veri tespit edilir: bağlam kelimelerinin puanları toplanır, desenlerden ise en büyüğü alınır. Daha iyi anlaşılması için aşağıdaki örneklere bakın.

Güven puanlarını gerçek trafik verileri üzerinde denedikten sonra ayarlamalısınız.

**Desen tabanlı tespit**

Beklenen hassas veri değerini eşleştirmek için [PCRE](https://www.pcre.org/) biçiminde bir düzenli ifade kullanın. Bir düzenli ifade kullandığınızda tespit çok daha hassas hale gelir. Farklı puanlara sahip birkaç desen kullanabilirsiniz. Herhangi biri eşleşirse, hassas veri tespit edilir.

Desenler, sabit uzunluktaki belirteçler (token), kimlikler (ID) ve URI’ler için uygundur.

**Bağlam kelimeleri**

Wallarm, desenle eşleşen şüpheli hassas verinin etrafındaki kelimelere bakar. Bağlam kelimelerinden herhangi biri bulunursa, ortaya çıkan güven puanını artırır. Bağlam; URL yolu, sorgu parametresi adı, JSON anahtarları ve yanındaki diğer parametrelerden gelebilir.

![API Discovery – Settings - Sensitive data](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd.png)

Örneğin, yukarıdaki görselde hassas veri şu şekilde tespit edilecektir:

* `JWT` veya `AWS access key ID` desenine eşleşme bulunursa anında.
* `AWS key (weak)` desenine eşleşme bulunursa, tek başına “evet” sonucunu vermez (`0.1` puanı `0.3` eşik değerinin altındadır).
* Ancak `access` (`0.1`) ve `api` (`0.1`) bağlam kelimeleriyle toplam `0.3` olur ve hassas veri tespit edilir.
* `auth`’u zorunlu olarak işaretlersek durum değişir: `auth` yoksa, mevcut `access` ve `api` puanları yok sayılır ve deseni güçlendiremez.

**Yalnızca bağlam kelimelerine dayalı tespit**

Desen belirtmeden bağlam kelimeleri tanımlarsanız, Wallarm hassas verinin varlığına kelimelerin varlığına göre karar verir. Güven puanlarının toplamı ne kadar yüksekse, parametrenin tanımladığınız hassas veriyi içerdiği işaretlenme olasılığı o kadar artar.

Bazı yalnızca bağlama dayalı aramalar için bazı kelimeleri **zorunlu** olarak belirtmek gerekir: zorunlu kelime değer bağlamında bulunmuyorsa, parametre hassas veri içermez.

Örnek: personal_name

Bağlam kelimeleri:

* name
* first
* middle

`middle_name` ile eşleşmeli, ancak `name` veya `middle` ile değil. Bu nedenle `name` için puanı `0.1` olarak ayarlarız, böylece `name` ile eşleşmeyiz. Ancak “middle_name” güçlü bir kombinasyon olduğundan `middle`’a `0.5` gibi yüksek bir puan vermeliyiz.

`name` olmadan “middle” tespitini önlemek için, bir varlık için `name`’i zorunlu olarak işaretleriz. `name` bulunmazsa, hassas veri tespit edilmez.

![API Discovery – Settings - Sensitive data - Özel desen oluşturma](../images/about-wallarm-waf/api-discovery/api-discovery-settings-sd-own-pattern.png)