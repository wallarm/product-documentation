Ortam değişkeni | Açıklama| Gerekli
--- | ---- | ----
`DEPLOY_USER` | Wallarm Console'da **Deploy** veya **Administrator** kullanıcı hesabına ait e-posta. | Evet
`DEPLOY_PASSWORD` | Wallarm Console'da **Deploy** veya **Administrator** kullanıcı hesabına ait parola. | Evet
`NGINX_BACKEND` | Wallarm çözümü ile korunacak kaynağın etki alanı veya IP adresi. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` ABD Bulutu için</li><li>`api.wallarm.com` AB Bulutu için</li></ul>Öntanımlı: `api.wallarm.com`. | Hayır
`WALLARM_MODE` | Düğüm modu:<ul><li>`block` zararlı istekleri engeller</li><li>`safe_blocking` sadece [gri listeye alınmış IP adreslerinden][graylist-docs] kaynaklanan zararlı istekleri engeller</li><li>`monitoring` istekleri analiz eder ama engellemez</li><li>`off` trafik analizi ve işlemeyi devre dışı bırakır</li></ul>Öntanımlı: `monitoring`.<br>[Filtrasyon modları hakkında ayrıntılı açıklama →][filtration-modes-docs] | Hayır
`WALLARM_APPLICATION` | Wallarm Cloud'da kullanılacak korunan uygulamanın benzersiz tanımlayıcısı. Değer, `0` hariç pozitif bir tam sayı olabilir.<br><br>Varsayılan değer (eğer değişken konteynıra iletilmezse) `-1`, Wallarm Console → **Ayarlar** → **Uygulama** tarafından görüntülenen **varsayılan** uygulamayı belirtir.<br><br>[Uygulamaların ayarlanması üzerine daha fazla bilgi →][application-configuration]<div class="admonition info"> <p class="admonition-title">`WALLARM_APPLICATION` değişkenine destek</p> <p>`WALLARM_APPLICATION` değişkenine destek yalnızca `3.4.1-1` versiyonunun Docker görüntüsü ile başlar.</div> | Hayır
`TARANTOOL_MEMORY_GB` | Tarantool'a ayrılan [bellek miktarı][allocating-memory-guide]. Değer tam sayı veya ondalıklı olabilir (ondalıklı ayracı olarak nokta <code>.</code> kullanılır). Öntanımlı: 0.2 gigabayt. | Hayır
`DEPLOY_FORCE` | Var olan bir Wallarm düğümünün adı, çalıştırdığınız konteynerin tanımlayıcısıyla eşleşiyorsa, bu düğümü yeni bir düğümle değiştirir. Bir değişkene atanan değer:<ul><li>`true` filtreleme düğümünü değiştirmek için</li><li>`false` filtreleme düğümünün değiştirilmesini devre dışı bırakmak için</li></ul>Varsayılan değer (eğer değişken konteynıra iletilmezse) `false`.<br>Wallarm düğümü adı her zaman, çalıştırdığınız konteynerin tanımlayıcısıyla eşleşir. Docker konteyner tanımlayıcıları (örneğin, görüntünün yeni bir sürümüne sahip bir konteyner) ile statik olan ve filtreleme düğümüyle başka bir Docker konteynerı çalıştırmaya çalıştığınız ortamınızdaki bu durumda, değişken değeri `false` ise, filtreleme düğümü oluşturma süreci başarısız olacaktır. | Hayır
`NGINX_PORT` | <p>NGINX'in Docker konteyneri içerisinde kullanacağı portu belirler. Bu, bu Docker konteyniri bir Kubernetes kümesindeki bir pod'un [sidecar konteyneri][about-sidecar-container] olarak kullanılmasını sağlayarak port çakışmasını engeller.</p><p>Varsayılan değer (eğer değişken konteynıra iletilmezse) `80`.</p><p>Sözdizimi `NGINX_PORT='443'` şeklindedir.</p> | Hayır