# Atualizando o nó CDN

Estas instruções descrevem os passos para atualizar o nó CDN da Wallarm, disponível a partir da versão 3.6.

1. Exclua o registro CNAME da Wallarm nos registros DNS do domínio protegido.

    !!! aviso "Mitigação de solicitações maliciosas será interrompida"
        Uma vez que o registro CNAME é removido e as alterações entram em vigor na internet, o nó CDN da Wallarm vai parar de encaminhar solicitações, e o tráfico legítimo e malicioso vai diretamente para o recurso protegido.

        Isso resulta no risco de exploração de vulnerabilidades do servidor protegido quando o registro DNS deletado entrou em vigor, mas o registro CNAME gerado para a nova versão do nó ainda não entrou em vigor.
1. Aguarde a propagação das alterações. O status real do registro CNAME é exibido no Console Wallarm → **Nós** → **CDN** → **Excluir nó**.
1. Exclua o nó CDN no Console Wallarm → **Nós**.

    ![Excluindo o nó](../images/user-guides/nodes/delete-cdn-node.png)
1. Crie o nó CDN de uma versão mais recente protegendo o mesmo domínio, seguindo as [instruções](../installation/cdn-node.md).

Como todas as configurações do nó CDN são salvas na Nuvem Wallarm, o novo nó CDN receberá automaticamente as configurações. Não é necessário mover a configuração do nó manualmente se o domínio protegido não mudou.