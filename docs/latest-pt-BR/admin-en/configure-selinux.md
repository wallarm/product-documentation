[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux

# Configurando o SELinux

Se o mecanismo [SELinux][link-selinux] estiver ativado em um host com um nó de filtro, ele pode interferir no nó de filtro, tornando-o inoperante:
* Os valores de RPS (solicitações por segundo) e APS (ataques por segundo) do nó de filtro não serão exportados para a nuvem Wallarm.


O SELinux é instalado e ativado por padrão em distribuições Linux baseadas em RedHat (por exemplo, CentOS ou Amazon Linux 2.0.2021x e inferior). O SELinux também pode ser instalado em outras distribuições Linux, como Debian ou Ubuntu.

É obrigatório desativar o SELinux ou configurá-lo para que não interrompa a operação do nó de filtro.

## Verifique o status do SELinux

Execute o seguinte comando:

``` bash
sestatus
```

Examine a saída:
* `SELinux status: enabled`
* `SELinux status: disabled`

## Configurar SELinux

Permita que a utilidade `collectd` use um soquete TCP para tornar o nó de filtro operacional com o SELinux ativado. Para fazer isso, execute o seguinte comando:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

Verifique se o comando acima foi executado com êxito executando o seguinte comando:

``` bash
semanage export | grep collectd_tcp_network_connect
```

A saída deve conter esta string:
```
boolean -m -1 collectd_tcp_network_connect
```

## Desative o SELinux 

Para definir o SELinux em um estado desativado
*   execute o comando `setenforce 0` (o SELinux será desativado até a próxima reinicialização) ou
*   defina o valor da variável `SELINUX` como `disabled` no arquivo `/etc/selinux/config`, em seguida, reinicie (o SELinux será desativado permanentemente).