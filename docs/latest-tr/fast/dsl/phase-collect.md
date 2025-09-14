[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-collect-uniq]:    ../../images/fast/dsl/en/phases/collect-uniq.png

# Collect Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, değiştirici (modifying) bir uzantıda kullanılır ve çalışması için isteğe bağlıdır (`collect` bölümü YAML dosyasında bulunmayabilir veya bulunabilir).
    
    Ayrıca, benzersizlik koşulunu kullandığı için bu aşama, değişiklik yapmayan (nonmodifying) bir uzantı tarafından da örtük olarak kullanılır.
    
    Uzantı türleri hakkında ayrıntılı bilgiyi [burada][link-ext-logic] okuyun.

!!! info "İstek öğeleri açıklama söz dizimi"
    FAST uzantısı oluştururken, points kullanarak üzerinde çalışmanız gereken istek öğelerini doğru tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir.
    
    Ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.

 Bu aşama, belirtilen koşulu sağlayan tüm temel (baseline) istekleri toplar. Bir isteğin toplanmasına karar verirken, aşama test çalışması sırasında daha önce toplanmış istekler hakkındaki bilgileri kullanır.

Temel istek toplama prosedürü gerçek zamanlı gerçekleşir. Her bir istek, FAST düğümünün temel istekleri yazdığı sıraya göre işlenir. Collect aşaması tarafından isteklerin işlenip toplanabilmesi için, istek yazma sürecinin tamamlanmasını beklemeye gerek yoktur.

## Benzersizlik Koşulu

Benzersizlik koşulu, belirtilen ölçütlere göre benzersiz olmayan temel isteklerin kalan aşamalarda işlenmesine izin vermez. Bu şekilde elenen istekler için test istekleri oluşturulmaz. Hedef uygulama aynı türden birden fazla temel istek alıyorsa yükün azaltılmasında yararlı olabilir.

Alınan her isteğin benzersizliği, daha önce alınmış isteklerdeki verilere dayanarak belirlenir.

![Benzersizlik koşullu Collect aşaması][img-collect-uniq]

Temel isteğin benzersizliğini belirlemek için kullanılacak istek öğelerinin listesi, benzersizlik koşulunda tanımlanır.

Temel istek alındığında, Collect aşamasındaki uzantı listedeki her bir istek öğesi için aşağıdaki işlemleri gerçekleştirir:
1. Temel istekte böyle bir öğe yoksa, listedeki bir sonraki öğeye geçin.
2. Temel istekte böyle bir öğe varsa ve bu öğenin verisi benzersizse (başka bir deyişle, daha önce alınan temel isteklerin hiçbirinin verisiyle eşleşmiyorsa), bu temel isteği benzersiz olarak kabul edin ve sonraki aşamalara iletin. Bu istek öğesinin verisini hatırlayın.
3. Temel istekte böyle bir öğe varsa ve bu öğenin verisi benzersiz değilse (başka bir deyişle, daha önce alınan temel isteklerin verileriyle eşleşiyorsa), bu temel isteği benzersizlik koşulunu karşılamadığından dolayı el deyin. Uzantı bu istek için yürütülmeyecektir.
4. Listenin sonuna gelinirse ve benzersizlik için kontrol edilebilecek herhangi bir istek öğesi bulunamazsa, bu temel isteği el deyin. Uzantı bu istek için yürütülmeyecektir.

Benzersizlik koşulunu, uzantının YAML dosyasındaki `collect` bölümünde, temel isteğin benzersizliğinin tanımlanacağı öğeleri içeren `uniq` listesiyle ifade edebilirsiniz.

```
collect:
  - uniq:
    - [request element]
    - [request element 1, request element 2, …, request element N]
    - testrun
```  

Listedeki istek öğesi, [Ruby düzenli ifade biçiminde düzenli ifadeler][link-ruby-regexp] içerebilir.

`uniq` benzersizlik koşulu, temel isteğin benzersizliğini kontrol etmek için kullanılan verileri içeren istek öğelerinden oluşan bir diziden oluşur. Ayrıca `testrun` parametresi de kullanılabilir.

Benzersizlik koşulu parametreleri şunlardır:

