# Deployment options

Wallarm supports many deployment options enabling you to seamlessly integrate the platform with your environment without its modification. Learn the Wallarm deployment options and choose the most appropriate one from this document.

## Serverless deployment

<div class="navigation platforms">

    <a href="../../installation/cdn-node/" class="navigation-card platform-card" style="padding: 24px 32px; font-size: 14px;">
        <img class="platform-icon" width="64px" height="64px" src="../../images/platform-icons/cdn-node.png">
        <h3>CDN node</h3>
        <p>Deploy the Wallarm node without placing any third‑party components in the application's infrastructure</p>
    </a>
</div>

## Web servers and API gateways

<div class="navigation platforms">

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="nginx" class="platform-card-button" onClick="platformClicked(event, 'nginx')">
        <img class="platform-icon" src="../../images/platform-icons/nginx.svg">
        <h3>NGINX Stable
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node compatible to NGINX Stable with...</p>
        <div id="nginxId" class="options-list" style="display: none;">
            <a href="#cloud-platforms" onClick="noAction(event)">AWS, GCP, Azure, etc</a>
            <a href="../../admin-en/installation-docker-en/" onClick="noAction(event)">Docker container</a>
            <a href="#kubernetes" onClick="noAction(event)">Kubernetes</a>
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="nginxPlus" class="platform-card-button" onClick="platformClicked(event, 'nginxPlus')">
        <img class="platform-icon" src="../../images/platform-icons/nginx-plus.svg">
        <h3>NGINX Plus
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node compatible to NGINX Plus with...</p>
        <div id="nginxPlusId" class="options-list" style="display: none;">
            <a href="#cloud-platforms" onClick="noAction(event)">AWS, GCP, Azure, etc</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>    
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="kong" class="platform-card-button" onClick="platformClicked(event, 'kong')">
        <img class="platform-icon" src="../../images/platform-icons/kong.svg">
        <h3>Kong
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node compatible to Kong with...</p>
        <div id="kongId" class="options-list" style="display: none;">
            <a href="#cloud-platforms" onClick="noAction(event)">AWS, GCP, Azure, etc</a>
            <a href="../../admin-en/installation-kong-en/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>    
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="envoy" class="platform-card-button" onClick="platformClicked(event, 'envoy')">
        <img class="platform-icon" src="../../images/platform-icons/envoy.svg">
        <h3>Envoy
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node compatible to Envoy with...</p>
        <div id="envoyId" class="options-list" style="display: none;">
            <a href="../../admin-en/installation-guides/envoy/envoy-docker/" onClick="noAction(event)">Docker container</a>
        </div>
    </div>
</div> 
</div>


## Cloud platforms

<div class="navigation platforms">

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="aws" class="platform-card-button" onClick="platformClicked(event, 'aws')">
        <img class="platform-icon" src="../../images/platform-icons/aws.svg">
        <h3>AWS
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node distributed as...</p>
        <div id="awsId" class="options-list" style="display: none;">
            <a href="../../admin-en/installation-ami-en/" onClick="noAction(event)">AWS Marketplace image</a>
            <a href="../../installation/cloud-platforms/aws/docker-container/" onClick="noAction(event)">Docker container</a>
            <a href="../../installation/cloud-platforms/aws/deb-rpm-packages/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="gcp" class="platform-card-button" onClick="platformClicked(event, 'gcp')">
        <img class="platform-icon" src="../../images/platform-icons/gcp.svg">
        <h3>Google Cloud<br>Platform
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node distributed as...</p>
        <div id="gcpId" class="options-list" style="display: none;">
            <a href="../../admin-en/installation-gcp-en/" onClick="noAction(event)">GCP Marketplace image</a>
            <a href="../../installation/cloud-platforms/gcp/docker-container/" onClick="noAction(event)">Docker container</a>
            <a href="../../installation/cloud-platforms/gcp/deb-rpm-packages/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>    
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="azure" class="platform-card-button" onClick="platformClicked(event, 'azure')">
        <img class="platform-icon" src="../../images/platform-icons/azure-cloud.svg">
        <h3>Microsoft Azure
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node distributed as...</p>
        <div id="azureId" class="options-list" style="display: none;">
            <a href="../../installation/cloud-platforms/azure/docker-container/" onClick="noAction(event)">Docker container</a>
            <a href="../../installation/cloud-platforms/azure/deb-rpm-packages/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="alibaba" class="platform-card-button" onClick="platformClicked(event, 'alibaba')">
        <img class="platform-icon" src="../../images/platform-icons/alibaba-cloud.svg">
        <h3>Alibaba Cloud
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node distributed as...</p>
        <div id="alibabaId" class="options-list" style="display: none;">
            <a href="../../installation/cloud-platforms/alibaba-cloud/docker-container/" onClick="noAction(event)">Docker container</a>
            <a href="../../installation/cloud-platforms/alibaba-cloud/deb-rpm-packages/" onClick="noAction(event)">DEB or RPM packages</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="privateCloud" class="platform-card-button" onClick="platformClicked(event, 'privateCloud')">
        <img class="platform-icon" src="../../images/platform-icons/private-cloud.svg">
        <h3>Private clouds
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>                    
        </h3>
        <p>Deploy Wallarm node distributed as...</p>
        <div id="privateCloudId" class="options-list" style="display: none;">
            <a href="../../installation/cloud-platforms/private-cloud/#principles-of-deploying-the-wallarm-node-docker-container-to-the-private-cloud" onClick="noAction(event)">Docker container</a>
            <a href="../../installation/cloud-platforms/private-cloud/#principles-of-installing-the-wallarm-node-from-deb-and-rpm-packages-on-the-private-cloud" onClick="noAction(event)">DEB or RPM packages</a>
        </div>
    </div>
