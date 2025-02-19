[link-fast]:                ../intro.md
[link-parsers]:             parsers.md

# Temel Kavramlar

[FAST extensions][link-fast], yeni test istekleri oluşturmak için kullanılan temel istek öğesi işleme mantığını açıklar. *Points*'in temel amacı, temel istekten hangi veri parçasının eklentide tanımlanan işlemlere tabi tutulacağını belirtmektir.

Bir point, eklentide belirtilen işlemin uygulanması gereken temel istek parçasını işaret eden bir dizedir. Bu dize, gerekli verilerin elde edilmesi için temel istek üzerinde uygulanması gereken parsers ve filtrelerin isimlerinin sırasını içerir.

* *Parsers*, alınan dize girdisine dayalı veri yapıları oluşturur. 
* *Filters*, parsers tarafından oluşturulan veri yapılarından belirli değerlerin elde edilmesi için kullanılır. 

Filtrelerin işaret ettiği değerlere başka filtreler ve parsers da uygulanabilir. İstek üzerinde sırasıyla parsers ve filtreler uygulayarak, daha ileri işlemler için gerekli istek öğesi değerlerini çıkarabilirsiniz.  

Bir point içerisinde kullanılabilecek parsers ve filtre çeşitliliği, hedef web uygulamasının istek formatını kullanan eklentilerin oluşturulmasına olanak tanır.

[Aşağıdaki alt bölümler][link-parsers] FAST DSL eklenti noktalarında kullanılabilecek parsers ve filtreleri tanımlar.