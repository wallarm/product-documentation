[doc-allowed-host]:     operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-ssl]:              ssl/intro.md
[link-token]:           operations/internals.md#token

# Solução de Problemas

## Problemas Comuns e Como Resolvê-los

**O que fazer se...**

* **...o nó FAST exibir uma das seguintes mensagens no output do console?**

--8<-- "../include-pt-BR/fast/console-include/tshoot/request-timeout.md"
    
    ou

--8<-- "../include-pt-BR/fast/console-include/tshoot/access-denied.md"
    
    **Solução:** certifique-se de que

    * o nó FAST e o host Docker correspondente têm acesso à internet (em particular, os servidores da API `api.wallarm.com` e `us1.api.wallarm.com` da Wallarm devem ser acessíveis via `TCP/443`), e
    * você está usando o valor do [token][link-token] correto e se comunicando com o servidor da API Wallarm apropriado. Note que o FAST usa tokens *diferentes* para se conectar aos servidores da API, dependendo se eles estão nas nuvens europeias ou americanas.
    
* **...uma fonte de pedido não confia no certificado SSL auto-assinado do nó FAST?**

    **Solução:** configure um certificado SSL confiável usando qualquer método listado [nestas instruções][doc-ssl].
    
* **...o nó FAST está operação, mas nenhum pedido base está sendo registrado?**

    **Solução:** verifique o seguinte:

    * A fonte de solicitação está configurada para usar o nó FAST como servidor proxy e recebeu a porta correta, o nome de domínio ou o endereço IP do nó para se conectar.
    * A fonte da solicitação está usando o nó FAST como um servidor proxy para cada protocolo que está em uso pela fonte (uma situação comum é que o nó FAST é empregado como um proxy HTTP, enquanto a fonte da solicitação está tentando enviar solicitações HTTPS).
    * A variável de ambiente [`ALLOWED_HOST`][doc-allowed-host] está configurada corretamente.
    
* **...nenhum teste FAST ou extensões customizadas estão rodando no nó FAST?**

    **Solução:** verifique que o nó FAST registra solicitações de base e que estas solicitações de base estão em conformidade com a política de teste que está sendo usada pelo nó.

##  Contatando a Equipe de Suporte

Se você não consegue encontrar seu problema na lista acima, ou considera a solução inútil, contate a equipe de suporte da Wallarm.

Você pode [escrever um e-mail](mailto:support@wallarm.com) ou preencher o formulário no portal Wallarm. Para enviar um feedback através do portal, faça o seguinte:

* Clique no ponto de interrogação no canto superior direito do portal.
* Na barra lateral aberta, selecione a entrada "Suporte Wallarm".
* Escreva e envie um e-mail.

##  Coletando Dados de Diagnóstico

Um membro da equipe de suporte da Wallarm pode pedir para você coletar uma parte dos dados de diagnóstico referentes ao nó FAST.

Configure algumas variáveis de ambiente e, em seguida, execute os seguintes comandos para coletar os dados (substitua o `<nome do container do nó FAST>` pelo nome real do contêiner do nó FAST de onde você deseja buscar os dados de diagnóstico):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <nome do container do nó FAST> /usr/local/bin/collect_info_fast.sh

docker cp <nome do container do nó FAST>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

Após a execução bem sucedida destes comandos, os dados de diagnóstico serão colocados no arquivo `fast_supout-$TIMESTAMP.tar.gz` no host Docker. O `$TIMESTAMP` no nome do arquivo representará o tempo de coleta.