</div> 
</div>


## Docker images

<div class="navigation platforms">

    <a href="../../admin-en/installation-docker-en/" class="navigation-card platform-card" style="padding: 24px 32px; font-size: 14px;">
            <svg xmlns="http://www.w3.org/2000/svg" style="height: 72px;" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 32 32"><defs><clipPath id="A"><path d="M76 2v46H54v23H35.58l-.206 2c-1.15 12.53 1.036 24.088 6.063 33.97l1.688 3.03c1 1.817 2.2 3.523 3.438 5.188s1.686 2.583 2.47 3.688C62.32 133.8 82.13 141 105 141c50.648 0 93.633-22.438 112.656-72.844C231.153 69.54 244.1 66.08 250 54.563c-9.4-5.424-21.478-3.685-28.437-.187L240 2l-72 46h-23V2z"/></clipPath></defs><g transform="matrix(.679423 0 0 .679423 -2.086149 13.781817)"><path d="M30.305-3.553h4.222V.763h2.135a9.26 9.26 0 0 0 2.934-.492c.46-.156.974-.372 1.426-.644-.596-.778-.9-1.76-1-2.73-.122-1.317.144-3.032 1.036-4.063l.444-.513.53.425c1.332 1.07 2.452 2.565 2.65 4.27 1.603-.472 3.486-.36 4.9.456l.58.335-.305.596c-1.187 2.33-3.687 3.053-6.13 2.925-3.656 9.105-11.615 13.416-21.265 13.416-4.986 0-9.56-1.864-12.164-6.287-.153-.275-.283-.562-.422-.844-.88-1.947-1.173-4.08-.975-6.2l.06-.638h3.6V-3.55h4.222v-4.222h8.445v-4.222h5.067v8.445" fill="#394d54"/><g transform="matrix(.184659 0 0 .184659 3.070472 -11.997864)" clip-path="url(#A)"><g id="B"><g id="C" transform="translate(0 -22.866)"><path d="M123.86 3.8h19.818v19.817H123.86z" fill="#00acd3"/><path d="M123.86 26.676h19.818v19.818H123.86z" fill="#20c2ef"/><path id="D" d="M126.292 21.977V5.46m2.972 16.516V5.46m3.002 16.516V5.46m3.003 16.516V5.46m3.003 16.516V5.46m2.97 16.516V5.46" stroke="#394d54" stroke-width="1.56"/><use xlink:href="#D" y="22.866"/></g><use xlink:href="#C" transform="matrix(1 0 0 -1 22.866 4.572651)"/></g><use xlink:href="#B" x="-91.464" y="45.732"/><use xlink:href="#B" x="-45.732" y="45.732"/><use xlink:href="#B" y="45.732"/><path d="M221.57 54.38c1.533-11.915-7.384-21.275-12.914-25.718-6.373 7.368-7.363 26.678 2.635 34.807-5.58 4.956-17.337 9.448-29.376 9.448H34C32.83 85.484 34 146 34 146h217l-.987-91.424c-9.4-5.424-21.484-3.694-28.443-.197" fill="#17b5eb"/><path d="M34 89v57h217V89" fill-opacity=".17"/><path d="M111.237 140.9c-13.54-6.425-20.972-15.16-25.107-24.694L45 118l21 28 45.237-5.1" fill="#d4edf1"/><path d="M222.5 53.938v.03c-20.86 26.9-50.783 50.38-82.906 62.72-28.655 11.008-53.638 11.06-70.875 2.22-1.856-1.048-3.676-2.212-5.5-3.312-12.637-8.832-19.754-23.44-19.156-42.687H34V146h217V50h-25z" fill-opacity=".085"/></g><path d="M11.496 9.613c2.616.143 5.407.17 7.842-.594" fill="none" stroke="#394d54" stroke-width=".628" stroke-linecap="round"/><path d="M21.937 7.753a1.01 1.01 0 0 1-1.009 1.009 1.01 1.01 0 0 1-1.01-1.009 1.01 1.01 0 0 1 1.01-1.01 1.01 1.01 0 0 1 1.009 1.01z" fill="#d4edf1"/><path d="M21.2 7.08c-.088.05-.148.146-.148.256 0 .163.132.295.295.295.112 0 .2-.062.26-.154a.73.73 0 0 1 .055.277c0 .4-.324.723-.723.723s-.723-.324-.723-.723.324-.723.723-.723a.72.72 0 0 1 .262.049zM3.07 4.65h46.964c-1.023-.26-3.235-.6-2.87-1.95-1.86 2.152-6.344 1.5-7.475.448-1.26 1.828-8.597 1.133-9.108-.3-1.58 1.854-6.475 1.854-8.055 0-.512 1.424-7.848 2.12-9.1.3C12.284 4.2 7.8 4.853 5.94 2.7c.365 1.34-1.848 1.7-2.87 1.95" fill="#394d54"/></g></svg>
            <svg xmlns="http://www.w3.org/2000/svg" style="height: 72px;" viewBox="-35.5 26 32 32" width="64" height="64"><path d="M-33.442 42.023v-7.637a.68.68 0 0 1 .385-.651l13.173-7.608c.237-.148.503-.178.74-.03l13.232 7.637a.71.71 0 0 1 .355.651V49.63a.71.71 0 0 1-.355.651l-11.367 6.57a56.27 56.27 0 0 1-1.806 1.036c-.266.148-.533.148-.8 0l-13.202-7.608c-.237-.148-.355-.326-.355-.622v-7.637z" fill="#009438"/><path d="M-24.118 39.18v8.9c0 1.006-.8 1.894-1.865 1.865-.65-.03-1.154-.296-1.5-.858-.178-.266-.237-.562-.237-.888V35.836c0-.83.503-1.42 1.154-1.687s1.302-.207 1.954 0c.622.178 1.095.562 1.5 1.036l7.874 9.443c.03.03.06.09.118.148v-9c0-.947.65-1.687 1.57-1.776 1.154-.148 1.924.68 2.042 1.54v12.6c0 .7-.326 1.214-.918 1.54-.444.237-.918.296-1.42.266a3.23 3.23 0 0 1-1.954-.829c-.296-.266-.503-.592-.77-.888l-7.49-8.97c0-.03-.03-.06-.06-.09z" fill="#fefefe"/></svg>
            <h3>Docker image (NGINX)</h3>
            <p>Deploy the NGINX-based Wallarm node as a Docker container</p>
    </a>

    <a href="../../admin-en/installation-guides/envoy/envoy-docker/" class="navigation-card platform-card" style="padding: 24px 32px; font-size: 14px;">
            <svg xmlns="http://www.w3.org/2000/svg" style="height: 72px;" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 32 32"><defs><clipPath id="A"><path d="M76 2v46H54v23H35.58l-.206 2c-1.15 12.53 1.036 24.088 6.063 33.97l1.688 3.03c1 1.817 2.2 3.523 3.438 5.188s1.686 2.583 2.47 3.688C62.32 133.8 82.13 141 105 141c50.648 0 93.633-22.438 112.656-72.844C231.153 69.54 244.1 66.08 250 54.563c-9.4-5.424-21.478-3.685-28.437-.187L240 2l-72 46h-23V2z"/></clipPath></defs><g transform="matrix(.679423 0 0 .679423 -2.086149 13.781817)"><path d="M30.305-3.553h4.222V.763h2.135a9.26 9.26 0 0 0 2.934-.492c.46-.156.974-.372 1.426-.644-.596-.778-.9-1.76-1-2.73-.122-1.317.144-3.032 1.036-4.063l.444-.513.53.425c1.332 1.07 2.452 2.565 2.65 4.27 1.603-.472 3.486-.36 4.9.456l.58.335-.305.596c-1.187 2.33-3.687 3.053-6.13 2.925-3.656 9.105-11.615 13.416-21.265 13.416-4.986 0-9.56-1.864-12.164-6.287-.153-.275-.283-.562-.422-.844-.88-1.947-1.173-4.08-.975-6.2l.06-.638h3.6V-3.55h4.222v-4.222h8.445v-4.222h5.067v8.445" fill="#394d54"/><g transform="matrix(.184659 0 0 .184659 3.070472 -11.997864)" clip-path="url(#A)"><g id="B"><g id="C" transform="translate(0 -22.866)"><path d="M123.86 3.8h19.818v19.817H123.86z" fill="#00acd3"/><path d="M123.86 26.676h19.818v19.818H123.86z" fill="#20c2ef"/><path id="D" d="M126.292 21.977V5.46m2.972 16.516V5.46m3.002 16.516V5.46m3.003 16.516V5.46m3.003 16.516V5.46m2.97 16.516V5.46" stroke="#394d54" stroke-width="1.56"/><use xlink:href="#D" y="22.866"/></g><use xlink:href="#C" transform="matrix(1 0 0 -1 22.866 4.572651)"/></g><use xlink:href="#B" x="-91.464" y="45.732"/><use xlink:href="#B" x="-45.732" y="45.732"/><use xlink:href="#B" y="45.732"/><path d="M221.57 54.38c1.533-11.915-7.384-21.275-12.914-25.718-6.373 7.368-7.363 26.678 2.635 34.807-5.58 4.956-17.337 9.448-29.376 9.448H34C32.83 85.484 34 146 34 146h217l-.987-91.424c-9.4-5.424-21.484-3.694-28.443-.197" fill="#17b5eb"/><path d="M34 89v57h217V89" fill-opacity=".17"/><path d="M111.237 140.9c-13.54-6.425-20.972-15.16-25.107-24.694L45 118l21 28 45.237-5.1" fill="#d4edf1"/><path d="M222.5 53.938v.03c-20.86 26.9-50.783 50.38-82.906 62.72-28.655 11.008-53.638 11.06-70.875 2.22-1.856-1.048-3.676-2.212-5.5-3.312-12.637-8.832-19.754-23.44-19.156-42.687H34V146h217V50h-25z" fill-opacity=".085"/></g><path d="M11.496 9.613c2.616.143 5.407.17 7.842-.594" fill="none" stroke="#394d54" stroke-width=".628" stroke-linecap="round"/><path d="M21.937 7.753a1.01 1.01 0 0 1-1.009 1.009 1.01 1.01 0 0 1-1.01-1.009 1.01 1.01 0 0 1 1.01-1.01 1.01 1.01 0 0 1 1.009 1.01z" fill="#d4edf1"/><path d="M21.2 7.08c-.088.05-.148.146-.148.256 0 .163.132.295.295.295.112 0 .2-.062.26-.154a.73.73 0 0 1 .055.277c0 .4-.324.723-.723.723s-.723-.324-.723-.723.324-.723.723-.723a.72.72 0 0 1 .262.049zM3.07 4.65h46.964c-1.023-.26-3.235-.6-2.87-1.95-1.86 2.152-6.344 1.5-7.475.448-1.26 1.828-8.597 1.133-9.108-.3-1.58 1.854-6.475 1.854-8.055 0-.512 1.424-7.848 2.12-9.1.3C12.284 4.2 7.8 4.853 5.94 2.7c.365 1.34-1.848 1.7-2.87 1.95" fill="#394d54"/></g></svg>
            <img class="platform-icon" src="../../images/platform-icons/envoy.svg">
            <h3>Docker image (Envoy)</h3>
            <p>Deploy the Envoy-based Wallarm node as a Docker container</p>
        </a>