* **`- [request element]`**
    
    İsteğin benzersiz sayılması için, istek öğesindeki verinin benzersiz olması gerekir.
    
    ??? info "Örnek"
        `- [GET_uid_value]` — isteğin benzersizliği `uid` GET parametresi verisine göre tanımlanır (başka bir deyişle, uzantı `uid` GET parametresinin benzersiz değerine sahip her bir temel istek için çalıştırılmalıdır).

        * `example.com/example/app.php?uid=1` benzersiz bir istektir.
        * `example.com/demo/app.php?uid=1` benzersiz bir istek değildir.
        * `example.com/demo/app.php?uid=` benzersiz bir istektir.
        * `example.org/billing.php?uid=1` benzersiz bir istek değildir.
        * `example.org/billing.php?uid=abc` benzersiz bir istektir.

* **`- [request element 1, request element 2, …, request element N]`**
    
    İsteğin benzersiz sayılması için, N öğesinden oluşan bir küme içermeli ve bu kümenin her bir istek öğesi verisi benzersiz olmalıdır.
    
    ??? info "Örnek 1"
        `- [GET_uid_value, HEADER_COOKIE_value]` — isteğin benzersizliği `uid` GET parametresi verisi ve `Cookie` HTTP başlığı verisine göre belirlenir (başka bir deyişle, uzantı `uid` GET parametresinin ve `Cookie` başlığının benzersiz değerine sahip her bir temel istek için çalıştırılmalıdır).

        * `example.org/billing.php?uid=1, Cookie: client=john` benzersiz bir istektir.
        * `example.org/billing.php?uid=1, Cookie: client=ann` benzersiz bir istektir.
        * `example.com/billing.aspx?uid=1, Cookie: client=john` benzersiz bir istek değildir.
    
    ??? info "Örnek 2"
        `- [PATH_0_value, PATH_1_value]` — isteğin benzersizliğini yolun birinci ve ikinci öğesinden oluşan çifte göre tanımlayın (başka bir deyişle, `PATH_0` ve `PATH_1` parametrelerini içeren çiftin benzersiz değerine sahip her bir temel istek için uzantıyı çalıştırın).
            
        Wallarm, öğe işleme sırasında istek öğelerini ayrıştırır. `/en-us/apps/banking/` biçimindeki her bir URI yolu için Path ayrıştırıcısı, yolun her öğesini PATH dizisine yerleştirir.
            
        Dizi öğelerinin her birinin değerine dizinini kullanarak erişebilirsiniz. Yukarıda bahsedilen `/en-us/apps/banking/` yolu için ayrıştırıcı aşağıdaki verileri sağlar:

        * `"PATH_0_value": "en-us"`
        * `"PATH_1_value": "apps"`
        * `"PATH_2_value": "banking"`
            
        Dolayısıyla, `[PATH_0_value, PATH_1_value]` için benzersizlik koşulu, yolun birinci ve ikinci öğesinde farklı değerler içeren herhangi bir istek tarafından sağlanır.

        * `example.com/en-us/apps/banking/charge.php` benzersiz bir istektir.
        * `example.com/en-us/apps/banking/vip/charge.php` benzersiz bir istek değildir.
        * `example.com/de-de/apps/banking/vip/charge.php` benzersiz bir istektir.
    
* **`- testrun`**
    
    Test isteği başarıyla oluşturulursa (başka bir deyişle, diğer tüm aşamalar geçilirse), uzantı test çalışması başına bir kez yürütülür.
    
    Örneğin, alınan temel isteğe dayanarak test istekleri oluşturulamıyorsa, çünkü temel istekler Match aşamasında eleniyorsa, Collect aşamasındaki uzantı temel istekleri toplamaya, bunlardan biri Match aşamasından geçip hedef uygulama için test istekleri onun üzerinden oluşturulana kadar devam eder.
    
    `testrun` parametresini kullanıyorsanız, `uniq` listesinde herhangi bir istek öğesini kullanmak yasaktır. `uniq` benzersizlik koşulu tek bir öğe içerecektir.
    
    ```
    collect:
      - uniq:
        - testrun 
    ```
    
    `uniq` listesinde birden fazla öğe varsa, temel isteğin benzersiz sayılabilmesi için istek, `uniq` listesindeki en az bir benzersiz parametreye sahip olmalıdır. 



!!! info "Collect aşaması parametreleri"
    Şu anda Collect aşamasında yalnızca alınan temel istekler için benzersizlik koşulu desteklenmektedir. Gelecekte, bu aşamanın işlevselliği genişletilebilir.