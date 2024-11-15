
# HPC Cluster Live Demo Guide

## 1. Setting Up Conda Environment

### Install Miniconda from Source
1. Download the Miniconda installer:
   ```bash
   wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
   ```
2. Make the installer executable:
   ```bash
   chmod +x Miniconda3-latest-Linux-x86_64.sh
   ```
3. Run the installer:
   ```bash
   ./Miniconda3-latest-Linux-x86_64.sh
   ```
   - Follow the on-screen prompts to complete the installation.

4. Add Miniconda to your PATH:
   ```bash
   export PATH=~/miniconda3/bin:$PATH
   source ~/.bashrc
   ```

5. Verify the installation:
   ```bash
   conda --version
   ```

### Create and Activate a Conda Environment
1. Create a new environment (e.g., `myenv`) with Python 3.8:
   ```bash
   conda create -n myenv python=3.8
   ```
2. Activate the environment:
   ```bash
   conda activate myenv
   ```

## 2. Setting Up Jupyter Notebook

### Option 1: Using PowerShell or Tabby for SSH Tunneling
1. Install Jupyter Notebook within the Conda environment:
   ```bash
   pip install notebook
   ```
2. Start Jupyter Notebook on the HPC cluster without a browser:
   ```bash
   jupyter notebook --no-browser --port=8888
   ```
3. On your local machine, open PowerShell or Tabby and set up an SSH tunnel:
   ```bash
   ssh -L 8888:localhost:8888 <your-username>@headnode01.hpc.gla.ac.uk
   ```
   - Accept the fingerprint prompt and enter your password.

4. Open the Jupyter Notebook link in your local browser:
   ```
   http://127.0.0.1:8888/tree?token=<your-token>
   ```

### Option 2: Using Visual Studio Code
1. Open VS Code and install the **Remote - SSH** extension.
2. Use the Command Palette (Ctrl+Shift+P) to connect to the HPC cluster:
   ```
   Remote-SSH: Connect to Host
   ```
3. Enter the hostname:
   ```
   headnode01.hpc.gla.ac.uk
   ```
4. Open a terminal in VS Code and follow the steps to start the Jupyter Notebook server.

## 3. Basic Linux Commands

These basic Linux commands will help you navigate and manage files in your cluster environment:

- **Check Current Directory**:
  ```bash
  pwd
  ```

- **List Files and Directories**:
  ```bash
  ls
  ```

- **Change Directory**:
  ```bash
  cd <directory-name>
  ```

- **Create a Directory**:
  ```bash
  mkdir <directory-name>
  ```

- **Move or Rename Files**:
  ```bash
  mv <source-file> <destination>
  ```

- **Delete Files and Directories**:
  ```bash
  rm <file-name>
  ```

- **View File Contents**:
  ```bash
  cat <file-name>
  ```

- **Check Disk Usage**:
  ```bash
  du -sh
  ```

## 4. Submitting a Job on the HPC Cluster

Create a simple Slurm job script (e.g., `job_example.slurm`) for submitting a job:

```bash
#!/bin/bash
#SBATCH --job-name=example-task
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --mem=64GB
#SBATCH --cpus-per-task=8
#SBATCH --time=00:10:00

module load python/3.8
python example_script.py
```

Submit the job:
```bash
sbatch job_example.slurm
```

Monitor the job:
```bash
squeue -u <your-username>
```

## 5. Starting an Interactive Session

If you want to run commands interactively:
```bash
srun --partition=gpu --gres=gpu:1 --mem=64GB --cpus-per-task=8 --pty bash
```

This document should guide you through the demo and help your audience follow along with each step.
