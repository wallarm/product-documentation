[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

#   Um Fluxo de Trabalho CI/CD com FAST

Se integrar o FAST a um fluxo de trabalho CI/CD, várias etapas extras serão adicionadas ao fluxo de trabalho CI/CD existente. Estas etapas podem fazer parte de um trabalho CI/CD existente ou de um trabalho separado.

As etapas extras exatas dependerão do cenário de criação de execução de teste em ação. Todos os cenários possíveis são descritos abaixo.

##  Integração via API Wallarm (também conhecida como "Implantação via API")

Neste cenário, o nó FAST é gerenciado via API Wallarm. A API também é usada para gerenciar as execuções de teste. O nó FAST pode gravar solicitações de linha de base ou trabalhar com solicitações de linha de base já gravadas:
    
![Integração via API][img-api-mode] 

Neste cenário, FAST demonstra o seguinte comportamento:
* Um único contêiner Docker de nó FAST está ligado a um único nó FAST na nuvem correspondente. Para executar vários contêineres com um nó FAST simultaneamente, você precisa do mesmo número de nós FAST na nuvem e tokens que o número de contêineres que você planeja implantar.
* Se você criar um novo nó FAST para um nó FAST na nuvem e houver outro nó FAST ligado a esse nó na nuvem, a execução de teste será abortada para o último nó.
* Uma política de teste e um registro de teste podem ser usados por várias execuções de teste e nós FAST.
    
Veja [este documento][doc-integration-api] para obter detalhes sobre como é feita a integração do FAST neste caso. 

##  Integração via o Nó FAST (também conhecido como "Implantação com CI MODE")

Neste cenário, o nó FAST é usado nos modos de teste e gravação. O modo de operação é alterado manipulando a variável de ambiente `CI_MODE` ao implantar um contêiner com o nó. O nó FAST gerencia as execuções de teste por si mesmo; portanto, não há necessidade de uma ferramenta CI/CD interagir com a API Wallarm.

Veja a imagem abaixo para uma explicação esquemática deste cenário:

![Integração com CI MODE][img-ci-mode]

Neste cenário, FAST demonstra o seguinte comportamento:
* Um único contêiner Docker de nó FAST está ligado a um único nó FAST na nuvem correspondente. Para executar vários contêineres com um nó FAST simultaneamente, você precisa do mesmo número de nós FAST na nuvem e tokens que o número de contêineres que você planeja implantar.
    Para implantar corretamente muitos nós FAST no modo simultâneo em fluxos de trabalho CI/CD, você precisará usar uma abordagem diferente que é similar ao CI MODE [descrito abaixo][anchor-build-id].
* Se criar um novo nó FAST para um nó FAST na nuvem e houver outro nó FAST ligado a esse nó na nuvem, a execução de teste será abortada para o último nó.
* Uma política de teste e um registro de teste podem ser usados ​​por várias execuções de teste e nós FAST.

Veja [este documento][doc-integration-ci-mode] para obter detalhes sobre como é feita a integração do FAST neste caso. 
    

### Implantando o Nó FAST com CI MODE para uso em fluxos de trabalho simultâneos CI/CD

Para implantar o nó FAST de maneira adequada para fluxos de trabalho CI/CD simultâneos, você deve usar o CI MODE, conforme descrito acima, e passar a variável de ambiente `BUILD_ID` adicional para o contêiner do nó.

O parâmetro `BUILD_ID` permite gravar em vários registros de teste diferentes enquanto usa um único nó FAST na nuvem, e reutilizar esses registros de teste posteriormente para iniciar algumas execuções de teste simultâneas.

Veja a imagem abaixo para uma explicação esquemática deste cenário:

![Integração com BUILD_ID][img-ci-mode-build-id]

Neste cenário, FAST demonstra o seguinte comportamento:
* Vários nós FAST podem operar através de um único nó FAST na nuvem para trabalhar em fluxos de trabalho CI/CD simultâneos. Note que **o mesmo token é usado** por todos esses nós FAST.
* As execuções de teste usam diferentes registros de teste marcados com identificadores `BUILD_ID` distintos.
* Essas execuções de teste são executadas em paralelo; além disso, eles podem empregar diferentes políticas de teste, se necessário.

Veja [este documento][doc-concurrent-pipelines] para uma explicação detalhada de como usar o FAST em fluxos de trabalho CI/CD simultâneos.


!!! info "Suporte HTTPS"
    Esta instrução descreve a integração do FAST com CI/CD para testar o aplicativo funcionando com o protocolo HTTP.
    
    O nó FAST também suporta testar aplicativos que funcionam com o protocolo HTTPS. Mais detalhes estão descritos no [Guia de Início Rápido][doc-qsg].