</div>


## Kubernetes

<div class="navigation platforms">

    <a href="../../admin-en/installation-kubernetes-en/" class="navigation-card platform-card" style="padding: 24px 32px; font-size: 14px;">
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 64px;" viewBox="0 0 32 32" width="64" height="64"><path d="M15.9.476a2.14 2.14 0 0 0-.823.218L3.932 6.01c-.582.277-1.005.804-1.15 1.432L.054 19.373c-.13.56-.025 1.147.3 1.627q.057.087.12.168l7.7 9.574c.407.5 1.018.787 1.662.784h12.35c.646.001 1.258-.3 1.664-.793l7.696-9.576c.404-.5.555-1.16.4-1.786L29.2 7.43c-.145-.628-.57-1.155-1.15-1.432L16.923.695A2.14 2.14 0 0 0 15.89.476z" fill="#326ce5"/><path d="M16.002 4.542c-.384.027-.675.356-.655.74v.188c.018.213.05.424.092.633a6.22 6.22 0 0 1 .066 1.21c-.038.133-.114.253-.218.345l-.015.282c-.405.034-.807.096-1.203.186-1.666.376-3.183 1.24-4.354 2.485l-.24-.17c-.132.04-.274.025-.395-.04a6.22 6.22 0 0 1-.897-.81 5.55 5.55 0 0 0-.437-.465l-.148-.118c-.132-.106-.294-.167-.463-.175a.64.64 0 0 0-.531.236c-.226.317-.152.756.164.983l.138.11a5.55 5.55 0 0 0 .552.323c.354.197.688.428.998.7a.74.74 0 0 1 .133.384l.218.2c-1.177 1.766-1.66 3.905-1.358 6.006l-.28.08c-.073.116-.17.215-.286.288a6.22 6.22 0 0 1-1.194.197 5.57 5.57 0 0 0-.64.05l-.177.04h-.02a.67.67 0 0 0-.387 1.132.67.67 0 0 0 .684.165h.013l.18-.02c.203-.06.403-.134.598-.218.375-.15.764-.265 1.162-.34.138.008.27.055.382.135l.3-.05c.65 2.017 2.016 3.726 3.84 4.803l-.122.255c.056.117.077.247.06.376-.165.382-.367.748-.603 1.092a5.58 5.58 0 0 0-.358.533l-.085.18a.67.67 0 0 0 .65 1.001.67.67 0 0 0 .553-.432l.083-.17c.076-.2.14-.404.192-.61.177-.437.273-.906.515-1.196a.54.54 0 0 1 .286-.14l.15-.273a8.62 8.62 0 0 0 6.146.015l.133.255c.136.02.258.095.34.205.188.358.34.733.456 1.12a5.57 5.57 0 0 0 .194.611l.083.17a.67.67 0 0 0 1.187.131.67.67 0 0 0 .016-.701l-.087-.18a5.55 5.55 0 0 0-.358-.531c-.23-.332-.428-.686-.6-1.057a.52.52 0 0 1 .068-.4 2.29 2.29 0 0 1-.111-.269c1.82-1.085 3.18-2.8 3.823-4.82l.284.05c.102-.093.236-.142.373-.138.397.076.786.2 1.162.34.195.09.395.166.598.23.048.013.118.024.172.037h.013a.67.67 0 0 0 .841-.851.67.67 0 0 0-.544-.446l-.194-.046a5.57 5.57 0 0 0-.64-.05c-.404-.026-.804-.092-1.194-.197-.12-.067-.22-.167-.288-.288l-.27-.08a8.65 8.65 0 0 0-1.386-5.993l.236-.218c-.01-.137.035-.273.124-.378.307-.264.64-.497.99-.696a5.57 5.57 0 0 0 .552-.323l.146-.118a.67.67 0 0 0-.133-1.202.67.67 0 0 0-.696.161l-.148.118a5.57 5.57 0 0 0-.437.465c-.264.302-.556.577-.873.823a.74.74 0 0 1-.404.044l-.253.18c-1.46-1.53-3.427-2.48-5.535-2.67 0-.1-.013-.25-.015-.297-.113-.078-.192-.197-.218-.332a6.23 6.23 0 0 1 .076-1.207c.043-.21.073-.42.092-.633v-.2c.02-.384-.27-.713-.655-.74zm-.834 5.166l-.2 3.493h-.015c-.01.216-.137.4-.332.504s-.426.073-.6-.054l-2.865-2.03a6.86 6.86 0 0 1 3.303-1.799c.234-.05.47-.088.707-.114zm1.668 0c1.505.187 2.906.863 3.99 1.924l-2.838 2.017c-.175.14-.415.168-.618.072s-.333-.3-.336-.524zm-6.72 3.227l2.62 2.338v.015c.163.142.234.363.186.574s-.21.378-.417.435v.01l-3.362.967a6.86 6.86 0 0 1 .974-4.34zm11.753 0c.796 1.295 1.148 2.814 1.002 4.327l-3.367-.97v-.013c-.21-.057-.37-.224-.417-.435s.023-.43.186-.574l2.6-2.327zm-6.404 2.52h1.072l.655.832-.238 1.04-.963.463-.965-.463-.227-1.04zm3.434 2.838c.045-.005.1-.005.135 0l3.467.585c-.5 1.44-1.487 2.67-2.775 3.493l-1.34-3.244a.59.59 0 0 1 .509-.819zm-5.823.015c.196.003.377.104.484.268s.124.37.047.55v.013l-1.332 3.218C11 21.54 10.032 20.325 9.517 18.9l3.437-.583c.038-.004.077-.004.116 0zm2.904 1.4a.59.59 0 0 1 .537.308h.013l1.694 3.057-.677.2c-1.246.285-2.547.218-3.758-.194l1.7-3.057c.103-.18.293-.29.5-.295z" fill="#fff" stroke="#fff" stroke-width=".055"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 64px;" viewBox="-35.5 26 32 32" width="64" height="64"><path d="M-33.442 42.023v-7.637a.68.68 0 0 1 .385-.651l13.173-7.608c.237-.148.503-.178.74-.03l13.232 7.637a.71.71 0 0 1 .355.651V49.63a.71.71 0 0 1-.355.651l-11.367 6.57a56.27 56.27 0 0 1-1.806 1.036c-.266.148-.533.148-.8 0l-13.202-7.608c-.237-.148-.355-.326-.355-.622v-7.637z" fill="#009438"/><path d="M-24.118 39.18v8.9c0 1.006-.8 1.894-1.865 1.865-.65-.03-1.154-.296-1.5-.858-.178-.266-.237-.562-.237-.888V35.836c0-.83.503-1.42 1.154-1.687s1.302-.207 1.954 0c.622.178 1.095.562 1.5 1.036l7.874 9.443c.03.03.06.09.118.148v-9c0-.947.65-1.687 1.57-1.776 1.154-.148 1.924.68 2.042 1.54v12.6c0 .7-.326 1.214-.918 1.54-.444.237-.918.296-1.42.266a3.23 3.23 0 0 1-1.954-.829c-.296-.266-.503-.592-.77-.888l-7.49-8.97c0-.03-.03-.06-.06-.09z" fill="#fefefe"/></svg>
        <h3>K8s Ingress controller</h3>
        <p>Deploy the Wallarm Ingress controller based on the official NGINX Ingress controller</p>
    </a>

    <a href="../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container/" class="navigation-card platform-card" style="padding: 24px 32px; font-size: 14px;">
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 64px;" viewBox="0 0 32 32" width="64" height="64"><path d="M15.9.476a2.14 2.14 0 0 0-.823.218L3.932 6.01c-.582.277-1.005.804-1.15 1.432L.054 19.373c-.13.56-.025 1.147.3 1.627q.057.087.12.168l7.7 9.574c.407.5 1.018.787 1.662.784h12.35c.646.001 1.258-.3 1.664-.793l7.696-9.576c.404-.5.555-1.16.4-1.786L29.2 7.43c-.145-.628-.57-1.155-1.15-1.432L16.923.695A2.14 2.14 0 0 0 15.89.476z" fill="#326ce5"/><path d="M16.002 4.542c-.384.027-.675.356-.655.74v.188c.018.213.05.424.092.633a6.22 6.22 0 0 1 .066 1.21c-.038.133-.114.253-.218.345l-.015.282c-.405.034-.807.096-1.203.186-1.666.376-3.183 1.24-4.354 2.485l-.24-.17c-.132.04-.274.025-.395-.04a6.22 6.22 0 0 1-.897-.81 5.55 5.55 0 0 0-.437-.465l-.148-.118c-.132-.106-.294-.167-.463-.175a.64.64 0 0 0-.531.236c-.226.317-.152.756.164.983l.138.11a5.55 5.55 0 0 0 .552.323c.354.197.688.428.998.7a.74.74 0 0 1 .133.384l.218.2c-1.177 1.766-1.66 3.905-1.358 6.006l-.28.08c-.073.116-.17.215-.286.288a6.22 6.22 0 0 1-1.194.197 5.57 5.57 0 0 0-.64.05l-.177.04h-.02a.67.67 0 0 0-.387 1.132.67.67 0 0 0 .684.165h.013l.18-.02c.203-.06.403-.134.598-.218.375-.15.764-.265 1.162-.34.138.008.27.055.382.135l.3-.05c.65 2.017 2.016 3.726 3.84 4.803l-.122.255c.056.117.077.247.06.376-.165.382-.367.748-.603 1.092a5.58 5.58 0 0 0-.358.533l-.085.18a.67.67 0 0 0 .65 1.001.67.67 0 0 0 .553-.432l.083-.17c.076-.2.14-.404.192-.61.177-.437.273-.906.515-1.196a.54.54 0 0 1 .286-.14l.15-.273a8.62 8.62 0 0 0 6.146.015l.133.255c.136.02.258.095.34.205.188.358.34.733.456 1.12a5.57 5.57 0 0 0 .194.611l.083.17a.67.67 0 0 0 1.187.131.67.67 0 0 0 .016-.701l-.087-.18a5.55 5.55 0 0 0-.358-.531c-.23-.332-.428-.686-.6-1.057a.52.52 0 0 1 .068-.4 2.29 2.29 0 0 1-.111-.269c1.82-1.085 3.18-2.8 3.823-4.82l.284.05c.102-.093.236-.142.373-.138.397.076.786.2 1.162.34.195.09.395.166.598.23.048.013.118.024.172.037h.013a.67.67 0 0 0 .841-.851.67.67 0 0 0-.544-.446l-.194-.046a5.57 5.57 0 0 0-.64-.05c-.404-.026-.804-.092-1.194-.197-.12-.067-.22-.167-.288-.288l-.27-.08a8.65 8.65 0 0 0-1.386-5.993l.236-.218c-.01-.137.035-.273.124-.378.307-.264.64-.497.99-.696a5.57 5.57 0 0 0 .552-.323l.146-.118a.67.67 0 0 0-.133-1.202.67.67 0 0 0-.696.161l-.148.118a5.57 5.57 0 0 0-.437.465c-.264.302-.556.577-.873.823a.74.74 0 0 1-.404.044l-.253.18c-1.46-1.53-3.427-2.48-5.535-2.67 0-.1-.013-.25-.015-.297-.113-.078-.192-.197-.218-.332a6.23 6.23 0 0 1 .076-1.207c.043-.21.073-.42.092-.633v-.2c.02-.384-.27-.713-.655-.74zm-.834 5.166l-.2 3.493h-.015c-.01.216-.137.4-.332.504s-.426.073-.6-.054l-2.865-2.03a6.86 6.86 0 0 1 3.303-1.799c.234-.05.47-.088.707-.114zm1.668 0c1.505.187 2.906.863 3.99 1.924l-2.838 2.017c-.175.14-.415.168-.618.072s-.333-.3-.336-.524zm-6.72 3.227l2.62 2.338v.015c.163.142.234.363.186.574s-.21.378-.417.435v.01l-3.362.967a6.86 6.86 0 0 1 .974-4.34zm11.753 0c.796 1.295 1.148 2.814 1.002 4.327l-3.367-.97v-.013c-.21-.057-.37-.224-.417-.435s.023-.43.186-.574l2.6-2.327zm-6.404 2.52h1.072l.655.832-.238 1.04-.963.463-.965-.463-.227-1.04zm3.434 2.838c.045-.005.1-.005.135 0l3.467.585c-.5 1.44-1.487 2.67-2.775 3.493l-1.34-3.244a.59.59 0 0 1 .509-.819zm-5.823.015c.196.003.377.104.484.268s.124.37.047.55v.013l-1.332 3.218C11 21.54 10.032 20.325 9.517 18.9l3.437-.583c.038-.004.077-.004.116 0zm2.904 1.4a.59.59 0 0 1 .537.308h.013l1.694 3.057-.677.2c-1.246.285-2.547.218-3.758-.194l1.7-3.057c.103-.18.293-.29.5-.295z" fill="#fff" stroke="#fff" stroke-width=".055"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 64px;" viewBox="-35.5 26 32 32" width="64" height="64"><path d="M-33.442 42.023v-7.637a.68.68 0 0 1 .385-.651l13.173-7.608c.237-.148.503-.178.74-.03l13.232 7.637a.71.71 0 0 1 .355.651V49.63a.71.71 0 0 1-.355.651l-11.367 6.57a56.27 56.27 0 0 1-1.806 1.036c-.266.148-.533.148-.8 0l-13.202-7.608c-.237-.148-.355-.326-.355-.622v-7.637z" fill="#009438"/><path d="M-24.118 39.18v8.9c0 1.006-.8 1.894-1.865 1.865-.65-.03-1.154-.296-1.5-.858-.178-.266-.237-.562-.237-.888V35.836c0-.83.503-1.42 1.154-1.687s1.302-.207 1.954 0c.622.178 1.095.562 1.5 1.036l7.874 9.443c.03.03.06.09.118.148v-9c0-.947.65-1.687 1.57-1.776 1.154-.148 1.924.68 2.042 1.54v12.6c0 .7-.326 1.214-.918 1.54-.444.237-.918.296-1.42.266a3.23 3.23 0 0 1-1.954-.829c-.296-.266-.503-.592-.77-.888l-7.49-8.97c0-.03-.03-.06-.06-.09z" fill="#fefefe"/></svg>
        <h3>K8s Sidecar container</h3>
        <p>Run the NGINX-based Wallarm node as the K8s sidecar container</p>
    </a>
