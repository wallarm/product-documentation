[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   Eş zamanlı CI/CD Akışlarında FAST Kullanımı

!!! info "Gerekli veri" 
    Aşağıdaki değerler bu belgede örnek olarak kullanılmıştır:

    * `token_Qwe12345` bir belirteç olarak.
    * `rec_1111` ve `rec_2222` test kayıtları tanımlayıcıları olarak.

Birkaç FAST düğümü eş zamanlı CI/CD akışlarında aynı anda dağıtılabilir. Bu düğümler aynı belirteci paylaşır ve tek bir bulut FAST düğümüyle çalışır.

Bu dağıtım şeması, hem [kaydedici][doc-ci-recording] hem de [test][doc-ci-testing] modlarında çalışan FAST düğümlerine uygulanabilir.

Aynı anda operasyon yapan FAST düğümlerinde çakışmaların önlenmesi için `BUILD_ID` çevre değişkeni her düğümün konteynerine geçirilir. Bu değişken aşağıdaki amaçlara hizmet eder:
1.  Bir FAST düğümü tarafından kayıt modunda oluşturulan bir test kaydının ilave tanımlayıcısı olarak kullanılır.
2.  Bir FAST düğümü tarafından test modunda oluşturulan bir test çalışmasının hangi test kaydını kullanması gerektiğini belirler (bu sayede test çalışması test kayıtlarına bağlı hale getirilir). 
3.  Belirli bir CI/CD akışını tanımlar.

`BUILD_ID` çevre değişkeni değeri, harf ve rakamların herhangi bir kombinasyonunu içerebilir.

Ardından, önce kayıt modunda, ardından test modunda olacak şekilde iki FAST düğümünün aynı anda nasıl çalıştırılacağına dair bir örnek verilecektir. Aşağıda açıklanan yaklaşım ölçeklenebilir (ihtiyacınız olan kadar çok düğüm kullanabilirsiniz, düğüm sayısı örnekteki iki ile sınırlı değildir) ve gerçek bir CI/CD akışına uygulanabilir.

##  Eş zamanlı CI/CD Akışlarında Kayıt Modunda Kullanılacak FAST Düğümünün Çalıştırılması

!!! info "Örnekler hakkında not"
    Aşağıdaki örnekler, bir FAST düğümü konteynerinin işler duruma gelebilmesi için gerekli olan temel çevre değişkenlerini kullanır. Bu, basitlik adınadır. 

İlk FAST düğümü konteynerini kayıt modunda çalıştırmak için aşağıdaki komutu çalıştırın:


```markdown
docker run --rm --name fast-node-1 \    # Bu komut fast-node-1 konteynerini çalıştırır
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm API sunucusu hostu (bu durumda host Avrupa Wallarm bulutunda bulunmaktadır)
-e WALLARM_API_TOKEN='qwe_12345' \      # Bulut FAST düğümüne bağlanmak için belirteç
-e CI_MODE=recording \                  # Bu düğüm kayıt modunda çalışacak
-e BUILD_ID=1 \                         # BUILD_ID değeri (eş zamanlı boru hattı için diğerinden farklı olmalı)
-p 8080:8080 wallarm/fast               # Port eşleme burada yapılıyor. Ayrıca, kullanılacak Docker imajı burada belirtiliyor.
```

İkinci eş zamanlı FAST düğümü konteynerini kayıt modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # Belirteç değeri ilk FAST düğümü için kullanılanla aynı olmalıdır
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_ID değeri, ilk FAST düğümüdeki başka bir CI/CD akışı için kullanılandan farklı.
-p 8000:8080 wallarm/fast
```

!!! info "`docker run` komutları hakkında not"
    Yukarıdaki komutların aynı Docker ana bilgisayarı üzerinde çalıştırılması beklenir, bu nedenle farklı `BUILD_ID` değerlerine ek olarak bu komutların farklı konteyner isimleri (`fast-node-1` ve `fast-node-2`) ve hedef port değerleri (`8080` ve `8000`) vardır.
    
    Eğer FAST düğümü konteynerlerini ayrı Docker ana bilgisayarlarında çalıştırıyorsanız, o zaman `docker run` komutları sadece `BUILD_ID` değerlerinde farklılık gösterebilir.

Bu iki komutun yürütülmesinin ardından, iki FAST düğümü aynı bulut FAST düğümünü kullanarak kayıt modunda çalışacak, ancak **farklı test kayıtları oluşturulacaktır**.

CI/CD aracı konsol çıktısı, [burada][doc-ci-recording-example] anlatıldığına benzer olacaktır.

Test kayıtları gerekli tüm temel isteklerle doldurulduğunda, ilgili FAST düğümlerini kapatın ve test modunda başka düğümler başlatın.

##  Eş zamanlı CI/CD Akışlarında Test Modunda Kullanılacak FAST Düğümünün Çalıştırılması

`rec_1111` ve `rec_2222` test kayıtlarının, FAST düğümleri `fast-node-1` ve `fast-node-2` kayıt modunda çalışırken hazırlandığını varsayalım.  

Sonra, bir FAST düğümünü test modunda `rec_1111` test kaydını kullanacak şekilde yönlendirmek için, düğüm konteynerine `BUILD_ID=1` çevre değişkenini geçirin. Benzer şekilde, `rec_2222` test kaydını kullanmak için `BUILD_ID=2` çevre değişkenini geçirin. Aşağıdaki ilgili `docker run` komutlarını kullanarak FAST düğümlerini test modunda çalıştırın.

İlk FAST düğümü konteynerini test modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm test modunda çalışacak
-e BUILD_ID=1 \                         # `BUILD_ID=1` değişkeni `rec_1111` test kaydıyla ilişkilidir
wallarm/fast
```

İkinci eş zamanlı FAST düğümü konteynerini test modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm test modunda çalışacak
-e BUILD_ID=2 \                         # `BUILD_ID=2` değişkeni `rec_2222` test kaydıyla ilişkilidir
wallarm/fast
```

CI/CD aracı konsol çıktısı, [burada][doc-ci-testing-example] anlatıldığına benzer olacaktır.

FAST düğümlerine ilgili `BUILD_ID` çevre değişkenlerinin değerlerini geçirilmesinin sonucunda, **iki test çalışması aynı anda çalışmaya başlayacak**, her biri farklı bir test kaydıyla çalışacak.

Bu şekilde, `BUILD_ID` çevre değişkenini belirterek birkaç FAST düğümünü eş zamanlı CI/CD akışlarında çalıştırabilirsiniz ve düğümler arasında herhangi bir çakışma oluşmaz (yeni oluşturulan bir test çalışması, çalışan bir test çalışmasının yürütülmesini iptal etmez).  