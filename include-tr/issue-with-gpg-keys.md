!!! uyarı "CentOS GPG anahtarları ile ilgili sorun"
    Eğer daha önce Wallarm deposunu eklediyseniz ve geçersiz CentOS GPG anahtarlarına ilişkin bir hata aldıysanız, lütfen aşağıdaki adımları izleyin:

    1. Eklenen depoyu `yum remove wallarm-node-repo` komutunu kullanarak kaldırın.
    2. Depoyu, yukarıdaki uygun sekmede bulunan komutu kullanarak ekleyin.

    Olası hata mesajları:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml imzası wallarm-node_2.14 için doğrulanamadı`
    * `Yapılandırılmış depolardan biri başarısız oldu (CentOS 7 için Wallarm Düğüm - 2.14), ve yum devam etmek için yeterli önbelleğe alınmış veriye sahip değil.`