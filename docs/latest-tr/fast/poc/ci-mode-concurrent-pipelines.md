[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   Eşzamanlı CI/CD İş Akışlarında FAST'in Kullanımı

!!! info "Gerekli veriler" 
    Bu belgede örnek olarak aşağıdaki değerler kullanılmaktadır:

    * `token_Qwe12345` bir belirteç olarak.
    * `rec_1111` ve `rec_2222` test kayıtlarının tanımlayıcıları olarak.

Birden fazla FAST düğümü eşzamanlı CI/CD iş akışlarında aynı anda dağıtılabilir. Bu düğümler aynı belirteci paylaşır ve tek bir bulut FAST düğümüyle çalışır.

Bu dağıtım şeması, hem [kayıt][doc-ci-recording] hem de [test][doc-ci-testing] modlarında çalışan FAST düğümleri için geçerlidir.

Eşzamanlı FAST düğümleri çalışırken çakışmaları önlemek için, her düğümün konteynerine `BUILD_ID` ortam değişkeni iletilir. Bu değişken şu amaçlara hizmet eder:
1.  Kayıt modunda çalışan bir FAST düğümünün oluşturduğu test kaydı için ek bir tanımlayıcı olarak kullanılır.
2.  Test modunda çalışan bir FAST düğümünün oluşturduğu test çalıştırmasının hangi test kaydını kullanacağını belirlemeyi sağlar (böylece test çalıştırması test kaydına bağlanır).
3.  Belirli bir CI/CD iş akışını tanımlar.

`BUILD_ID` ortam değişkeni değer olarak harf ve rakamların herhangi bir kombinasyonundan oluşabilir.

Sonraki adımda, iki FAST düğümünün aynı anda nasıl çalıştırılacağına ilişkin bir örnek verilecektir: önce kayıt modunda, ardından test modunda. Aşağıda açıklanan yaklaşım ölçeklenebilirdir (gerektiği kadar düğüm kullanabilirsiniz; düğüm sayısı aşağıdaki örnekte olduğu gibi ikiyle sınırlı değildir) ve gerçek bir CI/CD iş akışında uygulanabilir.


##  Eşzamanlı CI/CD İş Akışlarında Kullanmak Üzere FAST Düğümünü Kayıt Modunda Çalıştırma

!!! info "Örnekler hakkında not"
    Aşağıdaki örnekler, bir FAST düğümü konteynerinin ayağa kalkıp çalışması için yeterli olan asgari ortam değişkenleri kümesini kullanır. Bu, basitlik içindir. 

İlk FAST düğümü konteynerini kayıt modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-1 \    # Bu komut fast-node-1 konteynerini çalıştırır
-e WALLARM_API_HOST=api.wallarm.com \   # Wallarm API sunucu ana makinesi (bu örnekte ana makine Avrupa Wallarm Cloud'unda bulunur)
-e WALLARM_API_TOKEN='qwe_12345' \      # Bulut FAST düğümüne bağlanmak için belirteç
-e CI_MODE=recording \                  # Bu düğüm kayıt modunda çalışacaktır
-e BUILD_ID=1 \                         # BUILD_ID değeri (eşzamanlı işlem hattı için diğerinden farklı olmalıdır)
-p 8080:8080 wallarm/fast               # Bağlantı noktası eşlemesi burada yapılır. Ayrıca kullanılacak Docker imajı burada belirtilir.
```

İkinci eşzamanlı FAST düğümü konteynerini kayıt modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # Belirteç değeri ilk FAST düğümü için kullanılanla aynı olmalıdır
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # BUILD_ID değeri, diğer CI/CD iş akışındaki ilk FAST düğümünde kullanılan değerden farklıdır.
-p 8000:8080 wallarm/fast
```

!!! info "`docker run` komutlarına ilişkin not"
    Yukarıdaki komutların aynı Docker ana makinesinde çalıştırılması amaçlanmıştır; bu nedenle farklı `BUILD_ID` değerlerine ek olarak bu komutların konteyner adları (`fast-node-1` ve `fast-node-2`) ve hedef bağlantı noktası değerleri (`8080` ve `8000`) da farklıdır.
    
    FAST düğümü konteynerlerini ayrı Docker ana makinelerinde çalıştırırsanız, `docker run` komutları yalnızca `BUILD_ID` değerlerinde farklılık gösterebilir.

Bu iki komutu çalıştırdıktan sonra, iki FAST düğümü aynı bulut FAST düğümünü kullanarak kayıt modunda çalışacak, ancak **farklı test kayıtları oluşturulacaktır**.

CI/CD aracı konsol çıktısı [burada][doc-ci-recording-example] açıklanana benzer olacaktır.

Test kayıtları gerekli tüm temel isteklerle doldurulduğunda, ilgili FAST düğümlerini kapatın ve diğer düğümleri test modunda başlatın.

##  Eşzamanlı CI/CD İş Akışlarında Kullanmak Üzere FAST Düğümünü Test Modunda Çalıştırma

`fast-node-1` ve `fast-node-2` FAST düğümleri kayıt modunda çalışırken `rec_1111` ve `rec_2222` test kayıtlarının hazırlandığını varsayalım.  

Ardından, test modundaki bir FAST düğümünü `rec_1111` test kaydını kullanacak şekilde yönlendirmek için düğüm konteynerine `BUILD_ID=1` ortam değişkenini iletin. Benzer şekilde, `rec_2222` test kaydını kullanmak için `BUILD_ID=2` ortam değişkenini iletin. FAST düğümlerini test modunda çalıştırmak için aşağıdaki ilgili `docker run` komutlarını kullanın.

İlk FAST düğümü konteynerini test modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm test modunda çalışacaktır
-e BUILD_ID=1 \                         # `BUILD_ID=1` değişkeni `rec_1111` test kaydına karşılık gelir
wallarm/fast
```

İkinci eşzamanlı FAST düğümü konteynerini kayıt modunda çalıştırmak için aşağıdaki komutu çalıştırın:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Bu düğüm test modunda çalışacaktır
-e BUILD_ID=2 \                         # `BUILD_ID=2` değişkeni `rec_2222` test kaydına karşılık gelir
wallarm/fast
```

CI/CD aracı konsol çıktısı [burada][doc-ci-testing-example] açıklanana benzer olacaktır.

FAST düğümlerine ilgili `BUILD_ID` ortam değişkeni değerlerinin iletilmesi sonucunda, her biri farklı bir test kaydıyla çalışan **iki test çalıştırması aynı anda yürütülmeye başlayacaktır**.

Dolayısıyla `BUILD_ID` ortam değişkenini belirterek, düğümler arasında herhangi bir çakışma oluşturmadan eşzamanlı CI/CD iş akışları için birkaç FAST düğümü çalıştırabilirsiniz (yeni oluşturulan bir test çalıştırması, çalışmakta olan bir test çalıştırmasının yürütülmesini sonlandırmayacaktır).