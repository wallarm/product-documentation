[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-collect-uniq]:    ../../images/fast/dsl/en/phases/collect-uniq.png

# Toplama Aşaması

!!! info "Aşamanın Kapsamı"
    Bu aşama, bir modifiye edici genişletme içinde kullanılır ve işleminin gerekli olmadığı bir seçenektir (`collect` bölümü YAML dosyasında ya bulunmayabilir ya da bulunabilir).
    
    Ayrıca, bu aşama, tekil şartın faydalanılması nedeniyle bir nonmodifying uzantısı tarafından da dolaylı olarak kullanılır.
    
    Genişletme türlerini ayrıntılı olarak [burada][link-ext-logic] okuyun.

!!! info "İstek unsurlarının tanımlama sözdizimi"
    FAST bir genişletme oluştururken, işleme gerekli istek unsurlarını doğru bir şekilde tanımlayabilmeniz için uygulamaya gönderilen HTTP isteği ve uygulamadan alınan HTTP yanıtının yapısını anlamalısınız.
    
    Detaylı bilgiyi görmek için bu [bağlantıya][link-points] devam edin.

 Bu aşama, belirlenen durumu karşılayan tüm temel istekleri toplar. Toplama kararını verirken, bu aşama, test çalışması sırasında zaten toplanmış olan istekler hakkındaki bilgileri kullanır.

Temel istek toplama prosedürü gerçek zamanlıdır. İsteklerin her biri, FAST düğümünün temel istekleri yazdığı sırayla işlenir. İsteklerin toplanması ve Toplama aşamasında işlenmesi için isteklerin yazma sürecinin tamamlanmasını beklemeye gerek yoktur.

## Tekillik Şartı

Tekillik şartı, belirlenen kritere göre tekil olmayan temel isteklerin kalan fazlarda işleme devam etmesine izin vermez. Bu filtrelenen istekler için hiçbir test isteği oluşturulmaz. Bu, aynı türden birden çok temel istek alan hedef uygulamanın yükünü azaltmak için kullanışlı olabilir.

Alınan her isteğin tekliği, daha önce alınan isteklerdeki verilere dayanarak belirlenir.

![Tekillik şartı ile Toplama aşaması][img-collect-uniq]

Tekillik şartı, temel isteğin tekiliğinin belirlenmesi için bir istekte kullanılması gereken unsurların listesini tanımlar.

Temel bir istek aldığında, Toplama aşamasındaki genişletme, listedeki isteğin her bir unsuru için aşağıdaki işlemleri gerçekleştirir:
1. Temel istekte böyle bir unsur yoksa, listeki bir sonraki unsura devam edin.
2. Temel istekte böyle bir unsur var ve bu unsura ait veri tekilse (yani, daha önce alınan temel isteklerin verileriyle eşleşmiyorsa), bu temel isteği tekil olarak kabul edin ve onu bir sonraki aşamaya aktarın. Bu istek unsuru verilerini hatırlayın.
3. Temel istekte böyle bir unsur var ve bu unsura ait veri tekil değilse (yani, daha önce alınan bir temel istek verisiyle eşleşiyorsa), tekil şartı karşılamadığı için bu temel isteği atın. Verilen istek için genişletme çalıştırılmayacaktır.
4. Liste sonuna ulaşıldıysa ve teklik için kontrol edilebilecek hiçbir işlem unsur bulunamadıysa, bu temel isteği atın. Bu istek için genişletme çalıştırılmayacaktır.

Tekillik şartını, baz isteğin tekiliğinin hangi unsurlarla belirleneceğini içeren `uniq` listesini kullanarak genişletmenin YAML dosyasındaki `collect` bölümünde açıklayabilirsiniz.

```
collect:
  - uniq:
    - [istek unsuru]
    - [istek unsuru 1, istek unsuru 2, …, istek unsuru N]
    - testrun
```  

Listenin istekteki elemanı [Ruby düzenli ifade biçiminde düzenli ifadeleri][link-ruby-regexp] içerebilir.

`uniq` tekillik koşulu, istekteki verileri kullanarak baz isteğin tekiliğini kontrol etmek için istek unsurlarının dizisini içerir. `testrun` parametresi de kullanılabilir.

Tekillik koşulu parametreleri şunlardır:

