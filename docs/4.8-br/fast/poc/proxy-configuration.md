[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md

# Configuração das Regras de Proxy

!!! alerta "Atenção"
    Realize as etapas descritas neste capítulo somente se o nó FAST estiver sendo implantado via [API][doc-node-deployment-api] ou via [Modo CI (modo de gravação)][doc-fast-recording-mode].

Configure sua fonte de solicitação para usar o nó FAST como um proxy HTTP para todas as solicitações enviadas para o aplicativo alvo.

Dependendo da forma como sua infraestrutura de CI/CD interage com o contêiner Docker do nó FAST, você pode abordar o nó por um dos seguintes meios:
* Endereço IP.
* Nome de domínio.

!!! informação "Exemplo"
    Se a sua ferramenta de teste funcionar como um contêiner Docker Linux, você pode passar a seguinte variável de ambiente para o contêiner para habilitar o encaminhamento de todas as solicitações HTTP desse contêiner através do nó FAST:

    ```
    HTTP_PROXY=http://<nome ou endereço IP do nó FAST>:<porta>
    ```