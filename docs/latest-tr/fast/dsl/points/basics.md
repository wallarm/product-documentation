[link-fast]:                ../intro.md
[link-parsers]:             parsers.md

# Temel Kavramlar

[FAST uzantıları][link-fast], yeni test istekleri oluşturmak için kullanılan temel istek öğesi işleme mantığını açıklar. Noktaların başlıca amacı, uzantıda tanımlanan eylemlerden hangisinin temel isteğin hangi veri parçasına uygulanacağını belirtmektir.

Bir nokta, uzantıda belirtilen eylemin uygulanacağı temel isteğin bölümünü işaret eden bir dizedir. Bu dize, gerekli veriyi elde etmek için temel isteğe uygulanması gereken ayrıştırıcı ve filtre adlarının bir dizisinden oluşur.

* *Ayrıştırıcılar*, alınan dize girdisine dayanarak veri yapıları oluşturur. 
* *Filtreler* 
ayrıştırıcılar tarafından oluşturulan veri yapılarından belirli değerleri elde etmek için kullanılır. 

Filtrelerin işaret ettiği değerlere başka filtreler ve ayrıştırıcılar da uygulanabilir. İstek üzerine ayrıştırıcıları ve filtreleri ardışık olarak uygulayarak, sonraki işlem için gereken istek öğesi değerlerini çıkarabilirsiniz.  

Bir noktada kullanılabilecek ayrıştırıcı ve filtre çeşitliliği, hedef web uygulamasının istek biçimini kullanan uzantılar oluşturmayı sağlar.

[ Aşağıdaki alt bölümler][link-parsers], FAST DSL uzantı noktalarında kullanılabilecek ayrıştırıcıları ve filtreleri açıklar.