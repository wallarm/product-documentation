[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png

# Yanıltıcı saldırılarla çalışma

**Yanlış pozitif**, meşru bir istekte saldırı belirtilerinin tespit edilmesi durumudur. Bir saldırıyı analiz ettikten sonra, bu saldırıdaki tüm veya bazı isteklerin yanlış pozitif olduğu sonucuna varabilirsiniz. Bu tür isteklerin filtreleme düğümünün gelecekteki trafik analizinde saldırılar olarak tanımlanmasını önlemek için, birkaç isteği veya tüm saldırıyı yanlış pozitif olarak işaretleyebilirsiniz.

## Yanlış pozitif işareti nasıl çalışır?

* [Bilgi Maruz Kalma](../../attacks-vulns-list.md#information-exposure) türünden farklı olan bir saldırı için yanlış pozitif bir işaret eklenirse, tespit edilen saldırı belirtileri için aynı isteklerin analizini devre dışı bırakan bir kural ([tokenler](../../about-wallarm/protecting-against-attacks.md#library-libproton)) otomatik olarak oluşturulur.
* [Bilgi Maruz Kalma](../../attacks-vulns-list.md#information-exposure) saldırı türündeki bir olay için yanlış pozitif bir işaret eklenirse, tespit edilen [kırılganlık belirtileri](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) için aynı isteklerin analizini devre dışı bırakan bir kural otomatik olarak oluşturulur.

Oluşturulan kural, korunan uygulamaya yönelik isteklerin analizi sırasında uygulanır. Kural, Wallarm Konsolu'nda görüntülenmez ve yalnızca [Wallarm teknik destek](mailto: support@wallarm.com) tarafından gönderilen bir istekle değiştirilebilir veya kaldırılabilir.

## Bir isabeti yanlış pozitif olarak işaretle

Bir isteği (isabet) yanlış pozitif olarak işaretlemek için:

1. Wallarm Konsolu → **Olaylar**'da, yanıltıcı bir pozitif gibi görünen saldırıdaki isteklerin listesini genişletin.

    İstek analizinin süresini azaltmak için, kesinlikle kötü amaçlı olan istekleri [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits) kullanarak gizleyebilirsiniz.
2. Geçerli bir istek belirleyin ve **Actions** sütunundaki **False**'u tıklayın.

    ![Yanlış isabet][img-false-attack]

## Bir saldırıyı yanlış pozitif olarak işaretle

Bir saldırıdaki tüm talepleri (isabetler) yanlış pozitif olarak işaretlemek için:

1. Wallarm Konsolu → **Events**'da, geçerli isteklerle bir saldırıyı seçin.

    İstek analizinin süresini azaltmak için, kesinlikle kötü amaçlı olan istekleri [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits) kullanarak gizleyebilirsiniz.
2. **Mark as false positive**'ı tıklayın.

    ![Yanlış saldırı](../../images/user-guides/events/analyze-attack.png)

!!! warning "Bir saldırı IP'lerle gruplandırılmış isabetlerse"
    Bir saldırı, IP adreslerine göre [gruplandırılmış](../../about-wallarm/protecting-against-attacks.md#attack) isabetlerden oluşuyorsa, **Mark as false positive** düğmesi kullanılamaz hale gelir. Belirli isabetleri yanlış pozitif olarak [işaretleyebilirsiniz](#mark-a-hit-as-a-false-positive).

Saldırıdaki tüm istekler yanlış pozitif olarak işaretlenirse, bu saldırı hakkındaki bilgiler şöyle görünür:

![Tüm saldırı yanlış olarak işaretlendi][img-removed-attack-info]


## Yanlış pozitif işaretini kaldır

Bir isabet veya saldırıdan yanlış pozitif işaretini kaldırmak için [Wallarm teknik destek](mailto: support@wallarm.com) adresine bir istek gönderin. Ayrıca, işaret uygulandıktan birkaç saniye sonra Wallarm Konsolu'ndaki iletişim kutusunda bir yanlış pozitif işaretini geri alabilirsiniz.

## Saldırı listesinde yanlış pozitiflerin görüntülenmesi

Wallarm Konsolu ayrı bir filtre aracılığıyla saldırı listesinde yanlış pozitiflerin görüntülenmesini kontrol etmeyi etkinleştirir. Aşağıdaki filtre seçenekleri bulunur:

* **Varsayılan görünüm**: yalnızca gerçek saldırılar
* **Yanlış pozitiflerle birlikte**: gerçek saldırılar ve yanlış pozitifler
* **Yalnızca yanlış pozitifler**

![Yanlış pozitif filtresi](../../images/user-guides/events/filter-for-falsepositive.png)