</div>


## DEB and RPM packages

<div class="navigation platforms">
    
<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="debian9" class="platform-card-button" onClick="platformClicked(event, 'debian9')">
    <img class="platform-icon" src="../../images/platform-icons/debian.svg">
        <h3>Debian 9.x Stretch
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="debian9Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from Debian repo</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="debian9back" onClick="platformClicked(event, 'debian9back')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/debian.svg">
        <h3>Debian 9.x Stretch (backports)
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="debian9backId" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from Debian repo</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="debian10" onClick="platformClicked(event, 'debian10')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/debian.svg">
        <h3>Debian 10.x Buster
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="debian10Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from Debian repo</a>
        </div>
    </div>
</div> 
</div>

<div class="navigation platforms" style="padding-top: 16px;">

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="debian11" onClick="platformClicked(event, 'debian11')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/debian.svg">
        <h3>Debian 11.x Bullseye
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="debian11Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from Debian repo</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="ubuntu18" onClick="platformClicked(event, 'ubuntu18')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/ubuntu.svg">
        <h3>Ubuntu 18.04 Bionic
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="ubuntu18Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../admin-en/installation-kong-en/" onClick="noAction(event)">Kong</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="ubuntu20" onClick="platformClicked(event, 'ubuntu20')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/ubuntu.svg">
        <h3>Ubuntu 20.04 Focal
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="ubuntu20Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
        </div>
    </div>
