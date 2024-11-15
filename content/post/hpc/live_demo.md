
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
  or
  ```bash
  rm -rf <folder-name>
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

## 6. Slurm Commands and Job Scheduling Basics

### Common Slurm Parameters
Slurm parameters allow you to specify your resource requests. Below are the most commonly used ones:

| Example Parameter              | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| `--job-name="Test-Job-1"`      | Specify a name for the job.                                                 |
| `--nodes=2`                    | Number of servers to run the job on. Use only for parallel processing.      |
| `--cpus-per-task=8`            | Number of CPUs per process. Useful for multithreaded jobs.                 |
| `--gres=gpu:1`                 | Number of GPUs to request.                                                 |
| `--mem=16G`                    | Amount of memory per node. Default is megabytes unless a suffix is used.   |
| `--partition=gpu`              | Specify the partition to use (e.g., `cpu`, `gpu`).                         |
| `--time=00-01:00:00`           | Total runtime limit for the job.                                           |
| `--mail-user=<email>`          | Email address for notifications (e.g., job start, end, failure).           |
| `--mail-type=BEGIN,END,FAIL`   | Types of notifications to send.                                            |

### Interactive Jobs
Interactive jobs allow you to debug submission scripts, install software, or prepare environments. Use interactive jobs sparingly and for short durations.

Example command:
```bash
srun --job-name="Interactive-Job" --partition=gpu --gres=gpu:1 --mem=16G --time=02:00:00 --pty bash
```

### Batch Jobs
Batch jobs are the recommended way to run jobs on the HPC cluster. Below is an example of a submission script (`job_example.sh`):

```bash
#!/bin/bash
#SBATCH --job-name="Test-Job-1"
#SBATCH --partition=gpu
#SBATCH --nodes=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=16G
#SBATCH --time=00-05:00:00
#SBATCH --mail-user=firstname.lastname@glasgow.ac.uk
#SBATCH --mail-type=BEGIN,END,FAIL

module load python
cd ~/work/calculations/pythonscripts
python myPythonCalcs.py
```

Submit the job:
```bash
sbatch job_example.sh
```

### Monitoring Jobs
Once your job is submitted, you can monitor it using the following commands:

- **View All Jobs**:
  ```bash
  squeue
  ```

- **View Your Jobs**:
  ```bash
  squeue -u <your-username>
  ```

- **Cancel Your Jobs**:
  ```bash
  scancel <your-jobid>
  ```