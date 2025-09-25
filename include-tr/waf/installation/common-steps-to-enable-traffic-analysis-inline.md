Varsayılan olarak, dağıtılan Wallarm Node gelen trafiği analiz etmez.

Trafik analizini ve meşru trafiğin proxy'lenmesini etkinleştirmek için, genellikle `/etc/nginx/sites-available/default` konumunda bulunan [NGINX yapılandırma dosyasını](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) güncelleyin.
    
Aşağıdaki asgari yapılandırma ayarları gereklidir:

1. Wallarm Node'u `wallarm_mode monitoring;` olarak ayarlayın. Bu mod, ilk dağıtımlar ve test için önerilir.

    Wallarm ayrıca blocking ve safe blocking gibi daha fazla modu destekler; bunlar hakkında [daha fazlasını okuyabilirsiniz][waf-mode-instr].
1. Gerekli konumlara `proxy_pass` yönergesini ekleyerek düğümün meşru trafiği nereye ileteceğini belirleyin. Bu, bir uygulama sunucusunun IP'sine, bir yük dengeleyiciye veya bir DNS adına olabilir.
1. Varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirilmesini sağlamak için değiştirilen konumlardan `try_files` yönergesini kaldırın.

```diff
server {
    ...
+   wallarm_mode monitoring;
    location / { 
+        proxy_pass http://example.com;
-        # try_files $uri $uri/ =404;
    }
    ...
}
```