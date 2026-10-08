<!--
  참여 과제·연구 주제 단위로 쓴다.
  ## 과제/연구 이름
  - tag: CAML, National R&D   (분야·과제 키워드, 쉼표로 최대 2개)
  - org: ETRI                 (선택: 수행 기관)
  - period: 2025.02 – present (선택: 오른쪽 위에 표시)
  - metric: 성과 한 줄          (선택: 카드 맨 아래 초록 글씨)
  - wide: yes                 (선택: 카드를 한 줄 전체 너비로)
  - date: 2025-02             (선택: 있으면 최신순, 없으면 적은 순서대로)
  그 아래 문단은 설명, "- " 로 시작하는 줄은 글머리표 목록.
  주의: 글머리표를 "단어: ..." 로 시작하면 key 로 읽히니 콜론으로 시작하지 말 것.
-->

## Competency-Aware Machine Learning (CAML)
- tag: National R&D, Vision Foundation Models
- org: ETRI · IITP (2022-0-00124)
- period: 2025.02 – present
- metric: ICT Express 2026 (SCIE, Q1) · KR/US patent applications · arXiv 2026
- wide: yes

A national R&D project on [AI that recognizes its own learning competency](https://etri-visualintelligence.github.io/caml/) and uses it to deliver appropriate results. Within CAML, I study how a model can **know which pretrained vision experts to rely on**, and compose them, for each task.

- **Competency-aware expert routing (TAVER).** Defined expert competency as the reduction in predictive uncertainty induced by inter-expert interaction, and used it to learn task-adaptive routing over ViT, CLIP, and SAM experts guided by text task embeddings. Improved accuracy by 2.78 pp on average over plain feature fusion (11.63 pp on fine-grained Aircraft).
- **Orchestrating frozen vision foundation models (COVE).** Composed frozen VFMs for multi-task dense prediction with Synergy Composers and a Task-Conditioned Router, preventing routing collapse via Gaussian logit perturbation and counterfactual supervision. Surpasses every single frozen expert on every task on NYUD-v2 and PASCAL-Context with roughly half the computation of recent VFM-based methods.

## Token-Efficient Vision-Language Models
- tag: Vision-Language Models, Efficient Inference
- org: ETRI
- period: 2026
- metric: NeurIPS 2026 Workshop (VLM4RWD)

Visual tokens dominate VLM inference cost. **Foveated Compression** asks *where* fidelity should be kept under a fixed token budget: it encodes the image once at full resolution, compresses it with a self-distilled Foveated Merger (11.11% of visual tokens), and restores one selected region to native resolution with a learned Foveated Selector. The analysis exposes complementary bottlenecks in region selection and compressed-region fidelity.

## AI-Based Illegal Banner Detection
- tag: Scene Text Understanding, Vision-Language Models
- org: ETRI
- period: 2024.05 – 2025.01

A project on detecting illegal banners in real-world street and CCTV imagery by understanding the text they carry. The system combines polygon-level scene text detection robust to the varied shapes of banners, transformer-based text recognition that draws on vision-language language context to correct degraded text, and user-defined object detection with tracking so recognition need not rerun on every frame.

- Developed lightweight vision models for detecting illegal banners and outdoor advertisements.
- Studied foundation-model-based classification, combining an LLM with scene-text recognition results to classify advertisements.

## Shadow Removal
- tag: Image Generation, Image Restoration
- org: Kyonggi University
- period: 2023.03 – 2025.02
- metric: Multimedia Systems 2025 (SCIE, Q2)

M.S. research on restoring shadow regions while keeping the rest of the image consistent. **SFR-Net** combines supervised learning, a feature refinement loss, and knowledge distillation, with post-processing for natural color consistency (ISTD+ RMSE 3.46 / SSIM 0.938). My thesis extended this to a multi-resolution fusion transformer-based diffusion model for better generalization.

## Geospatial Digital Twin
- tag: Digital Twin, 3D Geospatial
- org: ETRI (Research Intern)
- period: 2022.07 – 2022.08

Developed a texture calibration module for an integrated geospatial digital-twin prototype.