</div>
</div>

<div class="navigation platforms" style="padding-top: 16px;">

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="centos6" onClick="platformClicked(event, 'centos6')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/centos.svg">
        <h3>CloudLinux OS 6.x
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="centos6Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from CentOS repo</a>
        </div>
    </div>
</div>

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="centos7" onClick="platformClicked(event, 'centos7')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/centos.svg">
        <h3>CentOS 7.x
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="centos7Id" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from CentOS repo</a>
            <a href="../../admin-en/installation-kong-en/" onClick="noAction(event)">Kong</a>
        </div>
    </div>
</div> 

    <div id="deployOptionsDiv" class="navigation-card platform-card">
        <div type="button" id="alinux2" onClick="platformClicked(event, 'alinux2')" class="platform-card-button">
            <img class="platform-icon" src="../../images/platform-icons/amazon-linux.svg">
            <h3>Amazon Linux 2.0.2021x and lower
                <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
                </svg>
            </h3>
            <p>Install the Wallarm module for...</p>
            <div id="alinux2Id" class="options-list" style="display: none;">
                <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
                <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            </div>
        </div>
    </div> 

</div>

<div class="navigation platforms" style="padding-top: 16px;">

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="almalinux" onClick="platformClicked(event, 'almalinux')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/almalinux.svg">
        <h3>AlmaLinux
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="almalinuxId" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from CentOS repo</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="rockylinux" onClick="platformClicked(event, 'rockylinux')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/rockylinux.svg">
        <h3>Rocky Linux
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="rockylinuxId" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from CentOS repo</a>
        </div>
    </div>
</div> 

<div id="deployOptionsDiv" class="navigation-card platform-card">
    <div type="button" id="oraclelinux" onClick="platformClicked(event, 'oraclelinux')" class="platform-card-button">
        <img class="platform-icon" src="../../images/platform-icons/oracle-linux.svg">
        <h3>Oracle Linux 8.x
            <svg class="options-drop" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 8L14.5 12L10.5 16" stroke="#959DAC" stroke-width="2" stroke-linecap="square"/>
            </svg>
        </h3>
        <p>Install the Wallarm module for...</p>
        <div id="oraclelinuxId" class="options-list" style="display: none;">
            <a href="../../installation/nginx/dynamic-module/" onClick="noAction(event)">NGINX Stable</a>
            <a href="../../installation/nginx-plus/" onClick="noAction(event)">NGINX Plus</a>
            <a href="../../installation/nginx/dynamic-module-from-distr/" onClick="noAction(event)">NGINX from CentOS repo</a>
        </div>
    </div>
</div> 

</div>