[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

# Giriş

HTTPS kullanarak bir web uygulamasıyla bir tarayıcı aracılığıyla çalışırken, güvenilmeyen bir sertifika hakkında bu veya benzer bir mesaj görebilirsiniz:

![Mozilla Firefox'ın güvenilmez sertifika mesajı][img-insecure-connection]

FAST düğümü, bir istemciden HTTPS isteklerini kesintiye uğratır ve uzak sunucuya kendisi bağlantı başlatır. Tarayıcınızın, FAST düğümü sertifikasını güvendik bir şekilde sertifika olarak kabul etmesi gerekir, aksi takdirde tarayıcı bu durumu bir adam-orta saldırısı olarak değerlendirir.  

FAST düğümünün tarayıcınızın güvendik bir sertifikası yoksa, bu tarayıcıdan sunucuya HTTPS istekleri göndermeye çalışmak, güvende olmayan bir bağlantı uyarısı sonucunu verir.

HTTPS aracılığıyla web uygulamalarıyla başarılı bir şekilde çalışabilmek için aşağıdaki çözümlerden birini kullanabilirsiniz:
* Tarayıcınızın zaten güvendiği kendi SSL sertifikanız varsa, [bunu FAST düğümüne ekleyebilirsiniz][link-node-installation].
* Kendi SSL sertifikanız yoksa, FAST düğümünün kendiliğinden imzalı kök sertifikasını tarayıcınıza ekleyebilirsiniz. Bunu yapmak için tarayıcınıza yönelik talimatlara bakın:
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]