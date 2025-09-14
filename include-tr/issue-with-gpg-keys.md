!!! warning "CentOS GPG anahtarlarıyla ilgili sorun"
    Wallarm deposunu zaten eklediyseniz ve geçersiz CentOS GPG anahtarlarıyla ilgili bir hata aldıysanız, lütfen şu adımları izleyin:

    1. Eklenen depoyu `yum remove wallarm-node-repo` komutunu kullanarak kaldırın.
    2. Depoyu yukarıdaki uygun sekmedeki komutu kullanarak ekleyin.

    Olası hata iletileri:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml signature could not be verified for wallarm-node_2.14`
    * `One of the configured repositories failed (Wallarm Node for CentOS 7 - 2.14), and yum doesn't have enough cached data to continue.`