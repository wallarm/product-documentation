!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser das **mesmas versões**. Os módulos de pós-análise instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, certifique-se de que a versão dele corresponde à versão dos módulos já implantados. Se a versão do módulo implantado estiver [descontinuada ou será descontinuada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    Para verificar a versão instalada, execute o seguinte comando no contêiner:

    ```bash
    apt list wallarm-node
    ```
