[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-collect-uniq]:    ../../images/fast/dsl/en/phases/collect-uniq.png

# Toplama Aşaması

!!! info "Aşamanın Kapsamı"
    Bu aşama, değiştiren bir uzantıda kullanılır ve çalışması için isteğe bağlıdır (YAML dosyasında `collect` bölümü bulunmayabilir veya mevcut olabilir).

    Ayrıca, bu aşama, değişiklik yapmayan bir uzantı tarafından, bu uzantı türü benzersizlik koşulunu kullandığından dolayı örtük olarak kullanılır.

    Uzantı türleri hakkında detaylı bilgiyi [buradan][link-ext-logic] okuyabilirsiniz.

!!! info "İstek öğelerinin tanımlama sözdizimi"
    Bir FAST uzantısı oluştururken, üzerinde çalışmak istediğiniz istek öğelerini doğru biçimde tanımlayabilmek için, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekmektedir.

    Detaylı bilgi için bu [linkten][link-points] devam edin.

Bu aşama, belirlenen koşulu karşılayan tüm temel istekleri toplar. Bir isteğin toplanıp toplanmayacağına karar vermek için, aşama, test çalışması sırasında zaten toplanmış istekler hakkındaki bilgileri kullanır.

Temel istek toplama işlemi gerçek zamanlı olarak gerçekleştirilir. İsteklerin her biri, FAST düğümünün temel istekleri yazdığı sırayla işlenecektir. İsteklerin işlenip Toplama aşaması tarafından toplanması için, istek yazma sürecinin tamamlanmasını beklemeye gerek yoktur.

## Benzersizlik Koşulu

Benzersizlik koşulu, belirtilen kriterlere göre benzersiz olmayan temel isteklerin kalan aşamalarda işlenmesine izin vermez. Bu filtrelenen istekler için hiçbir test isteği oluşturulmaz. Bu durum, aynı tipte birden fazla temel istek alındığında hedef uygulamanın yükünü azaltmada yararlı olabilir.

Alınan her isteğin benzersizliği, daha önce alınan isteklerdeki verilere dayanılarak belirlenir.

![The Collect phase with the uniqueness condition][img-collect-uniq]

Temel isteğin benzersizliğini belirlemek için kullanılacak istek öğelerinin listesi, benzersizlik koşulunda tanımlanır.

Temel istek alındığında, Toplama aşamasındaki uzantı, listedeki her istek öğesi için aşağıdaki işlemleri gerçekleştirir:
1. Temel istek içinde böyle bir öğe yoksa, listedeki bir sonraki öğeye geçin.
2. Temel istek içinde böyle bir öğe varsa ve bu öğenin verisi benzersiz ise (yani, daha önce alınan temel isteklerin verileriyle eşleşmiyorsa), bu temel isteği benzersiz olarak değerlendirir ve sonraki aşamalara aktarır. Bu istek öğesinin verilerini kaydedin.
3. Temel istek içinde böyle bir öğe varsa fakat bu öğenin verisi benzersiz değilse (yani, daha önce alınan temel istek verileriyle eşleşiyorsa), bu temel isteği benzersizlik koşulunu sağlamadığı için reddedin. Bu istek için uzantı çalıştırılmaz.
4. Liste sonuna gelindiğinde ve benzersizliğini kontrol edebileceğiniz bir istek öğesi bulunamadığında, bu temel isteği reddedin. Bu istek için uzantı çalıştırılmaz.

Temel isteğin benzersizliğinin tanımlanacağı öğeleri içeren `uniq` listesini kullanarak, benzersizlik koşulunu uzantının YAML dosyasındaki `collect` bölümünde tanımlayabilirsiniz.

```
collect:
  - uniq:
    - [request element]
    - [request element 1, request element 2, …, request element N]
    - testrun
```  

Listedeki istek öğesi, [Ruby düzenli ifade formatında düzenli ifadeler][link-ruby-regexp] içerebilir.

`uniq` benzersizlik koşulu, temel isteğin benzersizliğini kontrol etmek için kullanılan verileri içeren istek öğeleri dizisini kapsar. Ayrıca `testrun` parametresi de kullanılabilir.

Benzersizlik koşulu parametreleri aşağıdaki gibidir:

