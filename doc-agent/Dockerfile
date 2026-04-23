FROM public.ecr.aws/lambda/python:3.12

# Install git (needed to clone docs repo and push changes)
RUN dnf install -y git && dnf clean all

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application code
COPY handler.py context_gatherer.py agent_runner.py ./
COPY prompts/ ./prompts/

CMD ["handler.worker_handler"]
