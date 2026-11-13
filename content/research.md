<!--
  참여 과제·연구 주제 단위로 쓴다. 한 줄에 한 과제씩, 왼쪽에 기간·기관, 오른쪽에 내용.
  ## 과제/연구 이름
  - tag: CAML, National R&D   (분야·과제 키워드, 쉼표로 최대 2개)
  - org: ETRI                 (선택: 수행 기관, 왼쪽 기간 아래)
  - period: 2025.02 – present (선택: 왼쪽 맨 위)
  - metric: 성과 한 줄          (선택: 맨 아래 초록 "OUTPUT" 줄)
  - date: 2025-02             (선택: 있으면 최신순, 없으면 적은 순서대로)
  그 아래 첫 문단은 "무엇을 왜 했는지" 한두 문장(진하게 표시), "- " 줄은 내가 한 일 목록.
  주의: 글머리표를 "단어: ..." 로 시작하면 key 로 읽히니 콜론으로 시작하지 말 것.
-->

## Competency-Aware Machine Learning (CAML)
- tag: Vision Foundation Models, National R&D
- org: ETRI · IITP national project
- period: 2025.02 – present
- metric: ICT Express 2026 (SCIE, Q1) · arXiv 2026 · KR/US patent applications

Pretrained vision models such as CLIP, SAM, and DINOv2 are each strong at different things. I build methods that pick **which experts to trust for a given task** and combine them, instead of naively fusing all of them. Part of the national [CAML project](https://etri-visualintelligence.github.io/caml/) on AI that knows its own competency.

- **TAVER** — routes each task to the right experts (ViT, CLIP, SAM) by scoring how much each one lowers prediction uncertainty. +2.78 pp accuracy on average over plain feature fusion, up to +11.63 pp on fine-grained Aircraft.
- **COVE** — combines frozen foundation models to solve several dense prediction tasks at once. Beats every individual expert on every task (NYUD-v2, PASCAL-Context) at about half the compute of recent VFM-based methods.

## Token-Efficient Vision-Language Models
- tag: Vision-Language Models, Efficient Inference
- org: ETRI
- period: 2026
- metric: NeurIPS 2026 Workshop (VLM4RWD)

Most of a VLM's cost comes from image tokens, but shrinking them loses small details like text and small objects. **Foveated Compression** keeps a cheap view of the whole image and zooms back to full resolution only on the one region that matters, like the fovea of the human eye.

- Encode the image once at full resolution, then compress it to 11.11% of the visual tokens with a self-distilled merger.
- A learned selector picks one region and restores it at native resolution.
- Analysis shows where the remaining errors come from: choosing the wrong region vs. losing detail in compressed regions.

## Illegal Banner Detection from Street Imagery
- tag: Scene Text, Vision-Language Models
- org: ETRI
- period: 2024.05 – 2025.01

Automatically finds illegal banners and outdoor ads in street and CCTV footage by **reading the text written on them**.

- Detected text of irregular, curved banner shapes with polygon-level scene text detection.
- Recognized blurry or damaged text with a transformer recognizer that uses language context to fix errors.
- Classified whether a banner is an advertisement by feeding the recognized text to an LLM.
- Added object tracking so text is not re-read on every frame, and built lightweight models for deployment.

## Shadow Removal for Digital-Twin Textures
- tag: Image Restoration, Digital Twin
- org: KGU · ETRI (Internship)
- period: 2022.07 – 2025.02
- metric: Multimedia Systems 2025 (SCIE, Q2) · M.S. thesis

Shadows baked into real-world photos make the textures of 3D digital twins look wrong. I remove them so the shadowed area looks naturally lit, **without changing the rest of the image**.

- **Digital twin texture calibration** — built a texture calibration module for ETRI's 3D geospatial digital-twin prototype, where the shadow problem first came up.
- **SFR-Net** — a teacher network guides the student to progressively refine shadow-region features (knowledge distillation), followed by post-processing that matches colors to the surrounding area. ISTD+ RMSE 3.46 / SSIM 0.938.
- **M.S. thesis** — extended this to a diffusion model with a multi-resolution fusion transformer so it generalizes better to unseen scenes.
