---
search:
  exclude: true
hide:
  - navigation
  - toc
  - feedback
---

<meta name="robots" content="noindex, noarchive, nofollow">


# Cloudfront for wizard

You can connect the Wallarm Edge node to Amazon CloudFront to inspect traffic in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

1. Download the provided code bundle for your platform.
1. Proceed to your AWS Console → **Services** → **Lambda** → **Functions**.
1. Select the `us-east-1` (N. Virginia) region which is [required for Lambda@Edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function).
1. **Create function** with the following settings:

    * Runtime: Python 3.x.
    * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
    * Other settings can remain as default.
1. Once the function is created, on the **Code** tab, paste the Wallarm request processing code.
1. Update the following parameters in the code:

    * `wlrm_node_addr`: your Wallarm node URL.
    * `wlrm_inline`: if using [asynchronous (out-of-band)](../oob/overview.md) mode, set to `False`.
    * If necessary, modify other parameters.
1. Proceed to **Actions** → **Deploy to Lambda@Edge** and specify the following settings:

    * Configure new CloudFront trigger.
    * Distribution: your CDN that routes traffic to the origin you want to protect.
    * Cache behavior: the cache behavior for the Lambda function, typically `*`.
    * CloudFront event: 
        
        * **Origin request**: executes the function only when CloudFront CDN requests data from the backend. If CDN returns a cached response, the function will not be executed.
        * **Viewer request**: executes the function for every request to CloudFront CDN.
    * Check **Include body**.
    * Check **Confirm deploy to Lambda@Edge**.
1. Repeat the procedure for the Wallarm-provided response function, selecting responses as the trigger.

    Ensure the response trigger matches the request trigger (origin response for origin request, viewer response for viewer request).

[More details](aws-lambda.md)

<style>
  h1#cloudfront-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>