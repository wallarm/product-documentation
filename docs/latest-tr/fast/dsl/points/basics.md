[link-fast]:                ../intro.md
[link-parsers]:             parsers.md

# Temel Kavramlar

[FAST genişletmeleri][link-fast], yeni test istekleri oluşturmak için kullanılan baseline istek öğesinin işlemlerini açıklar. *Noktaların* ana amacı, genişletme içinde açıklanan eylemlerin hangi veri parçasına uygulanması gerektiğini belirlemektir.

Bir nokta, genişletmedeki belirtilen eylemin uygulanması gereken baseline isteğinin kısmını gösteren bir dizedir. Bu dize, gerekli verileri elde etmek için baseline isteğine uygulanması gereken parserların ve filtrelerin adlarını içerir.

* *Parserlar* alınan dize girişine dayanarak veri yapıları oluşturur.
* *Filtreler*, parserlar tarafından oluşturulan veri yapılarından belirli değerleri elde etmek için kullanılır.

Diğer filtreler ve parserlar, filtrelerin işaret ettiği değerlere uygulanabilir. Sırayla parserları ve filtreleri isteğe uygulayarak, daha fazla işlem için gerekli olan istek öğesi değerlerini çıkarabilirsiniz.

Bir noktada kullanılabilecek parser ve filtre çeşitliliği, hedef web uygulaması isteklerinin formatını kullanan genişletmelerin oluşturulmasına olanak sağlar.

[İzleyen alt bölümler][link-parsers] FAST DSL genişleme noktalarında kullanılabilecek parserları ve filtreleri tanımlar.