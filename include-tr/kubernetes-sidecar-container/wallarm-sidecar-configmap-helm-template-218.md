```
apiVersion: v1
kind: ConfigMap
metadata:
  name: wallarm-sidecar-nginx-conf
data:
  default: |
    geo $remote_addr $wallarm_mode_real {
      default {{ .Values.wallarm.mode | quote }};
      # ABD bulut tarayıcıları için IP adresleri ve kurallar
      104.237.151.202 kapalı;104.237.155.105 kapalı;172.104.208.113 kapalı;172.104.21.210 kapalı;172.104.22.150 kapalı;173.255.193.92 kapalı;192.155.82.205 kapalı;192.155.92.134 kapalı;192.81.135.28 kapalı;23.239.30.236 kapalı;23.239.4.41 kapalı;23.92.30.204 kapalı;34.94.218.5 kapalı;34.94.203.193 kapalı;34.94.238.221 kapalı;35.236.1.4 kapalı;35.236.118.146 kapalı;35.236.20.89 kapalı;45.33.15.249 kapalı;45.33.16.32 kapalı;45.33.43.225 kapalı;45.33.65.37 kapalı;45.33.79.18 kapalı;45.33.86.254 kapalı;45.56.113.41 kapalı;45.56.114.24 kapalı;45.56.122.184 kapalı;45.56.71.221 kapalı;45.56.72.191 kapalı;45.79.10.15 kapalı;45.79.115.178 kapalı;45.79.143.18 kapalı;45.79.186.159 kapalı;45.79.194.128 kapalı;45.79.216.187 kapalı;45.79.75.59 kapalı;45.79.75.91 kapalı;45.79.93.164 kapalı;50.116.11.251 kapalı;50.116.42.181 kapalı;66.175.222.237 kapalı;69.164.202.55 kapalı;72.14.184.100 kapalı;74.207.237.202 kapalı;96.126.124.141 kapalı;96.126.127.23 kapalı;88.80.188.20 kapalı;198.58.123.222 kapalı;192.155.84.216 kapalı;23.92.18.193 kapalı;23.92.18.191 kapalı;170.187.207.244 kapalı;198.58.123.201 kapalı;192.155.84.159 kapalı;88.80.188.16 kapalı;170.187.207.246 kapalı;45.56.103.238 kapalı;45.79.142.174 kapalı;45.79.142.244 kapalı;74.207.253.54 kapalı;74.207.253.122 kapalı;45.56.84.94 kapalı;45.79.73.64 kapalı;74.207.253.65 kapalı;74.207.253.161 kapalı;45.33.63.36 kapalı;23.239.21.250 kapalı;45.79.74.89 kapalı;45.79.100.81 kapalı;45.79.100.119 kapalı;45.79.100.174 kapalı;50.116.2.193 kapalı;50.116.2.228 kapalı;50.116.12.25 kapalı;192.155.81.166 kapalı;192.155.81.32 kapalı;192.155.81.97 kapalı;192.155.81.39 kapalı;192.155.81.195 kapalı;192.155.81.173 kapalı;192.155.81.62 kapalı;192.155.81.201 kapalı;192.155.81.193 kapalı;192.155.81.185 kapalı;192.155.81.204 kapalı;192.155.81.210 kapalı;192.155.81.205 kapalı;192.155.81.220 kapalı;139.162.181.97 kapalı;172.104.203.137 kapalı;172.105.78.225 kapalı;34.94.85.217 kapalı;34.94.51.234 kapalı;35.235.100.79 kapalı;34.102.45.38 kapalı;34.94.241.21 kapalı;34.102.59.122 kapalı;34.94.238.72 kapalı;34.102.90.100 kapalı;34.94.156.115 kapalı;35.235.115.105 kapalı;34.94.203.193 kapalı;34.94.238.221 kapalı;34.94.9.235 kapalı;
      # Avrupa bulut tarayıcıları için IP adresleri ve kurallar
      104.200.29.36 kapalı;104.237.151.23 kapalı;139.162.130.123 kapalı;139.162.130.66 kapalı;139.162.132.87 kapalı;139.162.144.202 kapalı;139.162.145.238 kapalı;139.162.146.245 kapalı;139.162.151.10 kapalı;139.162.151.155 kapalı;139.162.153.16 kapalı;139.162.156.102 kapalı;139.162.157.131 kapalı;139.162.158.79 kapalı;139.162.159.137 kapalı;139.162.159.244 kapalı;139.162.162.71 kapalı;139.162.163.61 kapalı;139.162.164.41 kapalı;139.162.166.202 kapalı;139.162.167.19 kapalı;139.162.167.48 kapalı;139.162.167.51 kapalı;139.162.168.17 kapalı;139.162.170.84 kapalı;139.162.171.141 kapalı;139.162.171.208 kapalı;139.162.172.35 kapalı;139.162.174.220 kapalı;139.162.174.26 kapalı;139.162.175.71 kapalı;139.162.176.169 kapalı;139.162.177.83 kapalı;139.162.178.148 kapalı;139.162.179.214 kapalı;139.162.180.37 kapalı;139.162.182.156 kapalı;139.162.182.20 kapalı;139.162.184.225 kapalı;139.162.184.33 kapalı;139.162.185.243 kapalı;139.162.186.129 kapalı;139.162.186.136 kapalı;139.162.187.138 kapalı;139.162.188.246 kapalı;139.162.190.165 kapalı;139.162.190.22 kapalı;139.162.190.86 kapalı;139.162.191.89 kapalı;172.104.128.103 kapalı;172.104.128.67 kapalı;172.104.139.37 kapalı;172.104.146.90 kapalı;172.104.150.243 kapalı;172.104.151.59 kapalı;172.104.152.244 kapalı;172.104.152.28 kapalı;172.104.152.96 kapalı;172.104.154.128 kapalı;172.104.157.26 kapalı;172.104.229.59 kapalı;172.104.233.100 kapalı;172.104.240.115 kapalı;172.104.241.162 kapalı;172.104.250.27 kapalı;172.104.252.112 kapalı;172.105.64.135 kapalı;172.105.65.182 kapalı;173.230.130.253 kapalı;173.230.138.206 kapalı;173.230.156.200 kapalı;173.230.158.207 kapalı;173.255.192.83 kapalı;173.255.200.80 kapalı;173.255.214.180 kapalı;23.239.11.21 kapalı;23.92.18.13 kapalı;34.90.114.30 kapalı;34.91.133.93 kapalı;34.91.54.247 kapalı;34.90.24.155 kapalı;35.204.60.30 kapalı;45.33.105.35 kapalı;45.33.115.7 kapalı;45.33.33.19 kapalı;45.33.41.31 kapalı;45.33.64.71 kapalı;45.33.72.81 kapalı;45.33.73.43 kapalı;45.33.80.65 kapalı;45.33.81.109 kapalı;45.33.88.42 kapalı;45.33.97.86 kapalı;45.33.98.89 kapalı;45.56.102.9 kapalı;45.56.104.7 kapalı;45.56.119.39 kapalı;45.56.69.211 kapalı;45.79.16.240 kapalı;50.116.23.110 kapalı;50.116.35.43 kapalı;50.116.43.110 kapalı;66.228.58.101 kapalı;72.14.181.105 kapalı;72.14.191.76 kapalı;85.90.246.120 kapalı;85.90.246.49 kapalı;176.58.99.236 kapalı;212.71.244.22 kapalı;212.71.244.239 kapalı;176.58.99.214 kapalı;212.71.244.128 kapalı;212.71.244.92 kapalı;178.79.168.193 kapalı;178.79.168.239 kapalı;178.79.168.200 kapalı;178.79.168.201 kapalı;178.79.168.241 kapalı;178.79.168.186 kapalı;
    }
    server {
        dinle 80 default_server;
        dinle [::]:80 varsayılan_sunucu ipv6only=on;
        server_name localhost;
        kök /usr/share/nginx/html;
        indeks index.html index.htm;
        wallarm_mode $wallarm_mode_real;
        # wallarm_instance 1;
        {{ eq .Values.wallarm.enable_ip_blocking "true" | eğerse }}
        wallarm_acl varsayılan;
        {{ son }}
        set_real_ip_from 0.0.0.0/0;
        real_ip_header X-Forwarded-For;
        konum / {
                proxy_pass http://localhost:{{ .Values.wallarm.app_container_port }};
                include proxy_params;
        }
    }
```