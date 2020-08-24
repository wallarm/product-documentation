# Deploying WAF Node in AWS Using Terraform

### On the first run terraform apply command fails with message "Error: Provider produced inconsistent final plan". What to do?

Please try to run `terraform apply` one more time. This should solve the problem.

### How to access the created WAF node instances?

You can get a remote access to the server using user `admin` and proper SSH private key.

### It looks like a WAF node is not getting configured properly. How to debug the instance?

1. Get a remote access to the server using user `admin` and proper SSH private key.
2. Review cloud-init logs:

    * `/var/log/cloud-init.log`
    * `/var/log/cloud-init-output.log`
3. Review running processes using the command `ps -ef`.
4. Check the NGINX configuration for correctness using command `nginx -t`.
5. Review NGINX error logs in the file `/var/log/nginx/error.log`.