* **`- [istek unsuru]`**
    
    İsteğin tekil olduğu kabul edilen istekte istek unsuru unique veri olmalıdır.
    
    ??? info "Örnek"
        `- [GET_uid_value]` — isteğin tekiliği, `uid` GET parametre verisi tarafından belirlenir (yani, genişletme, `uid` GET parametresinin benzersiz değere sahip her bir baz isteği için çalışmalıdır).

        * `example.com/example/app.php?uid=1` tekil bir istektir.
        * `example.com/demo/app.php?uid=1` tekil bir istek değildir.
        * `example.com/demo/app.php?uid=` tekil bir istektir.
        * `example.org/billing.php?uid=1` tekil bir istek değildir.
        * `example.org/billing.php?uid=abc` tekil bir istektir.

* **`- [istek unsuru 1, istek unsuru 2, …, istek unsuru N]`**
    
    İsteğin N elementler dizisini içermeli ve bu set içindeki istek unsuru verilerinin her biri isteğin tekil olduğu kabul edilen için benzersiz olmalıdır.
    
    ??? info "Örnek 1"
        `- [GET_uid_value, HEADER_COOKIE_value]` — İsteğin tekiliği, `uid` GET parametre verisi ve `Cookie` HTTP başlık verisi tarafından belirlenir (yani, genişletme, `uid` GET parametresinin ve `Cookie` başlığının tekil değerine sahip her bir baz isteği için çalışmalıdır).

        * `example.org/billing.php?uid=1, Cookie: client=john` tekil bir istektir.
        * `example.org/billing.php?uid=1, Cookie: client=ann` tekil bir istektir.
        * `example.com/billing.aspx?uid=1, Cookie: client=john` tekil bir istek değildir.
    
    ??? info "Örnek 2"
        `- [PATH_0_value, PATH_1_value]` — İsteğin tekiliğini ilk ve ikinci yolu unsurlarının çifti tarafından belirleyin (diğer bir deyişle, `PATH_0` ve `PATH_1` parametrelerini içeren çiftin tekil değeri olan her bir baz isteği için genişletmeyi çalıştırın).
            
        Wallarm, element işleme sırasında istek unsurlarının ayrıştırılmasını gerçekleştirir. `/en-us/apps/banking/` şeklinde olan her URI yolunun Path ayrıştırıcısı, yolu unsurlarını PATH dizisine koyar.
            
        Her bir dizi unsuru değerine dizinini kullanarak erişebilirsiniz. Önceki bahsedilen `/en-us/apps/banking/` yolu için ayrıştırıcı aşağıdaki verileri sunar:

        * `"PATH_0_value": "en-us"`
        * `"PATH_1_value": "apps"`
        * `"PATH_2_value": "banking"`
            
        Bu nedenle, `[PATH_0_value, PATH_1_value]` için teklik koşulu, ilk ve ikinci unsurda farklı değerler içeren herhangi bir istek tarafından karşılanır.

        * `example.com/en-us/apps/banking/charge.php` tekil bir istektir.
        * `example.com/en-us/apps/banking/vip/charge.php` tekil bir istek değildir.
        * `example.com/de-de/apps/banking/vip/charge.php` tekil bir istektir.
    
* **`- testrun`**
    
    Test isteği başarıyla oluşturulduğunda (yani diğer tüm aşamalar geçilirse) genişletme bir test çalışmasında bir kez çalıştırılacaktır.
    
    Örneğin, alınan baz isteğine dayanarak hiçbir test isteği oluşturulamazsa, Match aşamasında baz isteklerin atılması nedeniyle Toplama aşamasındaki genişletme, onlardan biri Match aşamasından geçirilene ve ardından hedef uygulamaya yönelik test istekleri bunun temelinde oluşturulana kadar baz isteklerin toplamasına devam eder.
    
    `uniq` listesinde herhangi bir istek unsuru kullanmanıza izin verilmez eğer zaten `testrun` parametresini kullanıyorsanız. `uniq` tekilik koşulu tek bir unsuru içerecektir.
    
    ```
    collect:
      - uniq:
        - testrun 
    ```
    
    Eğer `uniq` listesinde birden çok unsur varsa, baz isteğin tekil olarak tanımlanabilmesi için isteğin `uniq` listesinden en az bir tekil parametreye sahip olması gereklidir. 



!!! info "Toplama aşaması parametreleri"
    Şu anda, Toplama aşamasında sadece temel istekler için tekilik koşulu desteklenmektedir. İleride, bu aşama işlevleri genişletilebilir.
