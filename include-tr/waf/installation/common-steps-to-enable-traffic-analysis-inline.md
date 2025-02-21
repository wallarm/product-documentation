By default, the deployed Wallarm Node does not analyze incoming traffic.  
Varsayılan olarak, dağıtılan Wallarm Node gelen trafiği analiz etmez.

To enable traffic analysis and proxying of legitimate traffic, update the [NGINX configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), typically located at `/etc/nginx/sites-available/default`.  
Geçerli trafiğin analiz edilmesini ve yasal trafiğin proxy ile aktarılmasını etkinleştirmek için, genellikle `/etc/nginx/sites-available/default` konumunda bulunan [NGINX konfigürasyon dosyasını](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) güncelleyin.

The following minimal configuration adjustments are necessary:  
Aşağıdaki minimum konfigürasyon ayarlamaları gereklidir:

1. Set the Wallarm Node to `wallarm_mode monitoring;`. This mode is recommended for initial deployments and testing.  
   Wallarm Node'u `wallarm_mode monitoring;` olarak ayarlayın. Bu mod, ilk dağıtımlar ve testler için önerilir.

    Wallarm also supports more modes like blocking and safe blocking, which you can [read more][waf-mode-instr].  
    Wallarm, ayrıca [daha fazla bilgi için okuyabileceğiniz][waf-mode-instr] engelleme ve güvenli engelleme gibi diğer modları da desteklemektedir.

1. Determine where the node should forward legitimate traffic by adding the `proxy_pass` directive in the required locations. This could be to the IP of an application server, a load balancer, or a DNS name.  
   Geçerli trafiğin nereye yönlendirileceğini belirlemek için gerekli yerlere `proxy_pass` yönergesini ekleyin. Bu, bir uygulama sunucusunun IP adresi, bir yük dengeleyici ya da bir DNS adı olabilir.

1. If present, remove the `try_files` directive from the modified locations to ensure traffic is directed to Wallarm without local file interference.  
   Eğer varsa, trafiğin yerel dosya müdahalesi olmadan Wallarm'a yönlendirilmesini sağlamak için değiştirilmiş yerlerden `try_files` yönergesini kaldırın.

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