# 视频编解码引擎（Video Codec）

## 1. 概述

AI 推理卡在处理视频类任务（多模态理解、视频分析、转码等）时，通常都会内置独立于计算核心（GPU Tensor Core / NPU 矩阵引擎）之外的**固定功能视频编解码引擎**——解码结果直接落在显存/设备内存里，避免"解码在 CPU、推理在加速卡"这条路径反复占用 PCIe 带宽和 CPU 算力。

NVIDIA 通过 NVDECODE API（`cuviddec.h` + `nvcuvid.h`）把这套能力标准化为 Video Parser + Video Decoder 两个组件，是业界事实上的参考设计。自研 AI 推理卡（NPU）要接入现有的视频处理生态（DALI、FFmpeg、DeepStream 等上层框架及其相关生态工具链），往往需要在**接口语义**上向 NVIDIA 靠拢，同时解决"解码引擎与推理引擎分属两套独立 Runtime、如何共享显存实现零拷贝"这一自身架构带来的额外问题。

## 2. 文档导航

- **[推理卡编解码方案对齐：以 NxVdec 对齐 NVIDIA NVDEC 为例](01_inference_card_decode_interface_alignment.md)**：完整梳理 NVIDIA NVDEC 与某自研推理卡视频解码模块（文中占位命名为 `NxVdec`）的接口对比，重点给出「`cuvidMapVideoFrame` 语义对齐」与「零拷贝」两个核心问题的四种候选方案设计、必要条件、优缺点矩阵及选型建议。编码（NVENC / NxVenc）对齐部分待补充。
  - **[PDF 版本](01_inference_card_decode_interface_alignment.pdf)**：同一份内容的排版导出（含所有顺序图/表格），便于离线阅读与分享；Markdown 为唯一可编辑的源文件，PDF 为渲染导出产物，更新文档后需重新导出。

## 3. 相关资源

- [深入理解 GPU 架构](../nvidia/understand_gpu_architecture/README.md) — 理解 GPU 上通用计算单元与固定功能媒体引擎的关系
- [GPGPU vs NPU：大模型推理训练对比](../nvidia/GPGPU_vs_NPU_大模型推理训练对比.md) — 通用计算路线与专用加速路线的选型背景
- [NVIDIA GPUDirect P2P 技术详解](../gpudirect/02_gpudirect_p2p.md) — 零拷贝设计中涉及的设备间直接显存访问背景技术
- [多模态推理优化](../../09_inference_system/reference_design/10-多模态推理优化.md) — 解码之后，视觉 token 如何进入推理服务
- [NVIDIA Video Codec SDK](https://developer.nvidia.com/video-codec-sdk) — 官方 SDK、能力矩阵与样例（需登录下载安装包）
