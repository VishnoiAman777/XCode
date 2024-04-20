# AI Code Completion Project

To view the demonstration video, please click [here](videos/screen-capture.webm).


This project utilizes AI models for code completion with a backend running on FastAPI. The code completions are powered by Language Model (LLM) optimized via OpenVINO.

## Running the Project

1. **Run Docker Container**: First, you need to run a Docker container hosting the model. Use the following command:
    ```
    docker run --rm -p 8000:8000 --name server -e MODEL=${model} -e DEVICE=${device} vishnoiaman777/openvino
    ```
    - `model` can be any of the available models listed below.
        - aless2212/Mistral-7B-v0.2-openvino-int8-cpu 
        -fakezeta/Starling-LM-7B-beta-openvino-int4 
        - chgk13/stablecode-completion-alpha-3b-4k-openvino-int8 
        - chgk13/decicoder-1b-openvino-int8 
    - `device` can be one of the variables.
        - cpu
        - gpu: only if you have intel GPU's present(Not NVIDIA)

2. **Download Extension**: Download the extension `amanvishnoi777.xcode`. You can download it from the VSCode extension pane or via `ext install AmanVishnoi777.xcode`.

## Weight Compression

Weight compression is adopted as a technique for optimization. It is similar to quantization, converting Float32 to Int8, but only the weights are compressed while the activation remains in Float32 format. Multiple modes are available, such as Int8, Int4-Asymc.

### Compression Results

| Model                                                 | Parameter Compression | Model Size (GB) | Mem Required |
|-------------------------------------------------------|-----------------------|-----------------|--------------|
| Mistral-7B                                            | Float32               | 29.48GB         | 16GB RAM     |
| aless2212/Mistral-7B-v0.2-openvino-int8-cpu          | Int8                  | 11GB            | 8GB RAM      |
| stablecode-completion-alpha-4k                        | Float32               | 14.1GB          | 8GB RAM      |
| chgk13/stablecode-completion-alpha-3b-4k-openvino-int8| Int8                  | 2.79GB          | 4GB RAM      |

## Workflow with OpenVINO Models

The general workflow for using OpenVINO Models typically involves these stages:

1. **Creating OpenVINO Model**: Import models from existing frameworks like Tensorflow, Keras, PyTorch, MxNet, ONNX.
2. **Model Optimizer**: Convert models into Intermediate Representation (IR) for optimized representation.
3. **Inference Requests**: Two types of modes are available for better inference:
   - **Async Mode**: Chosen to optimize requests.

