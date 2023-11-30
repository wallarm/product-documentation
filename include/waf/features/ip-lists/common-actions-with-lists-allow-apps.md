[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## API calls to get, populate and delete IP list objects

To get, populate and delete IP list objects, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below are some examples of the corresponding API calls.

### API request parameters

Parameters to be passed in the API requests to read and change IP lists:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Add to the list the entries from the `.csv` file

To add to the list the IPs or subnets from the `.csv` file, use the following bash script:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Add to the list a single IP or subnet

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Add to the list multiple countries

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Add to the list multiple proxy services

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### Delete an object from the IP list

Objects are deleted from IP lists by their IDs.

To get an object ID, request the IP list contents and copy `objects.id` of the required object from a response:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Having the object ID, send the following request to delete it from the list:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

You can delete multiple objects at once passing their IDs as an array in the deletion request.