# NVIDIA 视频与图像硬件解码

## 1. 概述

NVIDIA GPU 并不只是 CUDA Core 和 Tensor Core。从 Fermi 开始，芯片上就有独立的固定功能视频解码引擎 **NVDEC**；后续代际又补上了硬件编码器 **NVENC** 和 JPEG 解码引擎 **NVJPEG / NVJPG**。这些媒体引擎和 SM 上的通用计算是分开的：解码不会抢 Tensor Core 的算力，CUDA Kernel 也不会占用 NVDEC 的吞吐。

对 AI 基础设施来说，这件事越来越重要。多模态训练和视频理解推理里，真正先卡住流水线的往往不是模型，而是 **CPU 解码 + Host-to-Device 拷贝**。把码流直接交给 NVDEC，解码结果落在显存里，再交给 CUDA / DALI / TensorRT，才能把预处理从 CPU 上卸下来。

本章回答三个问题：

- GPU 上的解码硬件是什么、和 CUDA 是什么关系；
- 从容器文件到 CUDA device pointer，软件流水线怎么走；
- 在训练数据加载、多模态推理、转码这几类场景里该怎么选型。

> 注意：大模型推理里的 Prefill / Decode（逐 token 生成）是另一条完全不同的路径，不在本章范围。相关内容见 [推理系统](../../../09_inference_system/README.md)。

## 2. 文档导航

- **[NVIDIA 硬件解码流程：从 NVDEC 到 AI 推理输入](01_nvidia_decode_pipeline.md)**：完整讲解 NVDEC 硬件、三阶段流水线（Demux / Parser / Decoder）、NVDECODE API 调用顺序、生产者-消费者线程模型、显存路径、图像解码（NVJPEG）、以及 DALI / FFmpeg / DeepStream 等上层框架的落地方式。
- **[离线文档包 / 官方副本](references/README.md)**：中文指南与 NVIDIA Video Codec SDK 13.1 公开文档的离线 ZIP、HTML、Markdown，可直接下载阅读。

## 3. 相关资源

- [深入理解 GPU 架构](../understand_gpu_architecture/README.md) — 先看清 SM、显存层次，再理解 NVDEC 作为独立引擎的位置
- [多模态推理优化](../../../09_inference_system/reference_design/10-多模态推理优化.md) — 解码之后，视觉 token 如何进入推理服务
- [离线下载：nvidia_nvdec_decode_docs.zip](references/nvidia_nvdec_decode_docs.zip) — 中文指南 + SDK 13.1 官方文档离线包
- [NVIDIA Video Codec SDK](https://developer.nvidia.com/video-codec-sdk) — 官方 SDK、能力矩阵与样例（需登录下载安装包）
- [NVDEC Video Decoder API Programming Guide](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvdec-video-decoder-api-prog-guide/) — NVDECODE API 权威参考