* **`- [request element]`**
    
    İsteğin benzersiz kabul edilebilmesi için, istek öğesi benzersiz veriler içermelidir.
    
    ??? info "Örnek"
        `- [GET_uid_value]` — isteğin benzersizliği, `uid` GET parametresi verisi ile tanımlanır (diğer bir deyişle, uzantı, `uid` GET parametresinin benzersiz değere sahip her temel istekte çalıştırılmalıdır).

        * `example.com/example/app.php?uid=1` benzersiz bir istektir.
        * `example.com/demo/app.php?uid=1` benzersiz bir istek değildir.
        * `example.com/demo/app.php?uid=` benzersiz bir istektir.
        * `example.org/billing.php?uid=1` benzersiz bir istek değildir.
        * `example.org/billing.php?uid=abc` benzersiz bir istektir.

* **`- [request element 1, request element 2, …, request element N]`**
    
    İstek, N öğeden oluşan bir set içermeli ve bu setlerdeki her istek öğesi verisi, isteğin benzersiz kabul edilebilmesi için benzersiz olmalıdır.
    
    ??? info "Örnek 1"
        `- [GET_uid_value, HEADER_COOKIE_value]` — isteğin benzersizliği, `uid` GET parametresi verisi ve `Cookie` HTTP başlık verisi ile belirlenir (diğer bir deyişle, uzantı, `uid` GET parametresi ve `Cookie` başlığının benzersiz değere sahip olduğu her temel istekte çalıştırılmalıdır).

        * `example.org/billing.php?uid=1, Cookie: client=john` benzersiz bir istektir.
        * `example.org/billing.php?uid=1, Cookie: client=ann` benzersiz bir istektir.
        * `example.com/billing.aspx?uid=1, Cookie: client=john` benzersiz bir istek değildir.
    
    ??? info "Örnek 2"
        `- [PATH_0_value, PATH_1_value]` — isteğin benzersizliğini, path'in ilk ve ikinci öğesinin ikilisi ile tanımlayın (diğer bir deyişle, uzantı, `PATH_0` ve `PATH_1` parametrelerini içeren çiftin benzersiz değere sahip olduğu her temel istekte çalıştırılmalıdır).
            
        Wallarm, istek öğelerinin işlenmesi sırasında ayrıştırma yapar. `/en-us/apps/banking/` biçimindeki her URI path için, Path ayrıştırıcısı, path'in her bir öğesini PATH dizisine yerleştirir.
            
        Dizinin her öğesine indeks kullanılarak erişilebilir. Daha önce bahsedilen `/en-us/apps/banking/` path için, ayrıştırıcı aşağıdaki verileri sağlar:

        * `"PATH_0_value": "en-us"`
        * `"PATH_1_value": "apps"`
        * `"PATH_2_value": "banking"`
            
        Böylece, `[PATH_0_value, PATH_1_value]` benzersizlik koşulu, path'in ilk ve ikinci öğelerinde farklı değerlere sahip her istek tarafından karşılanacaktır.

        * `example.com/en-us/apps/banking/charge.php` benzersiz bir istektir.
        * `example.com/en-us/apps/banking/vip/charge.php` benzersiz bir istek değildir.
        * `example.com/de-de/apps/banking/vip/charge.php` benzersiz bir istektir.
    
* **`- testrun`**
    
    Test isteği başarıyla oluşturulursa (yani, diğer tüm aşamalar geçilirse) uzantı, test çalışması sırasında bir kez çalıştırılır.
    
    Örneğin, eşleşme aşamasında temel isteklerin reddedilmesi nedeniyle alınan temel isteğe dayalı olarak hiçbir test isteği oluşturulamıyorsa, Toplama aşamasındaki uzantı, temel isteklerden biri Eşleşme aşaması tarafından işlenene kadar temel istekleri toplamaya devam eder ve ardından bu isteğe dayalı olarak hedef uygulama için test istekleri oluşturulur.
    
    `uniq` listesinde bulunan herhangi bir istek öğesini, `testrun` parametresini zaten kullanıyorsanız kullanmak yasaktır. `uniq` benzersizlik koşulu, tek bir öğe içerecektir.
    
    ```
    collect:
      - uniq:
        - testrun 
    ```
    
    Eğer `uniq` listesinde birden fazla öğe varsa, temel isteğin benzersiz olarak tanımlanabilmesi için, isteğin `uniq` listesindeki en az bir benzersiz parametreye sahip olması gerekmektedir.



!!! info "Toplama Aşaması Parametreleri"
    Şu anda, Toplama aşamasında yalnızca alınan temel istekler için benzersizlik koşulu desteklenmektedir. Gelecekte, bu aşamanın işlevselliği genişletilebilir.