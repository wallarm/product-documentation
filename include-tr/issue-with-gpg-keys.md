```markdown
!!! warning "Issue with CentOS GPG keys"
    Eğer Wallarm deposunu eklediyseniz ve geçersiz CentOS GPG anahtarlarıyla ilgili bir hata aldıysanız, lütfen aşağıdaki adımları izleyin:

    1. Eklenmiş depoyu `yum remove wallarm-node-repo` komutunu kullanarak kaldırın.
    2. Yukarıdaki ilgili sekmeden komut aracılığıyla depoyu ekleyin.

    Olası hata mesajları:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml signature could not be verified for wallarm-node_2.14`
    * `One of the configured repositories failed (Wallarm Node for CentOS 7 - 2.14), and yum doesn't have enough cached data to continue.`
```